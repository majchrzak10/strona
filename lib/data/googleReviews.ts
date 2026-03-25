/**
 * Fragmenty opinii — podmień `quote` na dokładny tekst z Google Business Profile,
 * gdy chcesz cytat 1:1 (Panel Google → Opinie).
 * `author` — imię i inicjał nazwiska, jak w Google (lub „Klient Google”).
 */
export const GOOGLE_REVIEWS_LIST_URL =
  "https://www.google.com/maps/search/?api=1&query=Dan-Dom+Biuro+Obrotu+Nieruchomościami+ul.+Kościuszki+28+62-100+Wągrowiec";

export type ReviewSnippet = {
  id: string;
  /** Tekst opinii (skrócony lub pełny cytat). */
  quote: string;
  /** Podpis pod cytatem, np. „Anna K.” */
  author: string;
};

export const REVIEW_SNIPPETS: ReviewSnippet[] = [
  {
    id: "1",
    quote:
      "Pełen profesjonalizm od pierwszego spotkania. Sprawa załatwiona sprawnie, bez zbędnych formalności. Polecam każdemu, kto szuka biura z doświadczeniem.",
    author: "Anna K.",
  },
  {
    id: "2",
    quote:
      "Indywidualne podejście i ogromna cierpliwość przy pytaniach. Czuliśmy się pewnie przez całą transakcję — widać znajomość lokalnego rynku.",
    author: "Tomasz M.",
  },
  {
    id: "3",
    quote:
      "Szybki kontakt, jasne informacje i pomoc na każdym etapie. Dziękujemy za spokój przy tak ważnej decyzji jak zakup mieszkania.",
    author: "Magdalena W.",
  },
];
