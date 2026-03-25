import type { AsariOfferCard } from "./types";

/** Uproszczona kategoria do filtrów (tekst z XML bywa różny). */
export type CategoryFilterKey =
  | "all"
  | "mieszkanie"
  | "dom"
  | "dzialka"
  | "lokal"
  | "inne";

export function categoryBucket(raw: string): CategoryFilterKey {
  const c = raw.trim().toUpperCase();
  if (!c) return "inne";
  if (c.includes("MIESZKAN")) return "mieszkanie";
  if (c.includes("DOM")) return "dom";
  if (c.includes("DZIAŁ") || c.includes("DZIALK")) return "dzialka";
  if (
    c.includes("LOKAL") ||
    c.includes("BIURO") ||
    c.includes("USŁUG") ||
    c.includes("KOMERC") ||
    c.includes("GARAŻ") ||
    c.includes("GARAZ")
  ) {
    return "lokal";
  }
  return "inne";
}

/** Zgodnie z `?typ=` — transakcja z pola `tag` (jak w mapOffer). */
export type TransactionTypeKey = "sprzedaz" | "wynajem";

export function matchesTransactionTag(tag: string, typ: TransactionTypeKey): boolean {
  const t = tag.toLowerCase();
  if (typ === "wynajem") return t.includes("wynajem");
  return t.includes("sprzedaż") || t.includes("sprzedaz");
}

export type SortKey = "newest" | "price_asc" | "price_desc";

export type OfferFilterQuery = {
  kat: CategoryFilterKey;
  minPln: number | null;
  maxPln: number | null;
  /** `null` = dowolna; `5` = 5+ pokoi */
  pok: number | null;
  typ: TransactionTypeKey;
  sort: SortKey;
};

function priceOk(pln: number | null, min: number | null, max: number | null): boolean {
  if (pln == null) return true;
  if (min != null && pln < min) return false;
  if (max != null && pln > max) return false;
  return true;
}

function roomsOk(
  o: AsariOfferCard,
  bucket: CategoryFilterKey,
  pok: number | null,
): boolean {
  if (pok == null) return true;
  if (bucket !== "mieszkanie" && bucket !== "dom") return true;
  if (o.roomsCount == null) return true;
  if (pok >= 5) return o.roomsCount >= 5;
  return o.roomsCount === pok;
}

export function filterOffers(
  offers: AsariOfferCard[],
  q: OfferFilterQuery,
): AsariOfferCard[] {
  return offers.filter((o) => {
    if (!matchesTransactionTag(o.tag, q.typ)) return false;
    const bucket = categoryBucket(o.category);
    if (q.kat !== "all" && bucket !== q.kat) return false;
    if (!priceOk(o.pricePln, q.minPln, q.maxPln)) return false;
    return roomsOk(o, bucket, q.pok);
  });
}

/** Oferty bez ceny (`pricePln === null`) są na końcu przy sortowaniu po cenie. */
export function sortOffers(offers: AsariOfferCard[], sort: SortKey): AsariOfferCard[] {
  const copy = [...offers];
  if (sort === "newest") {
    return copy.sort((a, b) => {
      const aNull = a.listedAtMs == null;
      const bNull = b.listedAtMs == null;
      if (aNull && bNull) return 0;
      if (aNull) return 1;
      if (bNull) return -1;
      return b.listedAtMs! - a.listedAtMs!;
    });
  }
  if (sort === "price_asc") {
    return copy.sort((a, b) => {
      const ap = a.pricePln;
      const bp = b.pricePln;
      const aNull = ap == null;
      const bNull = bp == null;
      if (aNull && bNull) return 0;
      if (aNull) return 1;
      if (bNull) return -1;
      return ap - bp;
    });
  }
  return copy.sort((a, b) => {
    const ap = a.pricePln;
    const bp = b.pricePln;
    const aNull = ap == null;
    const bNull = bp == null;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return bp - ap;
  });
}
