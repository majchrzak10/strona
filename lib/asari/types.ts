export type AsariOfferCard = {
  signature: string;
  slug: string;
  title: string;
  priceLabel: string;
  areaLabel: string;
  roomsLabel: string;
  locationLabel: string;
  tag: string;
  mainImageSrc: string | null;
  /** Typ nieruchomości z eksportu (np. MIESZKANIE, DZIAŁKA). */
  category: string;
  /** Cena z XML (param. 10), PLN — `null` gdy brak lub „do uzgodnienia”. */
  pricePln: number | null;
  /** Cena za m² — tylko sprzedaż; `null` przy wynajmie lub braku danych. */
  pricePerM2Label: string | null;
  /** Pierwsza liczba z param. 19 (pokoje); `null` gdy brak danych. */
  roomsCount: number | null;
  /**
   * Z parametrów XML — sortowanie „najnowsze” na liście.
   * `null` gdy brak daty w eksporcie.
   */
  listedAtMs: number | null;
  /** Piętro (param. 62), np. „Parter”, „3. piętro” — `null` gdy brak w XML. */
  floorLabel: string | null;
};

/** Jedno zdjęcie w galerii — `src` ustawiane przy buildzie (WebP jeśli wygenerowany). */
export type AsariImageRef = { name: string; weight: number; src: string };

export type AsariOfferDetail = AsariOfferCard & {
  descriptionHtml: string;
  images: AsariImageRef[];
  transaction: string;
  agentName: string;
  agentPhone: string;
  /** Pełny `src` dla avatara: `https://…` lub `/api/asari/zdjecie/…`; puste → fallback w UI. */
  agentImageSrc: string | null;
};
