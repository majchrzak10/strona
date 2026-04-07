import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactDetailsSection from "@/components/ContactDetailsSection";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumbJsonLd";
import { faqJsonLd } from "@/lib/seo/faqJsonLd";
import { canonicalUrl } from "@/lib/seo/site";

const PAGE_URL = canonicalUrl("nieruchomosci-wagrowiec");

export const metadata: Metadata = {
  title: "Nieruchomości Wągrowiec i powiat wągrowiecki",
  description:
    "Sprzedaż i wynajem nieruchomości w Wągrowcu i powiecie wągrowieckim. Domy, mieszkania, działki i lokale. Biuro Dan-Dom — 30 lat doświadczenia, zadzwoń: 501 769 166.",
  alternates: { canonical: PAGE_URL },
  openGraph: { url: PAGE_URL },
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Strona główna", route: "" },
  { name: "Nieruchomości Wągrowiec", route: "nieruchomosci-wagrowiec" },
]);

const faq = faqJsonLd("wagrowiec", [
  {
    question: "Czy Dan-Dom obsługuje cały powiat wągrowiecki?",
    answer:
      "Tak. Biuro Dan-Dom obsługuje Wągrowiec oraz gminy powiatu wągrowieckiego: Skoki, Gołańcz, Budzyń, Wapno i Mieścisko. Działamy na lokalnym rynku od 1996 roku.",
  },
  {
    question: "Ile kosztują nieruchomości w Wągrowcu?",
    answer:
      "Ceny mieszkań na rynku wtórnym w Wągrowcu wahają się od 4500 do 7000 zł/m². Domy jednorodzinne — od 350 000 zł wzwyż. Działki budowlane od 50 zł/m². Oferujemy bezpłatną wycenę — zadzwoń: 501 769 166.",
  },
  {
    question: "Jak sprzedać nieruchomość w Wągrowcu?",
    answer:
      "Zadzwoń do biura Dan-Dom pod 501 769 166. Umówimy bezpłatne oględziny, wycenimy nieruchomość, przygotujemy marketing i zajmiemy się całą procedurą — od ogłoszenia po akt notarialny.",
  },
  {
    question: "Czy pomagacie przy zakupie działki w powiecie wągrowieckim?",
    answer:
      "Tak. Mamy w ofercie działki budowlane, rolne i rekreacyjne w Wągrowcu i okolicach — w tym atrakcyjne lokalizacje przy jeziorze Durowskim i Rgielskim. Sprawdź aktualne oferty na dan-dom.pl.",
  },
]);

const areas = [
  "Wągrowiec",
  "Skoki",
  "Gołańcz",
  "Budzyń",
  "Wapno",
  "Mieścisko",
  "Runowo",
  "Skoki",
];

export default function NieruchomosciWagrowiecPage() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f4f4f4] text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      <Navbar />

      <main className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px] space-y-5">

          {/* ── Hero ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <nav aria-label="Ścieżka nawigacji" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
              <Link href="/" className="hover:text-brand-primary">Strona główna</Link>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-700">Nieruchomości Wągrowiec</span>
            </nav>

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Biuro Dan-Dom</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Nieruchomości w Wągrowcu<br className="hidden sm:block" /> i powiecie wągrowieckim
            </h1>
            <div className="mt-4 h-0.5 w-14 rounded bg-brand-primary" />

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
              Biuro nieruchomości Dan-Dom działa w Wągrowcu od 1996 roku. Obsługujemy sprzedaż,
              zakup i wynajem nieruchomości na terenie całego powiatu wągrowieckiego —
              mieszkań, domów, działek i lokali użytkowych. 30 lat doświadczenia i znajomość
              lokalnego rynku to nasza największa przewaga.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/nieruchomosci/"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                Zobacz aktualne oferty
              </Link>
              <a
                href="tel:501769166"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-primary px-6 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                Zadzwoń: 501 769 166
              </a>
            </div>
          </section>

          {/* ── Obsługiwane miejscowości ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Zasięg działania</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              Powiat wągrowiecki — gdzie działamy?
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
              Obsługujemy nieruchomości na terenie całego powiatu wągrowieckiego.
              Biuro Dan-Dom mieści się przy ul. Kościuszki 28 w Wągrowcu — zapraszamy
              do kontaktu osobistego lub telefonicznego.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700"
                >
                  {area}
                </span>
              ))}
              <span className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-500">
                i okolice
              </span>
            </div>
          </section>

          {/* ── Oferta ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Co oferujemy</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              Nieruchomości w powiecie wągrowieckim
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Mieszkania", desc: "Kawalerki, mieszkania 2–5 pokojowe w Wągrowcu i okolicach." },
                { title: "Domy jednorodzinne", desc: "Domy wolnostojące, bliźniaki i szeregówki w całym powiecie." },
                { title: "Działki", desc: "Działki budowlane, rolne i rekreacyjne — w tym nad jeziorami." },
                { title: "Lokale użytkowe", desc: "Biura, sklepy i obiekty komercyjne w Wągrowcu." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-zinc-100 bg-brand-primary/[0.02] p-5 transition-all hover:border-brand-primary/20 hover:shadow-md">
                  <h3 className="font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/nieruchomosci/"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary/85"
              >
                Przeglądaj wszystkie oferty
              </Link>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Najczęstsze pytania</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              FAQ — nieruchomości Wągrowiec
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

          <section className="mt-4" aria-label="Kontakt i nasze dane">
            <ContactDetailsSection />
          </section>

        </div>
      </main>
    </div>
  );
}
