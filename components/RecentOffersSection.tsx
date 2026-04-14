import Image from "next/image";
import Link from "next/link";
import type { AsariOfferDetail } from "@/lib/asari/types";
import { loadAsariOffers } from "@/lib/asari/loadOffers";
import { PLACEHOLDER_IMG } from "@/lib/asari/placeholderImg";

function sortOffersNewestFirst(offers: AsariOfferDetail[]) {
  return [...offers].sort((a, b) => {
    const da = a.listedAtMs ?? 0;
    const db = b.listedAtMs ?? 0;
    if (db !== da) return db - da;
    return b.signature.localeCompare(a.signature, "pl");
  });
}

/**
 * Najnowsze 3 oferty z eksportu Asari (sort wg daty z XML, fallback: sygnatura).
 * Sekcja serwerowa — wymaga ASARI_DATA_DIR przy buildzie, żeby wczytać XML.
 */
export default async function RecentOffersSection() {
  let offers: AsariOfferDetail[] = [];
  let error: string | null = null;
  try {
    const r = await loadAsariOffers();
    offers = r.offers;
    error = r.error;
  } catch {
    error = "Nie udało się wczytać ofert. Spróbuj ponownie później.";
  }
  const top3 = sortOffersNewestFirst(offers).slice(0, 3);

  return (
    <section
      id="oferty"
      className="w-full scroll-mt-24 sm:scroll-mt-28"
      aria-labelledby="recent-offers-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:py-10">
        <div className="rounded-2xl bg-white px-4 py-6 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-8 sm:py-8">
          <h2
            id="recent-offers-heading"
            className="mb-5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
          >
            Najnowsze oferty
          </h2>

          {error && top3.length === 0 ? (
            <p className="text-sm text-zinc-600">
              {error}{" "}
              <Link href="/nieruchomosci/" className="font-medium text-burgundy underline hover:no-underline">
                Przejdź do wyszukiwarki ofert
              </Link>
            </p>
          ) : top3.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Brak ofert w eksporcie.{" "}
              <Link href="/nieruchomosci/" className="font-medium text-burgundy underline hover:no-underline">
                Zobacz oferty z filtrami
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
              {top3.map((offer) => {
                const imgSrc = offer.mainImageSrc ?? PLACEHOLDER_IMG;
                return (
                  <Link
                    key={offer.signature}
                    href={`/oferty/${offer.slug}/`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/25 hover:shadow-[0_12px_32px_rgba(128,0,32,0.1)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                      <Image
                        src={imgSrc}
                        alt={offer.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 520px"
                        unoptimized
                      />
                      <div className="absolute left-3 top-3 rounded-md bg-burgundy px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        {offer.tag}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <p className="text-xs text-zinc-500">{offer.locationLabel}</p>
                      <h3 className="mt-1 line-clamp-2 font-[var(--font-playfair)] text-lg font-bold leading-snug text-zinc-900">
                        {offer.title}
                      </h3>
                      <div className="mt-3">
                        <p className="text-xl font-bold text-burgundy">{offer.priceLabel}</p>
                        {offer.pricePerM2Label ? (
                          <p className="mt-1 text-sm font-semibold text-zinc-600">
                            {offer.pricePerM2Label}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
