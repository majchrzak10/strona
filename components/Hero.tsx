/**
 * Hero — „safe zone”: object-position 50% 40% — dolna część kadru w polu widzenia, szara strefa u góry pod nagłówek.
 */
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#2f0811]">
      {/* Warstwa obrazu: min. wysokość na mobile, na md+ szeroki baner 16/7 */}
      <div className="relative w-full min-h-[65dvh] md:min-h-0 md:aspect-[16/7]">
        <Image
          src="/hero-biuro.jpg"
          alt="Zespół Dan-Dom Nieruchomości"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_40%]"
          unoptimized
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/35 to-transparent" />
      </div>

      {/* Treść — oddech od nawigacji (pt-16 / md:pt-20), kadrowanie obrazu bez zmian */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-start justify-start">
        <div
          className="pointer-events-auto flex w-full flex-col items-start justify-start px-[max(1rem,env(safe-area-inset-left))] pt-[max(4rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6 md:pt-20"
        >
          <div className="mx-auto flex w-full min-w-0 max-w-[min(100%,28rem)] flex-col items-center text-center pb-8 md:pb-12">
            <h1 className="text-[clamp(0.625rem,2.5vw,0.6875rem)] font-semibold uppercase tracking-[0.25em] text-white/70">
              Biuro Nieruchomości · od 1996 roku
            </h1>

            <p className="mt-3 max-w-sm text-[clamp(0.8125rem,2.8vw,0.9375rem)] leading-relaxed text-white/80 drop-shadow-sm md:max-w-md">
              Kompleksowa obsługa sprzedaży, zakupu i wynajmu nieruchomości w Wągrowcu i Rogoźnie.
            </p>

            <div className="mt-4 flex justify-center">
              <Link
                href="/#oferty"
                className="inline-flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center gap-2 rounded-full border border-white/70 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur-[1px] transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f0811] active:scale-[0.98]"
                aria-label="Przejdź do listy nieruchomości — najnowsze oferty"
              >
                Zobacz najnowsze oferty
                <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
