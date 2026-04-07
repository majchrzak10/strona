import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactDetailsSection from "@/components/ContactDetailsSection";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumbJsonLd";
import { faqJsonLd } from "@/lib/seo/faqJsonLd";
import { canonicalUrl } from "@/lib/seo/site";

const PAGE_URL = canonicalUrl("nieruchomosci-rogozno");

export const metadata: Metadata = {
  title: "Nieruchomości Rogoźno i powiat obornicki",
  description:
    "Sprzedaż i wynajem nieruchomości w Rogoźnie i powiecie obornickim. Domy, mieszkania, działki i lokale. Biuro Dan-Dom — 30 lat doświadczenia, zadzwoń: 506 541 111.",
  alternates: { canonical: PAGE_URL },
  openGraph: { url: PAGE_URL },
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Strona główna", route: "" },
  { name: "Nieruchomości Rogoźno", route: "nieruchomosci-rogozno" },
]);

const faq = faqJsonLd("rogozno", [
  {
    question: "Czy Dan-Dom obsługuje powiat obornicki?",
    answer:
      "Tak. Biuro Dan-Dom prowadzi oddział w Rogoźnie przy ul. Wielkiej Poznańskiej 29 i obsługuje cały powiat obornicki — Rogoźno, Oborniki i Ryczywół. Kontakt: 506 541 111.",
  },
  {
    question: "Ile kosztują nieruchomości w Rogoźnie?",
    answer:
      "Ceny nieruchomości w Rogoźnie są niższe niż w Poznaniu — domy od 300 000 zł, mieszkania od 4000 zł/m². Atrakcyjna lokalizacja 50 km od Poznania przyciąga coraz więcej kupujących. Zadzwoń po bezpłatną wycenę: 506 541 111.",
  },
  {
    question: "Jak sprzedać dom lub mieszkanie w Rogoźnie?",
    answer:
      "Skontaktuj się z naszym biurem w Rogoźnie pod numerem 506 541 111. Bezpłatnie wycenimy nieruchomość, przygotujemy marketing i przeprowadzimy przez cały proces sprzedaży.",
  },
  {
    question: "Czy Dan-Dom ma oferty w całym powiecie obornickim?",
    answer:
      "Tak. Obsługujemy nieruchomości w Rogoźnie, Obornikach, Ryczywole i okolicznych miejscowościach. Sprawdź aktualne oferty na dan-dom.pl lub zadzwoń: 506 541 111.",
  },
]);

const areas = [
  "Rogoźno",
  "Oborniki",
  "Ryczywół",
  "Budziszewko",
  "Garbatka",
  "Parkowo",
];

export default function NieruchomosciRogoznoPage() {
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
              <span className="text-zinc-700">Nieruchomości Rogoźno</span>
            </nav>

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Biuro Dan-Dom</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Nieruchomości w Rogoźnie<br className="hidden sm:block" /> i powiecie obornickim
            </h1>
            <div className="mt-4 h-0.5 w-14 rounded bg-brand-primary" />

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
              Oddział biura Dan-Dom w Rogoźnie obsługuje sprzedaż, zakup i wynajem
              nieruchomości na terenie powiatu obornickiego. Znajdziesz u nas domy,
              mieszkania, działki i lokale użytkowe. Rogoźno leży 50 km od Poznania —
              to atrakcyjna lokalizacja dla osób szukających spokojnego miejsca w dobrej
              cenie.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/nieruchomosci/"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                Zobacz aktualne oferty
              </Link>
              <a
                href="tel:506541111"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-primary px-6 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                Zadzwoń: 506 541 111
              </a>
            </div>
          </section>

          {/* ── Obsługiwane miejscowości ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Zasięg działania</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              Powiat obornicki — gdzie działamy?
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
              Biuro Dan-Dom w Rogoźnie mieści się przy ul. Wielkiej Poznańskiej 29.
              Obsługujemy nieruchomości na terenie całego powiatu oborniciego —
              zapraszamy do kontaktu osobistego lub telefonicznego.
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
              Nieruchomości w powiecie obornickim
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Mieszkania", desc: "Mieszkania w Rogoźnie i Obornikach w atrakcyjnych cenach." },
                { title: "Domy jednorodzinne", desc: "Domy wolnostojące i bliźniaki — cisza i zieleń blisko Poznania." },
                { title: "Działki", desc: "Działki budowlane i rolne w powiecie obornickim." },
                { title: "Lokale użytkowe", desc: "Lokale handlowe i usługowe w Rogoźnie i okolicach." },
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
              FAQ — nieruchomości Rogoźno
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
