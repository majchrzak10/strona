import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ContactFormWithBoundary from "@/components/ContactFormWithBoundary";
import HomeContactFooter from "@/components/HomeContactFooter";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumbJsonLd";
import { faqJsonLd } from "@/lib/seo/faqJsonLd";
import { serviceJsonLd } from "@/lib/seo/serviceJsonLd";
import { canonicalUrl } from "@/lib/seo/site";

const PAGE_URL = canonicalUrl("uslugi/wycena-nieruchomosci");

export const metadata: Metadata = {
  title: "Wycena nieruchomości — Dan-Dom Wągrowiec i Rogoźno",
  description:
    "Bezpłatna wycena mieszkań, domów, działek i lokali. Znamy lokalny rynek — podpowiemy realną wartość przed sprzedażą lub wynajmem. Biuro nieruchomości Dan-Dom.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "Wycena nieruchomości — Dan-Dom Wągrowiec i Rogoźno",
    description: "Bezpłatna wycena mieszkań, domów i działek. Realna wartość rynkowa przed sprzedażą lub wynajmem.",
    images: [
      {
        url: "/hero-biuro.jpg",
        width: 1200,
        height: 800,
        alt: "Dan-Dom Nieruchomości — wycena nieruchomości",
      },
    ],
  },
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Strona główna", route: "" },
  { name: "Usługi", route: "uslugi" },
  { name: "Wycena nieruchomości", route: "uslugi/wycena-nieruchomosci" },
]);

const service = serviceJsonLd({
  name: "Wycena nieruchomości",
  description:
    "Bezpłatna wstępna wycena mieszkań, domów, działek i lokali użytkowych. Analiza lokalnego rynku i rekomendacja ceny przed sprzedażą lub wynajmem.",
  url: PAGE_URL,
  areaName: ["Wągrowiec", "Rogoźno"],
});

const faq = faqJsonLd("wycena-nieruchomosci", [
  {
    question: "Czy wycena nieruchomości w Dan-Dom jest bezpłatna?",
    answer:
      "Tak. Wstępna wycena jest całkowicie bezpłatna i bez zobowiązań. Przyjeżdżamy na oględziny, oceniamy stan i lokalizację, analizujemy aktualne transakcje rynkowe i przedstawiamy rekomendowaną cenę.",
  },
  {
    question: "Jak przebiega wycena nieruchomości?",
    answer:
      "Po kontakcie telefonicznym lub przez formularz umawiamy wizytę w Twojej nieruchomości. Oceniamy metraż, stan techniczny, piętro, nasłonecznienie i sąsiedztwo. Następnie analizujemy porównywalne transakcje na lokalnym rynku i przygotowujemy rekomendację cenową.",
  },
  {
    question: "Czym różni się wycena biura od operatu szacunkowego?",
    answer:
      "Operat szacunkowy to formalny dokument sporządzany przez rzeczoznawcę majątkowego — jest wymagany np. przy kredycie hipotecznym. Wycena biura nieruchomości to szybka analiza rynkowa, przydatna przy decyzji o cenie sprzedaży lub wynajmu. Jeżeli potrzebujesz operatu, możemy polecić sprawdzonego rzeczoznawcę.",
  },
  {
    question: "Ile jest warta działka budowlana lub rolna?",
    answer:
      "Ceny działek zależą od lokalizacji, uzbrojenia terenu i MPZP. Skontaktuj się z nami — bezpłatnie ocenimy wartość Twojej działki na podstawie aktualnych danych rynkowych.",
  },
  {
    question: "Czy wycenicie nieruchomość poza Wągrowcem i Rogoźnem?",
    answer:
      "Tak, działamy na terenie powiatu wągrowieckiego i okolic. W przypadku miejscowości spoza naszego obszaru — napisz lub zadzwoń, ustalimy możliwości.",
  },
]);

const relatedPages = [
  { href: "/uslugi/sprzedaz-nieruchomosci/", label: "Sprzedaż nieruchomości" },
  { href: "/uslugi/wynajem-nieruchomosci/", label: "Wynajem nieruchomości" },
  { href: "/nieruchomosci/", label: "Aktualne oferty" },
];

export default function WycenaNieruchomosciPage() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f4f4f4] text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      <Navbar />

      <main className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px] space-y-5">

          {/* ── Hero ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <nav aria-label="Ścieżka nawigacji" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
              <Link href="/" className="hover:text-brand-primary">Strona główna</Link>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-500">Usługi</span>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-700">Wycena nieruchomości</span>
            </nav>

            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Usługi</p>
                <h1 className="mt-2 font-[var(--font-playfair)] text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                  Wycena nieruchomości — bezpłatnie
                </h1>
                <div className="mt-4 h-0.5 w-14 rounded bg-brand-primary" />
                <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
                  Zanim wystawisz nieruchomość na sprzedaż lub wynajem, dowiedz się, ile naprawdę jest warta.
                  Bezpłatna wycena biura Dan-Dom uwzględnia aktualne transakcje na lokalnym rynku —
                  nie tylko ceny ofertowe, lecz rzeczywiste ceny transakcyjne.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="tel:501769166"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    <svg aria-hidden="true" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.5 10.5c1.2 2.4 3.6 4.8 6 6l1.8-1.8c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 3.7.6.6 0 1.1.5 1.1 1.1V20c0 .6-.5 1.1-1.1 1.1C13.1 21.1 2.9 10.9 2.9 3.1c0-.6.5-1.1 1.1-1.1H7c.6 0 1.1.5 1.1 1.1 0 1.1.2 2.5.6 3.7.1.4 0 .8-.3 1.1L8.5 10.5Z" />
                    </svg>
                    Zadzwoń: 501 769 166
                  </a>
                  <a
                    href="#kontakt"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-primary px-6 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    Zamów bezpłatną wycenę
                  </a>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="rounded-2xl border border-zinc-100 bg-gradient-to-b from-zinc-50 to-white p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_20px_rgba(0,0,0,0.04)]">
                  <div className="flex min-h-[220px] items-center justify-center">
                    <Image
                      src="/images/logo-secondary.png"
                      alt="Dan-Dom — logo"
                      width={320}
                      height={128}
                      className="h-auto w-full max-w-[320px] object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Co wyceniamy ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Zakres wyceny</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">Co wyceniamy?</h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "🏠", title: "Mieszkania", desc: "Kawalerki, mieszkania 2–5 pokojowe, apartamenty — w każdym standardzie." },
                { icon: "🏡", title: "Domy jednorodzinne", desc: "Domy wolnostojące, bliźniaki, szeregówki." },
                { icon: "🌿", title: "Działki", desc: "Działki budowlane, rolne i inwestycyjne — z analizą MPZP." },
                { icon: "🏢", title: "Lokale użytkowe", desc: "Biura, sklepy, magazyny i inne lokale komercyjne." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-zinc-100 bg-brand-primary/[0.02] p-5 transition-all hover:border-brand-primary/20 hover:shadow-md">
                  <p className="text-3xl">{item.icon}</p>
                  <h3 className="mt-3 font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Jak wygląda wycena ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Jak to działa</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              Jak wygląda bezpłatna wycena?
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Kontakt i umówienie",
                  desc: "Dzwonisz lub piszesz — umawiamy się na oględziny w terminie dla Ciebie dogodnym.",
                },
                {
                  step: "02",
                  title: "Wizyta i analiza",
                  desc: "Przyjeżdżamy, oceniamy stan techniczny, metraż i lokalizację. Sprawdzamy aktualne transakcje na lokalnym rynku.",
                },
                {
                  step: "03",
                  title: "Rekomendacja cenowa",
                  desc: "Przedstawiamy optymalną cenę wywoławczą — realną, nie zawyżoną. Omawiamy strategię sprzedaży lub wynajmu.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-zinc-100 bg-brand-primary/[0.02] p-5 transition-all hover:border-brand-primary/20 hover:shadow-md">
                  <p className="font-[var(--font-playfair)] text-4xl font-extrabold leading-none text-brand-primary/20">{item.step}</p>
                  <h3 className="mt-3 font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Najczęstsze pytania</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">FAQ — wycena nieruchomości</h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
            <dl className="mt-8 divide-y divide-zinc-100">
              {faq.mainEntity.map((item) => (
                <div key={item.name} className="py-5">
                  <dt className="font-semibold text-zinc-900">{item.name}</dt>
                  <dd className="mt-2 text-sm leading-7 text-zinc-600">{item.acceptedAnswer.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Formularz ── */}
          <section id="kontakt" className="scroll-mt-20 rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Bezpłatna wycena</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              Zamów bezpłatną wycenę nieruchomości
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
            <p className="mt-4 text-sm text-zinc-600">
              Zadzwoń na{" "}
              <a href="tel:501769166" className="font-semibold text-brand-primary hover:underline">501 769 166</a>
              {" "}lub wypełnij formularz — oddzwonimy i ustalimy termin oględzin. Bezpłatnie i bez zobowiązań.
            </p>
            <ContactFormWithBoundary />
          </section>

          {/* ── Linki powiązane ── */}
          <section className="rounded-2xl bg-white px-5 py-8 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Zobacz też</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-xl font-bold text-black sm:text-2xl">Inne usługi</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedPages.map((p) => (
                <Link key={p.href} href={p.href} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-brand-primary/40 hover:text-brand-primary">
                  {p.label}
                </Link>
              ))}
            </div>
          </section>

          <HomeContactFooter />

        </div>
      </main>
    </div>
  );
}







