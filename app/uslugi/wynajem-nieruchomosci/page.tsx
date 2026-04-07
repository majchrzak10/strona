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

const PAGE_URL = canonicalUrl("uslugi/wynajem-nieruchomosci");

export const metadata: Metadata = {
  title: "Wynajem nieruchomości — Dan-Dom Wągrowiec i Rogoźno",
  description:
    "Wynajem mieszkań, domów i lokali użytkowych. Bezpłatna wycena czynszu, weryfikacja najemcy, bezpieczna umowa najmu. Biuro nieruchomości Dan-Dom — 30 lat doświadczenia w Wągrowcu i Rogoźnie.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "Wynajem nieruchomości — Dan-Dom Wągrowiec i Rogoźno",
    description: "Wynajem mieszkań, domów i lokali. Weryfikacja najemcy, bezpieczna umowa najmu, pełna obsługa.",
    images: [
      {
        url: "/hero-biuro.jpg",
        width: 1200,
        height: 800,
        alt: "Dan-Dom Nieruchomości — wynajem nieruchomości",
      },
    ],
  },
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Strona główna", route: "" },
  { name: "Usługi", route: "uslugi" },
  { name: "Wynajem nieruchomości", route: "uslugi/wynajem-nieruchomosci" },
]);

const service = serviceJsonLd({
  name: "Wynajem nieruchomości",
  description:
    "Kompleksowa obsługa wynajmu mieszkań, domów i lokali użytkowych. Wycena czynszu, marketing, weryfikacja najemców i umowa najmu.",
  url: PAGE_URL,
  areaName: ["Wągrowiec", "Rogoźno"],
});

const faq = faqJsonLd("wynajem-nieruchomosci", [
  {
    question: "Jak biuro Dan-Dom pomaga znaleźć najemcę?",
    answer:
      "Zamieszczamy ogłoszenia na największych portalach, organizujemy prezentacje i weryfikujemy wiarygodność zainteresowanych — zatrudnienie, historię najmu — żebyś miał pewność, że nieruchomość jest w dobrych rękach.",
  },
  {
    question: "Czy pomagacie przy sporządzaniu umowy najmu?",
    answer:
      "Tak. Przygotowujemy projekt umowy najmu uwzględniający interesy właściciela: kaucja, warunki wypowiedzenia, protokół zdawczo-odbiorczy i inwentarz wyposażenia.",
  },
  {
    question: "Ile kosztuje wynajem mieszkania przez biuro?",
    answer:
      "Stawki czynszu zależą od metrażu, stanu i lokalizacji. Bezpłatnie wycenimy optymalny czynsz rynkowy dla Twojej nieruchomości — zadzwoń lub napisz.",
  },
  {
    question: "Czy mogę wynająć lokal użytkowy przez Dan-Dom?",
    answer:
      "Tak, obsługujemy zarówno najem mieszkań, jak i lokali użytkowych (biur, sklepów, magazynów).",
  },
  {
    question: "Co powinienem przygotować, żeby wynająć nieruchomość przez biuro?",
    answer:
      "Potrzebny jest dokument potwierdzający własność (akt notarialny lub KW), aktualny stan techniczny lokalu i decyzja co do wyposażenia. Resztą zajmiemy się my.",
  },
]);

const relatedPages = [
  { href: "/uslugi/sprzedaz-nieruchomosci/", label: "Sprzedaż nieruchomości" },
  { href: "/uslugi/wycena-nieruchomosci/", label: "Wycena nieruchomości" },
  { href: "/nieruchomosci/?typ=wynajem", label: "Aktualne oferty wynajmu" },
];

export default function WynajemNieruchomosciPage() {
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
              <span className="text-zinc-700">Wynajem nieruchomości</span>
            </nav>

            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Usługi</p>
                <h1 className="mt-2 font-[var(--font-playfair)] text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                  Wynajem nieruchomości
                </h1>
                <div className="mt-4 h-0.5 w-14 rounded bg-brand-primary" />
                <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
                  Pomagamy właścicielom wynajmować mieszkania, domy i lokale użytkowe szybko i bezpiecznie.
                  Bezpłatnie wyceniamy czynsz rynkowy, prowadzimy marketing, weryfikujemy najemców i przygotowujemy
                  umowę najmu chroniącą Twoje interesy.
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
                    Napisz do nas
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

          {/* ── Jak działamy ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Jak działamy</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              Jak wygląda wynajem z Dan-Dom?
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Wycena czynszu",
                  desc: "Analizujemy lokalny rynek wynajmu i rekomendujemy optymalną stawkę — żeby szybko znaleźć najemcę bez zaniżania ceny.",
                },
                {
                  step: "02",
                  title: "Marketing",
                  desc: "Profesjonalne zdjęcia, ogłoszenia na portalach i aktywne poszukiwanie najemców z bazy zainteresowanych.",
                },
                {
                  step: "03",
                  title: "Weryfikacja najemcy",
                  desc: "Sprawdzamy wiarygodność zainteresowanych — zatrudnienie, historię najmu — żebyś mógł spać spokojnie.",
                },
                {
                  step: "04",
                  title: "Umowa i protokół",
                  desc: "Przygotowujemy umowę najmu, protokół zdawczo-odbiorczy i inwentarz wyposażenia chroniące Twoje interesy.",
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
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              FAQ — wynajem nieruchomości
            </h2>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Bezpłatna konsultacja</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              Chcesz wynająć nieruchomość?
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
            <p className="mt-4 text-sm text-zinc-600">
              Zadzwoń na{" "}
              <a href="tel:501769166" className="font-semibold text-brand-primary hover:underline">501 769 166</a>
              {" "}lub napisz — bezpłatnie wycenimy czynsz i opowiemy, jak szybko znaleźć dobrego najemcę.
            </p>
            <ContactFormWithBoundary />
          </section>

          {/* ── Linki powiązane ── */}
          <section className="rounded-2xl bg-white px-5 py-8 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Zobacz też</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-xl font-bold text-black sm:text-2xl">Inne usługi i oferty</h2>
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







