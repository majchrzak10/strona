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

const PAGE_URL = canonicalUrl("uslugi/sprzedaz-nieruchomosci");

export const metadata: Metadata = {
  title: "Sprzedaż nieruchomości — Dan-Dom Wągrowiec i Rogoźno",
  description:
    "Skuteczna sprzedaż mieszkań, domów, działek i lokali. Bezpłatna wycena, pomoc w formalnościach i negocjacjach. Biuro nieruchomości Dan-Dom — ponad 25 lat doświadczenia w Wągrowcu i Rogoźnie.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "Sprzedaż nieruchomości — Dan-Dom Wągrowiec i Rogoźno",
    description:
      "Skuteczna sprzedaż mieszkań, domów i działek. Bezpłatna wycena, pomoc w formalnościach i negocjacjach.",
    images: [
      {
        url: "/hero-biuro.jpg",
        width: 1200,
        height: 800,
        alt: "Dan-Dom Nieruchomości — sprzedaż nieruchomości",
      },
    ],
  },
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Strona główna", route: "" },
  { name: "Usługi", route: "uslugi" },
  { name: "Sprzedaż nieruchomości", route: "uslugi/sprzedaz-nieruchomosci" },
]);

const service = serviceJsonLd({
  name: "Sprzedaż nieruchomości",
  description:
    "Kompleksowa obsługa sprzedaży mieszkań, domów, działek i lokali użytkowych. Wycena, marketing, negocjacje i pełna obsługa formalna.",
  url: PAGE_URL,
  areaName: "Wągrowiec",
});

const faq = faqJsonLd("sprzedaz-nieruchomosci", [
  {
    question: "Ile trwa sprzedaż mieszkania lub domu przez biuro Dan-Dom?",
    answer:
      "Czas sprzedaży zależy od rodzaju nieruchomości i ceny rynkowej. Przy właściwej wycenie i skutecznym marketingu większość nieruchomości sprzedajemy w ciągu 1–4 miesięcy.",
  },
  {
    question: "Jak wycenić nieruchomość przed sprzedażą?",
    answer:
      "Oferujemy bezpłatną wstępną wycenę nieruchomości. Przyjeżdżamy na oględziny, analizujemy aktualny rynek lokalny, porównujemy podobne transakcje i uwzględniamy stan oraz lokalizację nieruchomości.",
  },
  {
    question: "Jakie dokumenty są potrzebne do sprzedaży nieruchomości?",
    answer:
      "Do sprzedaży potrzebny jest akt własności (akt notarialny lub wypis z KW), zaświadczenia o braku zaległości podatkowych i czynszowych oraz — przy spółdzielczym prawie — zaświadczenie ze spółdzielni. Pomożemy zebrać wszystkie niezbędne dokumenty.",
  },
  {
    question: "Czy biuro Dan-Dom pobiera prowizję przy sprzedaży?",
    answer:
      "Wynagrodzenie biura jest ustalane indywidualnie i wypłacane dopiero po skutecznej sprzedaży. Szczegóły ustalamy na bezpłatnym spotkaniu — zadzwoń lub napisz przez formularz.",
  },
  {
    question: "Czy pomagacie w przygotowaniu nieruchomości do sprzedaży?",
    answer:
      "Tak. Doradzamy w zakresie drobnych napraw, sesji fotograficznej i home stagingu, które skracają czas sprzedaży i pozwalają uzyskać lepszą cenę.",
  },
]);

const relatedPages = [
  { href: "/uslugi/wynajem-nieruchomosci/", label: "Wynajem nieruchomości" },
  { href: "/uslugi/wycena-nieruchomosci/", label: "Wycena nieruchomości" },
  { href: "/nieruchomosci/", label: "Aktualne oferty sprzedaży" },
];

export default function SprzedazNieruchomosciPage() {
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
              <span className="text-zinc-700">Sprzedaż nieruchomości</span>
            </nav>

            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Usługi</p>
                <h1 className="mt-2 font-[var(--font-playfair)] text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                  Sprzedaż nieruchomości
                </h1>
                <div className="mt-4 h-0.5 w-14 rounded bg-brand-primary" />
                <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
                  Skutecznie sprzedajemy mieszkania, domy, działki i lokale użytkowe. Działamy lokalnie — znamy rynek
                  i mamy bazę aktywnych kupujących. Oferujemy bezpłatną wycenę, profesjonalny marketing i pełną
                  obsługę formalności — od pierwszego kontaktu aż po podpisanie aktu notarialnego.
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
              Jak wygląda sprzedaż z Dan-Dom?
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Bezpłatna wycena",
                  desc: "Przyjeżdżamy, oceniamy stan i lokalizację nieruchomości, analizujemy lokalny rynek i proponujemy optymalną cenę wywoławczą.",
                },
                {
                  step: "02",
                  title: "Marketing i prezentacja",
                  desc: "Profesjonalne zdjęcia, ogłoszenia na portalach (OtoDom, Gratka, własna strona) i aktywne poszukiwanie kupców z naszej bazy klientów.",
                },
                {
                  step: "03",
                  title: "Negocjacje",
                  desc: "Prowadzimy negocjacje w Twoim imieniu — dbamy o Twój interes i najlepszą cenę sprzedaży.",
                },
                {
                  step: "04",
                  title: "Finalizacja i akt notarialny",
                  desc: "Kompletujemy dokumenty, koordynujemy termin u notariusza i towarzyszymy przy podpisaniu umowy.",
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

          {/* ── Problem / Solution ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Dlaczego to działa</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              Typowe problemy przy sprzedaży — i jak je rozwiązujemy
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  problem: "Nieruchomość długo stoi bez kupca",
                  solution: "Analizujemy przyczynę — najczęściej cena lub prezentacja. Korygujemy strategię i docieramy do właściwych kupców z naszej bazy klientów.",
                },
                {
                  problem: "Nie wiem, ile warta jest moja nieruchomość",
                  solution: "Bezpłatna wycena na miejscu. Znamy lokalny rynek — ceny transakcyjne, a nie tylko ofertowe.",
                },
                {
                  problem: "Formalności i dokumenty przytłaczają",
                  solution: "Prowadzimy przez cały proces: zgromadzenie dokumentów, kontakt z notariuszem i bankiem kupującego.",
                },
                {
                  problem: "Obawiam się nieuczciwych kupujących",
                  solution: "Weryfikujemy wiarygodność zainteresowanych i pomagamy zabezpieczyć umowę przedwstępną.",
                },
                {
                  problem: "Nie mam czasu na prezentacje",
                  solution: "Organizujemy i prowadzimy prezentacje w Twoim imieniu — w godzinach dostosowanych do kupujących.",
                },
                {
                  problem: "Sprzedaję po raz pierwszy i nie wiem, od czego zacząć",
                  solution: "Wyjaśniamy każdy krok. Zadzwoń — bezpłatna konsultacja bez zobowiązań.",
                },
              ].map((item) => (
                <div key={item.problem} className="rounded-xl border border-zinc-100 p-5 transition-all hover:border-brand-primary/20 hover:shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{item.problem}</p>
                      <p className="mt-1.5 text-sm leading-6 text-zinc-600">{item.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Najczęstsze pytania</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              FAQ — sprzedaż nieruchomości
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
              Chcesz sprzedać nieruchomość?
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
            <p className="mt-4 text-sm text-zinc-600">
              Zadzwoń na{" "}
              <a href="tel:501769166" className="font-semibold text-brand-primary hover:underline">501 769 166</a>
              {" "}lub wypełnij formularz — oddzwonimy i ustalimy termin bezpłatnych oględzin.
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







