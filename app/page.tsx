import type { Metadata } from "next";
import CompanyOverview from "@/components/CompanyOverview";
import ContactSection from "@/components/ContactSection";
import Navbar from "@/components/Navbar";
import { canonicalUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("") },
  openGraph: { url: canonicalUrl("") },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black [text-rendering:optimizeLegibility]">
      <Navbar />

      <main>
        {/* ═══════════════════════════════════════════════════════
            SEKCJA 1 — HERO  (full-bleed, bez ramki)
        ═══════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-[70dvh] flex-col overflow-hidden bg-[#2f0811] sm:min-h-[80dvh] lg:min-h-[75vh] 2xl:min-h-[85vh]">
          <img
            src="/hero-biuro.jpg.png"
            alt="Zespół Dan-Dom Nieruchomości"
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/30 to-transparent" />

          <div className="relative flex min-h-full flex-1 flex-col items-center justify-start px-[max(1rem,env(safe-area-inset-left))] pt-[max(3.5rem,env(safe-area-inset-top))] text-center sm:px-6 sm:pt-20 lg:pt-16 xl:pt-20 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
              Biuro Nieruchomości · od 1996 roku
            </p>

            <h1 className="mt-3 max-w-[min(100%,32rem)] font-sans text-xl font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-md sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
              PONAD{" "}
              <span className="text-red-400">28&nbsp;LAT</span>{" "}
              DOŚWIADCZENIA I ZNAJOMOŚĆ LOKALNEGO RYNKU.
            </h1>

            <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/75 drop-shadow-sm sm:text-sm md:max-w-md md:text-base">
              Kompleksowa obsługa sprzedaży, zakupu i wynajmu nieruchomości
              w Wągrowcu i Rogoźnie.
            </p>

            <div className="mt-5 flex justify-center">
              <a
                href="#oferty"
                className="inline-flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center gap-2 rounded-full border border-white/55 bg-white/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg active:scale-[0.98]"
              >
                Nieruchomości
                <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            RAMKI — wszystkie sekcje poniżej hero
        ═══════════════════════════════════════════════════════ */}
        <div className="space-y-5 px-[max(1rem,env(safe-area-inset-left))] py-5 pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 lg:px-10">


          {/* ───────────────────────────────────────────────────
              SEKCJA 2 — TRUST METRICS BANNER
          ─────────────────────────────────────────────────── */}
          <section className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
            <div className="px-6 py-8 sm:px-14 sm:py-12">
              <div className="grid grid-cols-3 divide-x divide-zinc-100">
                {[
                  { value: "1400+", label: "Sprzedanych nieruchomości" },
                  { value: "25+",   label: "Lat na rynku" },
                  { value: "1000+", label: "Zadowolonych klientów" },
                ].map((stat) => (
                  <div key={stat.label} className="flex min-w-0 flex-col items-center px-2 py-2 text-center sm:px-8 sm:py-0">
                    <p className="font-[var(--font-playfair)] text-3xl font-extrabold leading-none text-[#A32036] sm:text-5xl lg:text-6xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 hyphens-auto text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 sm:mt-3 sm:text-xs sm:tracking-[0.18em]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              SEKCJA 3 — O BIURZE + USŁUGI + ZESPÓŁ
          ═══════════════════════════════════════════════════════ */}
          <section id="o-biurze" className="mx-auto w-full max-w-[1600px] rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div id="o-nas" className="-mt-24 pt-24" />

            <CompanyOverview />

            {/* ══ TEAM ══ */}
            <div className="mt-16 border-t border-zinc-100 pt-12" id="zespol">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#800020]">Poznaj nas</p>
              <h3 className="mt-3 font-[var(--font-playfair)] text-2xl font-bold text-[#800020] sm:text-3xl">Nasz zespół</h3>
              <div className="mt-3 h-0.5 w-14 rounded bg-[#800020]" />
              <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { id:1, name:"Danuta Majchrzak", role:"Właścicielka biura", phone:"+48501769166", phoneDisplay:"+48 501 769 166", image:"/images/danuta.png" },
                  { id:2, name:"Joanna Szewczak", role:"Agentka nieruchomości", phone:"+48506541111", phoneDisplay:"+48 506 541 111", image:"/images/joanna.png" },
                  { id:3, name:"Marta Janusz", role:"Agentka nieruchomości", phone:"+48519110078", phoneDisplay:"+48 519 110 078", image:"/images/marta.png" },
                  { id:4, name:"Jan Majchrzak", role:"Agent nieruchomości", phone:"+48797806046", phoneDisplay:"+48 797 806 046", image:"/images/jan.png" },
                ].map((member) => (
                  <div key={member.id} className="group overflow-hidden rounded-xl border border-zinc-100 bg-[#800020]/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[#800020]/20 hover:bg-[#800020]/[0.06] hover:shadow-[0_8px_24px_rgba(128,0,32,0.10)]">
                    <div className="aspect-[3/4] overflow-hidden">
                      {member.image ? (
                        <img src={member.image} alt={`Zdjęcie — ${member.name}`} className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#800020]/[0.04] transition-colors group-hover:bg-[#800020]/[0.08]">
                          <svg aria-hidden="true" className="h-12 w-12 text-[#800020]/30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          <span className="text-[11px] font-medium tracking-wide text-zinc-400">Zdjęcie wkrótce</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-[var(--font-playfair)] text-base font-bold text-[#800020]">{member.name}</h3>
                      <p className="mt-0.5 text-xs font-medium text-zinc-500">{member.role}</p>
                      <div className="mt-3 flex flex-col gap-y-2">
                        <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#800020] transition-opacity hover:opacity-75">
                          <svg aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 10.5c1.2 2.4 3.6 4.8 6 6l1.8-1.8c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 3.7.6.6 0 1.1.5 1.1 1.1V20c0 .6-.5 1.1-1.1 1.1C13.1 21.1 2.9 10.9 2.9 3.1c0-.6.5-1.1 1.1-1.1H7c.6 0 1.1.5 1.1 1.1 0 1.1.2 2.5.6 3.7.1.4 0 .8-.3 1.1L8.5 10.5Z" /></svg>
                          {member.phoneDisplay}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              KONTAKT — formularz lead-gen (nad „Nasze biura”)
          ═══════════════════════════════════════════════════════ */}
          <section id="kontakt" className="scroll-mt-24">
            <ContactSection />
          </section>

          {/* ───────────────────────────────────────────────────
              SEKCJA 4 — NASZE BIURA (ostatni blok przed stopką)
          ─────────────────────────────────────────────────── */}
          <section id="nasze-biura" className="mx-auto w-full max-w-[1600px] rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Odwiedź nas
            </p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl lg:text-4xl">
              Nasze Biura
            </h2>
            <div className="mt-4 h-px w-28 bg-[#800020]/80" />

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">

              {/* ── Wągrowiec ── */}
              <div className="rounded-xl border border-zinc-100 bg-[#800020]/[0.03] p-5 transition-all duration-300 hover:border-[#800020]/20 hover:shadow-md">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                  <div className="w-full flex-shrink-0 overflow-hidden rounded-lg border border-zinc-100 shadow-sm sm:w-[42%]">
                    <div className="aspect-[4/3]">
                      <img src="/biuro-wagrowiec.png" alt="Biuro Dan-Dom Nieruchomości w Wągrowcu" className="h-full w-full object-cover object-center" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[#800020]">Biuro w Wągrowcu</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">ul. Kościuszki 28<br />62-100 Wągrowiec</p>
                    <div className="mt-3 space-y-1">
                      <a href="tel:501769166" className="block text-sm font-semibold text-[#800020] hover:underline">501 769 166</a>
                      <a href="mailto:biuro@dan-dom.pl" className="block text-sm font-medium text-zinc-600 hover:text-[#800020]">biuro@dan-dom.pl</a>
                    </div>
                    <div className="mt-5">
                      <a href="https://share.google/jGEGIgNzbrSzlVAR1" target="_blank" rel="noopener noreferrer" aria-label="Otwórz Google Maps z trasą do biura w Wągrowcu (otwiera nową kartę)" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#800020] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#800020]/85 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020] focus-visible:ring-offset-2">
                        <svg aria-hidden="true" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-4.4 7-11A7 7 0 0 0 5 11c0 6.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.8" /></svg>
                        Jak dojechać?
                        <svg aria-hidden="true" className="h-3 w-3 flex-shrink-0 opacity-70" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Rogoźno ── */}
              <div className="rounded-xl border border-zinc-100 bg-[#800020]/[0.03] p-5 transition-all duration-300 hover:border-[#800020]/20 hover:shadow-md">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                  <div className="w-full flex-shrink-0 overflow-hidden rounded-lg border border-zinc-100 shadow-sm sm:w-[42%]">
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-gray-100">
                      <svg aria-hidden="true" className="h-10 w-10 text-zinc-300" viewBox="0 0 24 24" fill="none"><path d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M9 21V13h6v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className="text-[11px] font-medium tracking-wide text-zinc-400">Zdjęcie wkrótce</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[#800020]">Biuro w Rogoźnie</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">ul. Wielka Poznańska 29<br />64-610 Rogoźno</p>
                    <div className="mt-3 space-y-1">
                      <a href="tel:506541111" className="block text-sm font-semibold text-[#800020] hover:underline">506 541 111</a>
                      <a href="mailto:biuro@dan-dom.pl" className="block text-sm font-medium text-zinc-600 hover:text-[#800020]">biuro@dan-dom.pl</a>
                    </div>
                    <div className="mt-5">
                      <a href="https://share.google/iEoxCilgWTTCoq5bl" target="_blank" rel="noopener noreferrer" aria-label="Otwórz Google Maps z trasą do biura w Rogoźnie (otwiera nową kartę)" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#800020] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#800020]/85 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020] focus-visible:ring-offset-2">
                        <svg aria-hidden="true" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-4.4 7-11A7 7 0 0 0 5 11c0 6.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.8" /></svg>
                        Jak dojechać?
                        <svg aria-hidden="true" className="h-3 w-3 flex-shrink-0 opacity-70" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              STOPKA — unified burgundy card
          ═══════════════════════════════════════════════════════ */}
          <footer className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-2xl bg-[#A32036] px-5 shadow-xl sm:px-10 lg:px-14">
            {/* ── main content ── */}
            <div className="py-10">

              {/* label + headline row */}
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="font-[var(--font-playfair)] text-2xl font-bold leading-tight text-white sm:text-3xl">
                  Kontakt
                </h2>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                  Napisz lub zadzwoń
                </p>
              </div>
              <div className="mt-3 h-px w-12 bg-white/25" />

              {/* 3-column grid */}
              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">

                {/* COL 1 — dane kontaktowe */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Dane kontaktowe
                  </p>
                  <a
                    href="tel:501769166"
                    className="mt-4 flex items-center gap-3 text-white transition-opacity hover:opacity-75"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.5 10.5c1.2 2.4 3.6 4.8 6 6l1.8-1.8c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 3.7.6.6 0 1.1.5 1.1 1.1V20c0 .6-.5 1.1-1.1 1.1C13.1 21.1 2.9 10.9 2.9 3.1c0-.6.5-1.1 1.1-1.1H7c.6 0 1.1.5 1.1 1.1 0 1.1.2 2.5.6 3.7.1.4 0 .8-.3 1.1L8.5 10.5Z" />
                      </svg>
                    </span>
                    <span className="text-base font-semibold leading-snug">501 769 166</span>
                  </a>
                  <a
                    href="mailto:biuro@dan-dom.pl"
                    className="mt-3 flex items-center gap-3 text-white/75 transition-opacity hover:opacity-75"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium leading-snug">biuro@dan-dom.pl</span>
                  </a>
                </div>

                {/* COL 2 — adresy biur */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Adresy biur
                  </p>
                  <div className="mt-4 flex items-start gap-3 text-white/75">
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s7-4.4 7-11A7 7 0 0 0 5 11c0 6.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                        <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                    </span>
                    <div className="text-sm leading-snug">
                      <p className="font-semibold text-white">Wągrowiec</p>
                      <p className="mt-1">ul. Kościuszki 28, 62-100</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-3 text-white/75">
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s7-4.4 7-11A7 7 0 0 0 5 11c0 6.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                        <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                    </span>
                    <div className="text-sm leading-snug">
                      <p className="font-semibold text-white">Rogoźno</p>
                      <p className="mt-1">ul. Wielka Poznańska 29, 64-610</p>
                    </div>
                  </div>
                </div>

                {/* COL 3 — godziny otwarcia */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Godziny otwarcia
                  </p>
                  <div className="mt-4 flex items-start gap-3 text-white/75">
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M12 7v5l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div className="text-sm leading-snug">
                      <p className="font-semibold text-white">Poniedziałek – Piątek</p>
                      <p className="mt-1">9:00 – 16:00</p>
                      <p className="mt-2 text-xs text-white/40">Sobota – Niedziela: zamknięte</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── copyright bar ── */}
            <div className="border-t border-white/10 py-4 text-center text-xs text-white/35">
              Copyright © {new Date().getFullYear()} Dan-Dom Nieruchomości. Wszelkie prawa zastrzeżone.
            </div>
          </footer>

        </div>{/* koniec space-y wrapper */}
      </main>
    </div>
  );
}
