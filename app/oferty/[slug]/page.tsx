import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactDetailsSection from "@/components/ContactDetailsSection";
import OfferViewTracker from "@/components/analytics/OfferViewTracker";
import OfferDetailRail from "@/components/offers/OfferDetailRail";
import PropertyGallery from "@/components/offers/PropertyGallery";
import { relativeUrlForZdjeciaFile } from "@/lib/asari/imageUrl";
import { loadAsariOffers } from "@/lib/asari/loadOffers";
import { PLACEHOLDER_IMG } from "@/lib/asari/placeholderImg";
import { photoNameFromApiUrl } from "@/lib/asari/photoUrl";
import { canonicalUrl } from "@/lib/seo/site";
import { notFound } from "next/navigation";

const OG_FALLBACK_IMAGE = "/hero-biuro.jpg.png";

/** Akapity z czystego tekstu — najpierw podwójny enter z XML, inaczej pojedyncze linie. */
function splitDescriptionPlain(raw: string): string[] {
  const t = raw.trim();
  if (!t) return [];
  if (/\n\n/.test(t)) {
    return t
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return t
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

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
        ? [
            {
              name: fallbackName,
              weight: 1,
              src: relativeUrlForZdjeciaFile(fallbackName),
            },
          ]
        : [];
  const descriptionRaw = (o.descriptionHtml ?? "").trim();
  const descriptionHasHtml = /<\/?[a-z][\s\S]*>/i.test(descriptionRaw);
  const descriptionParagraphs = descriptionHasHtml
    ? []
    : splitDescriptionPlain(descriptionRaw);

  const galleryBlock =
    imagesForGallery.length > 0 ? (
      <PropertyGallery
        images={imagesForGallery}
        variant="detail"
        heroClassName="max-w-none sm:max-w-none mx-0"
      />
    ) : (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={o.mainImageSrc ?? PLACEHOLDER_IMG}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );

  const descriptionBlock = descriptionRaw ? (
    <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[min(100%,42rem)] lg:max-w-[min(100%,48rem)]">
        <h2 className="font-[var(--font-playfair)] text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          Opis nieruchomości
        </h2>
        <div className="mt-8">
          {descriptionHasHtml ? (
            <div
              className="offer-description prose prose-sm prose-zinc max-w-none break-words text-zinc-800 prose-p:mb-4 prose-p:leading-[1.75] prose-headings:mb-2 prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-zinc-900 prose-headings:first:mt-0 prose-li:my-1 prose-a:font-medium prose-a:text-burgundy prose-a:underline sm:prose-base lg:prose-lg lg:prose-p:leading-[1.8]"
              dangerouslySetInnerHTML={{ __html: descriptionRaw }}
            />
          ) : (
            <div className="space-y-4 text-[0.95rem] leading-[1.75] text-zinc-800 sm:text-base sm:leading-[1.8] lg:text-[1.0625rem]">
              {descriptionParagraphs.map((paragraph, i) => (
                <p key={`${i}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  ) : (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <p className="mx-auto max-w-[min(100%,42rem)] text-sm text-zinc-500">
        Brak opisu w eksporcie.
      </p>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black">
      <Navbar />

      <main className="px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <OfferViewTracker
            signature={o.signature}
            slug={o.slug}
            category={o.category}
            transaction={o.transaction}
            locationLabel={o.locationLabel}
            pricePln={o.pricePln}
          />
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

          <article className="mt-6 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_4px_28px_rgba(0,0,0,0.07)] sm:mt-8">
            {/*
              Blok 1: tylko galeria + jedna karta (OfferDetailRail). Bez sticky, bez row-span —
              opis NIE jest w tym samym gridzie, więc nic „nie nachodzi”.
            */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-start lg:gap-0">
              <div className="order-1 border-b border-zinc-200/80 px-4 py-5 sm:px-6 sm:py-6 lg:order-none lg:col-span-7 lg:border-b-0 lg:border-r lg:border-zinc-200 lg:px-8 lg:py-8">
                {galleryBlock}
              </div>
              <div className="order-2 px-4 py-5 sm:px-6 sm:py-6 lg:order-none lg:col-span-5 lg:px-8 lg:py-8">
                <OfferDetailRail offer={o} />
              </div>
            </div>

            {/* Blok 2: opis — osobna warstwa pod galerią i kartą, pełna szerokość karty */}
            <div className="border-t border-zinc-200/80 bg-white">{descriptionBlock}</div>
          </article>

          <section className="mt-16 sm:mt-20" aria-label="Kontakt i nasze dane">
            <ContactDetailsSection />
          </section>
        </div>
      </main>
    </div>
  );
}
