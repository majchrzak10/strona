import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import LegacyNieruchomosciRedirect from "@/components/nieruchomosci/LegacyNieruchomosciRedirect";
import { SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Nieruchomości na sprzedaż — Dan-Dom",
  description:
    "Aktualne oferty sprzedaży mieszkań, domów, działek i lokali komercyjnych. Biuro nieruchomości Dan-Dom — Wągrowiec i Rogoźno.",
  alternates: { canonical: `${SITE_URL}/nieruchomosci/?typ=sprzedaz` },
  openGraph: { url: `${SITE_URL}/nieruchomosci/?typ=sprzedaz` },
};

export default function SprzedazRedirectPage() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f4f4f4] text-black">
      <Navbar />
      <main className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px] rounded-2xl bg-white px-4 py-8 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
          <Suspense fallback={<p className="py-16 text-center text-zinc-500">Przekierowanie…</p>}>
            <LegacyNieruchomosciRedirect typ="sprzedaz" />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
