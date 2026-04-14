import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Strona nie znaleziona",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-10 sm:py-24">
        <div className="rounded-2xl bg-white px-8 py-16 text-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
            Błąd 404
          </p>
          <h1 className="mt-4 font-[var(--font-playfair)] text-3xl font-bold text-black sm:text-4xl">
            Nie znaleziono strony
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-zinc-600">
            Ta strona nie istnieje lub została przeniesiona. Możesz wrócić na stronę główną lub
            przejść do listy nieruchomości z wyszukiwarką.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover"
            >
              Strona główna
            </Link>
            <Link
              href="/nieruchomosci/"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-300 bg-white px-8 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            >
              Nieruchomości
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
