import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import ClientReviewsSection from "@/components/ClientReviewsSection";
import CompanyOverview from "@/components/CompanyOverview";
import ContactFormWithBoundary from "@/components/ContactFormWithBoundary";
import FooterLegalLinks from "@/components/FooterLegalLinks";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import RecentOffersSection from "@/components/RecentOffersSection";
import RecentOffersSkeleton from "@/components/RecentOffersSkeleton";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumbJsonLd";
import { canonicalUrl } from "@/lib/seo/site";
import { faqJsonLd } from "@/lib/seo/faqJsonLd";

export const metadata: Metadata = {
  title: "Biuro Nieruchomości Wągrowiec i Rogoźno — Dan-Dom | Od 1996",
  description:
    "Biuro nieruchomości Wągrowiec i Rogoźno. 28 lat doświadczenia, 60 opinii ★4.9. Sprzedaż, zakup i wynajem nieruchomości. Zadzwoń: 501 769 166",
  alternates: { canonical: canonicalUrl("") },
  openGraph: { url: canonicalUrl("") },
};

const homeBreadcrumbJsonLd = breadcrumbJsonLd([{ name: "Strona główna", route: "" }]);
const homeFaqJsonLd = faqJsonLd("home", [
  {
    question: "Ile kosztuje mieszkanie w Wągrowcu?",
    answer:
      "Na rynku wtórnym ceny wahają się od 4500 do 7000 zł/m², w zależności od lokalizacji, stanu technicznego i piętra. Biuro Dan-Dom oferuje bezpłatną wycenę — zadzwoń: 501 769 166.",
  },
  {
    question: "Jak długo trwa sprzedaż nieruchomości w Wągrowcu?",
    answer:
      "Atrakcyjne mieszkania sprzedają się zwykle w 4–8 tygodni. Domy jednorodzinne wymagają 2–6 miesięcy. Dan-Dom, dzięki lokalnej bazie kupujących, skutecznie skraca ten czas.",
  },
  {
    question: "Czy Dan-Dom obsługuje Rogoźno?",
    answer:
      "Tak. Dan-Dom prowadzi biuro w Rogoźnie przy ul. Wielkiej Poznańskiej 29 i obsługuje powiat obornicki. Kontakt: 506 541 111.",
  },
  {
    question: "Co zawiera usługa pośrednictwa w sprzedaży nieruchomości?",
    answer:
      "Bezpłatna wycena, profesjonalne zdjęcia, publikacja na Otodom, OLX i Gratka, organizacja prezentacji, negocjacje oraz wsparcie przy dokumentach i umowie notarialnej.",
  },
  {
    question: "Jak zamówić bezpłatną wycenę nieruchomości?",
    answer:
      "Zadzwoń pod 501 769 166 lub napisz na biuro@dan-dom.pl. Agent umówi się na oględziny i przedstawi wycenę w ciągu kilku dni — bez żadnych zobowiązań.",
  },
]);

export default function Home() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f4f4f4] text-black [text-rendering:optimizeLegibility]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }} />
      <Navbar />

      <main>
        <Hero />

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
                    <p className="font-[var(--font-playfair)] text-3xl font-extrabold leading-none text-burgundy sm:text-5xl lg:text-6xl">
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

            <section id="kontakt" className="scroll-mt-24">
              <ContactFormWithBoundary />
            </section>

            {/* ══ TEAM ══ */}
            <div className="mt-16 border-t border-zinc-100 pt-12" id="zespol">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Poznaj nas</p>
              <h3 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-brand-primary sm:text-3xl">Nasz zespół</h3>
              <div className="mt-2 h-0.5 w-14 rounded bg-brand-primary" />
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {[
                  { id:1, name:"Danuta Majchrzak", role:"Właścicielka biura", phone:"+48501769166", phoneDisplay:"+48 501 769 166", image:"/images/danuta.png" },
                  { id:2, name:"Joanna Szewczak", role:"Agentka nieruchomości", phone:"+48506541111", phoneDisplay:"+48 506 541 111", image:"/images/joanna.png" },
                  { id:3, name:"Marta Janusz", role:"Agentka nieruchomości", phone:"+48519110078", phoneDisplay:"+48 519 110 078", image:"/images/marta.png" },
                  { id:4, name:"Jan Majchrzak", role:"Agent nieruchomości", phone:"+48797806046", phoneDisplay:"+48 797 806 046", image:"/images/jan.png" },
                ].map((member) => (
                  <div key={member.id} className="group overflow-hidden rounded-xl border border-zinc-100 bg-brand-primary/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/20 hover:bg-brand-primary/[0.06] hover:shadow-[0_8px_24px_rgba(128,0,32,0.10)]">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={`Zdjęcie — ${member.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-brand-primary/[0.04] transition-colors group-hover:bg-brand-primary/[0.08]">
                          <svg aria-hidden="true" className="h-12 w-12 text-brand-primary/30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          <span className="text-[11px] font-medium tracking-wide text-zinc-400">Zdjęcie wkrótce</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-[var(--font-playfair)] text-base font-bold text-brand-primary">{member.name}</h3>
                      <p className="mt-0.5 text-xs font-medium text-zinc-500">{member.role}</p>
                      <div className="mt-3 flex flex-col gap-y-2">
                        <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-opacity hover:opacity-75">
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

          <Suspense fallback={<RecentOffersSkeleton />}>
            <RecentOffersSection />
          </Suspense>

          {/* ───────────────────────────────────────────────────
              SEKCJA 4 — NASZE BIURA (ostatni blok przed stopką)
          ─────────────────────────────────────────────────── */}
          <section id="nasze-biura" className="mx-auto w-full max-w-[1600px] rounded-2xl bg-white px-5 py-7 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
              Odwiedź nas
            </p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl lg:text-4xl">
              Nasze Biura
            </h2>
            <div className="mt-3 h-px w-28 bg-brand-primary/80" />

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">

              {/* ── Wągrowiec ── */}
              <div className="rounded-xl border border-zinc-100 bg-brand-primary/[0.03] p-5 transition-all duration-300 hover:border-brand-primary/20 hover:shadow-md">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                  <div className="w-full flex-shrink-0 overflow-hidden rounded-lg border border-zinc-100 shadow-sm sm:w-[42%]">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src="/biuro-wagrowiec.png"
                        alt="Biuro Dan-Dom Nieruchomości w Wągrowcu"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="object-cover object-center"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="font-[var(--font-playfair)] text-xl font-bold text-brand-primary">Biuro w Wągrowcu</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">ul. Kościuszki 28<br />62-100 Wągrowiec</p>
                    <div className="mt-3 space-y-1">
                      <a href="tel:501769166" className="block text-sm font-semibold text-brand-primary hover:underline">501 769 166</a>
                      <a href="mailto:biuro@dan-dom.pl" className="block text-sm font-medium text-zinc-600 hover:text-brand-primary">biuro@dan-dom.pl</a>
                    </div>
                    <div className="mt-5">
                      <a href="https://share.google/jGEGIgNzbrSzlVAR1" target="_blank" rel="noopener noreferrer" aria-label="Otwórz Google Maps z trasą do biura w Wągrowcu (otwiera nową kartę)" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-primary/85 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                        <svg aria-hidden="true" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-4.4 7-11A7 7 0 0 0 5 11c0 6.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.8" /></svg>
                        Jak dojechać?
                        <svg aria-hidden="true" className="h-3 w-3 flex-shrink-0 opacity-70" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Rogoźno ── */}
              <div className="rounded-xl border border-zinc-100 bg-brand-primary/[0.03] p-5 transition-all duration-300 hover:border-brand-primary/20 hover:shadow-md">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                  <div className="w-full flex-shrink-0 overflow-hidden rounded-lg border border-zinc-100 shadow-sm sm:w-[42%]">
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-gray-100">
                      <svg aria-hidden="true" className="h-10 w-10 text-zinc-300" viewBox="0 0 24 24" fill="none"><path d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M9 21V13h6v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className="text-[11px] font-medium tracking-wide text-zinc-400">Zdjęcie wkrótce</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="font-[var(--font-playfair)] text-xl font-bold text-brand-primary">Biuro w Rogoźnie</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">ul. Wielka Poznańska 29<br />64-610 Rogoźno</p>
                    <div className="mt-3 space-y-1">
                      <a href="tel:506541111" className="block text-sm font-semibold text-brand-primary hover:underline">506 541 111</a>
                      <a href="mailto:biuro@dan-dom.pl" className="block text-sm font-medium text-zinc-600 hover:text-brand-primary">biuro@dan-dom.pl</a>
                    </div>
                    <div className="mt-5">
                      <a href="https://share.google/iEoxCilgWTTCoq5bl" target="_blank" rel="noopener noreferrer" aria-label="Otwórz Google Maps z trasą do biura w Rogoźnie (otwiera nową kartę)" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-primary/85 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
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

          {/* ── Opinie klientów (Google) — między biurami a stopką Kontakt ── */}
          <ClientReviewsSection />

          {/* ═══════════════════════════════════════════════════════
              STOPKA — unified burgundy card
          ═══════════════════════════════════════════════════════ */}
          <footer className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-2xl bg-burgundy px-5 shadow-xl sm:px-10 lg:px-14">
            {/* ── main content ── */}
            <div className="py-8 sm:py-9">

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

                {/* COL 1 — dane kontaktowe (ten sam wzorzec co wiersze adresów: ikona + treść, stos pionowy) */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Dane kontaktowe
                  </p>
                  <div className="mt-4 flex flex-col gap-y-2">
                    <a
                      href="tel:501769166"
                      className="flex min-h-[44px] items-start gap-3 text-white transition-opacity hover:opacity-90"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.5 10.5c1.2 2.4 3.6 4.8 6 6l1.8-1.8c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 3.7.6.6 0 1.1.5 1.1 1.1V20c0 .6-.5 1.1-1.1 1.1C13.1 21.1 2.9 10.9 2.9 3.1c0-.6.5-1.1 1.1-1.1H7c.6 0 1.1.5 1.1 1.1 0 1.1.2 2.5.6 3.7.1.4 0 .8-.3 1.1L8.5 10.5Z" />
                        </svg>
                      </span>
                      <span className="text-sm font-semibold leading-snug">501 769 166</span>
                    </a>
                    <a
                      href="mailto:biuro@dan-dom.pl"
                      className="flex min-h-[44px] items-start gap-3 text-white hover:underline"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <svg aria-hidden="true" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
                          <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="break-all text-sm font-semibold leading-snug">biuro@dan-dom.pl</span>
                    </a>
                  </div>
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
            <div className="border-t border-white/10 py-4 text-xs text-white/35">
              <FooterLegalLinks />
              <p className="mt-3 text-center">
                Copyright ©{" "}
                <span suppressHydrationWarning>{new Date().getFullYear()}</span> Dan-Dom Nieruchomości.
                Wszelkie prawa zastrzeżone.
              </p>
            </div>
          </footer>

        </div>{/* koniec space-y wrapper */}
      </main>
    </div>
  );
}
