import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactDetailsSection from "@/components/ContactDetailsSection";
import OfferCard from "@/components/offers/OfferCard";
import { loadAsariOffers } from "@/lib/asari/loadOffers";
import { toCard } from "@/lib/asari/mapOffer";
import { canonicalUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Nieruchomości na wynajem — Dan-Dom",
  description:
    "Aktualne oferty wynajmu mieszkań, domów i lokali. Biuro nieruchomości Dan-Dom — Wągrowiec i Rogoźno.",
  alternates: { canonical: canonicalUrl("nieruchomosci/wynajem") },
  openGraph: { url: canonicalUrl("nieruchomosci/wynajem") },
};

export default async function WynajemPage() {
  const { offers, error } = await loadAsariOffers();

  const filtered = offers.filter((o) =>
    o.transaction.toLowerCase().includes("wynajem"),
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black">
      <Navbar />

      <main className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px] rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#800020]">
            Biuro Dan-Dom
          </p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl lg:text-4xl">
            Nieruchomości na wynajem
          </h1>
          <div className="mt-4 h-px w-28 bg-[#800020]/80" />

          {error ? (
            <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {error}
            </p>
          ) : null}

          {filtered.length === 0 && !error ? (
            <p className="mt-10 text-zinc-600">
              Brak ofert wynajmu w aktualnym eksporcie.
            </p>
          ) : null}

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => (
              <OfferCard
                key={o.signature}
                offer={toCard(o)}
                href={`/oferty/${o.slug}`}
              />
            ))}
          </div>

        </div>

        <section className="mt-20" aria-label="Kontakt i nasze dane">
          <ContactDetailsSection />
        </section>
      </main>
    </div>
  );
}
