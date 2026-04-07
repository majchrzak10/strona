import { canonicalUrl, SITE_URL } from "./site";

/** Schema.org dla biura nieruchomości (Google Rich Results / lokalne / LLM-friendly fakty). */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE_URL}/#organization`,
  name: "Dan-Dom Nieruchomości",
  url: canonicalUrl(""),
  telephone: "+48501769166",
  email: "biuro@dan-dom.pl",
  image: `${SITE_URL}/hero-biuro.jpg`,
  logo: `${SITE_URL}/icon-512.png`,
  description:
    "Biuro nieruchomości z ponad 30-letnim doświadczeniem. Sprzedaż, zakup i wynajem nieruchomości w Wągrowcu i Rogoźnie.",
  foundingDate: "1996",
  priceRange: "$$",
  areaServed: [
    { "@type": "City", name: "Wągrowiec" },
    { "@type": "City", name: "Rogoźno" },
  ],
  sameAs: [
    "https://share.google/jGEGIgNzbrSzlVAR1",
    "https://share.google/iEoxCilgWTTCoq5bl",
  ],
  location: [
    {
      "@type": "Place",
      name: "Dan-Dom Nieruchomości — Wągrowiec",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ul. Kościuszki 28",
        postalCode: "62-100",
        addressLocality: "Wągrowiec",
        addressRegion: "wielkopolskie",
        addressCountry: "PL",
      },
    },
    {
      "@type": "Place",
      name: "Dan-Dom Nieruchomości — Rogoźno",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ul. Wielka Poznańska 29",
        postalCode: "64-610",
        addressLocality: "Rogoźno",
        addressRegion: "wielkopolskie",
        addressCountry: "PL",
      },
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "60",
    bestRating: "5",
    worstRating: "1",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "16:00",
  },
} as const;
