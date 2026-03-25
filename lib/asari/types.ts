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
};

export type AsariOfferDetail = AsariOfferCard & {
  descriptionHtml: string;
  images: { name: string; weight: number }[];
  transaction: string;
  agentName: string;
  agentPhone: string;
  /** Pełny `src` dla avatara: `https://…` lub `/api/asari/zdjecie/…`; puste → fallback w UI. */
  agentImageSrc: string | null;
};
