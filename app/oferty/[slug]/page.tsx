import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactDetailsSection from "@/components/ContactDetailsSection";
import AgentSidebarCard from "@/components/offers/AgentSidebarCard";
import PropertyGallery from "@/components/offers/PropertyGallery";
import { loadAsariOffers } from "@/lib/asari/loadOffers";
import { PLACEHOLDER_IMG } from "@/lib/asari/mapOffer";
import { photoNameFromApiUrl } from "@/lib/asari/photoUrl";
import { canonicalUrl } from "@/lib/seo/site";
import { notFound } from "next/navigation";

const OG_FALLBACK_IMAGE = "/hero-biuro.jpg.png";

/** Gdy na CI nie ma XML Asari, lista ofert jest pusta. Next.js 16 + output:export wymaga >0 ścieżek, inaczej rzuca mylący błąd „missing generateStaticParams”. */
const STATIC_EXPORT_EMPTY_SLUG = "__static_export_no_offers__";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { offers } = await loadAsariOffers();
  const params = offers.map((o) => ({ slug: o.slug }));
  if (params.length === 0) {
    return [{ slug: STATIC_EXPORT_EMPTY_SLUG }];
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === STATIC_EXPORT_EMPTY_SLUG) {
    return {
      title: "Oferta — Dan-Dom Nieruchomości",
      robots: { index: false, follow: false },
    };
  }
  const { offers } = await loadAsariOffers();
  const o = offers.find((x) => x.slug === slug);
  if (!o) return { title: "Oferta — Dan-Dom Nieruchomości" };
  const description = [o.transaction, o.category, o.locationLabel, o.priceLabel]
    .filter(Boolean)
    .join(" · ");
  const path = `oferty/${slug}`;
  const pageUrl = canonicalUrl(path);
  const ogImage = o.mainImageSrc ?? OG_FALLBACK_IMAGE;
  const ogTitle = `${o.title} — Dan-Dom Nieruchomości`;
  return {
    title: ogTitle,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: ogTitle,
      description,
      type: "website",
      locale: "pl_PL",
      siteName: "Dan-Dom Nieruchomości",
      url: pageUrl,
      images: [{ url: ogImage, alt: o.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function OfertaSinglePage({ params }: Props) {
  const { slug } = await params;
  if (slug === STATIC_EXPORT_EMPTY_SLUG) notFound();
  const { offers, error } = await loadAsariOffers();
  const o = offers.find((x) => x.slug === slug);
  if (!o) notFound();

  const gallerySorted = [...o.images].sort((a, b) => a.weight - b.weight);
  const fallbackName = photoNameFromApiUrl(o.mainImageSrc);
  const imagesForGallery =
    gallerySorted.length > 0
      ? gallerySorted
      : fallbackName
        ? [{ name: fallbackName, weight: 1 }]
        : [];
  const descriptionRaw = (o.descriptionHtml ?? "").trim();
  const descriptionHasHtml = /<\/?[a-z][\s\S]*>/i.test(descriptionRaw);
  const descriptionParagraphs = descriptionHasHtml
    ? []
    : descriptionRaw
        .split(/\r?\n+/)
        .map((chunk) => chunk.trim())
        .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black">
      <Navbar />

      <main className="px-3 py-6 sm:px-6 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px]">
          <Link
            href="/oferty"
            className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy hover:underline"
          >
            ← Wszystkie oferty
          </Link>

          {error ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {error}
            </p>
          ) : null}

          <article className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
            <div className="border-b border-zinc-100 px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy">
                {o.transaction} · {o.category}
              </p>
              <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-zinc-900 sm:text-4xl">
                {o.title}
              </h1>
              <p className="mt-2 text-zinc-600">{o.locationLabel}</p>
              <p className="mt-4 text-xl font-bold text-burgundy sm:text-2xl">
                {o.priceLabel}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span className="text-zinc-600">
                  <span className="font-medium text-zinc-800">
                    Powierzchnia:
                  </span>{" "}
                  {o.areaLabel}
                </span>
                <span className="text-zinc-600">
                  <span className="font-medium text-zinc-800">Pokoje:</span>{" "}
                  {o.roomsLabel}
                </span>
                <span className="text-zinc-400">Nr oferty: {o.signature}</span>
              </div>
            </div>

            {imagesForGallery.length > 0 ? (
              <PropertyGallery images={imagesForGallery} />
            ) : (
              <div className="flex justify-center bg-zinc-50 px-8 py-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={o.mainImageSrc ?? PLACEHOLDER_IMG}
                  alt=""
                  className="max-h-80 rounded-lg object-contain"
                />
              </div>
            )}

            <div className="lg:grid lg:grid-cols-[1fr_min(320px,36%)] lg:gap-10 lg:px-0">
              <div>
                {descriptionRaw ? (
                  <section className="px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
                    <div className="max-w-3xl">
                      <h3 className="font-[var(--font-playfair)] text-2xl font-semibold text-burgundy">
                        Opis nieruchomości
                      </h3>
                      <hr className="my-6 border-zinc-200" />

                      {descriptionHasHtml ? (
                        <div
                          className="prose prose-sm prose-zinc max-w-none break-words prose-a:font-medium prose-a:text-burgundy prose-a:underline sm:prose-base lg:prose-lg"
                          dangerouslySetInnerHTML={{ __html: descriptionRaw }}
                        />
                      ) : (
                        <div className="text-[1.05rem] leading-relaxed text-zinc-700 break-words">
                          {descriptionParagraphs.map((paragraph) => (
                            <p key={paragraph} className="mb-4 last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                ) : (
                  <p className="px-6 py-10 text-zinc-500 sm:px-10 lg:px-12">
                    Brak opisu w eksporcie.
                  </p>
                )}
              </div>

              <aside className="border-t border-zinc-100 px-4 py-7 sm:px-8 sm:py-8 lg:border-l lg:border-t-0 lg:px-8 lg:py-10">
                <h2 className="mb-4 font-[var(--font-playfair)] text-lg font-semibold text-zinc-900">
                  Kontakt
                </h2>
                <AgentSidebarCard offer={o} />
              </aside>
            </div>
          </article>

          <section className="mt-20" aria-label="Kontakt i nasze dane">
            <ContactDetailsSection />
          </section>
        </div>
      </main>
    </div>
  );
}
