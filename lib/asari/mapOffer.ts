import type { AsariOfferCard, AsariOfferDetail } from "./types";
import { matchesTransactionTag } from "./filterOffers";
import { relativeUrlForZdjeciaFile } from "./imageUrl";
import { extractPictures, parametersToMap } from "./parse";

function slugFromSignature(signature: string): string {
  return signature.replace(/\//g, "-").replace(/\s+/g, "");
}

function formatPrice(pln: number | null | undefined): string {
  if (pln == null || !Number.isFinite(pln) || pln === 0) {
    return "Cena do uzgodnienia";
  }
  return (
    new Intl.NumberFormat("pl-PL", {
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(pln) + " zł"
  );
}

function parseOfferPricePln(pm: Map<string, string>): number | null {
  const raw = (pm.get("10") ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

/** Param 13 — cena ofertowa za 1 m² (PLN). */
function parseOfferPricePerM2Pln(pm: Map<string, string>): number | null {
  const raw = (pm.get("13") ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function getAreaM2Numeric(pm: Map<string, string>, category: string): number | null {
  const lotM2 = parseAreaM2(pm.get("61"));
  const totalM2 = parseAreaM2(pm.get("128"));
  const usableM2 = parseAreaM2(pm.get("58"));

  if (isPlotCategory(category)) {
    if (lotM2 != null) return lotM2;
    if (totalM2 != null) return totalM2;
    return null;
  }
  if (totalM2 != null) return totalM2;
  if (usableM2 != null) return usableM2;
  if (lotM2 != null) return lotM2;
  return null;
}

function formatPricePerM2Pln(pln: number): string {
  return (
    new Intl.NumberFormat("pl-PL", {
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(Math.round(pln)) + " zł/m²"
  );
}

function buildPricePerM2Label(
  pm: Map<string, string>,
  category: string,
  pricePln: number | null,
  transaction: string,
): string | null {
  if (!matchesTransactionTag(transaction, "sprzedaz")) return null;
  const fromXml = parseOfferPricePerM2Pln(pm);
  if (fromXml != null) return formatPricePerM2Pln(fromXml);
  const area = getAreaM2Numeric(pm, category);
  if (pricePln != null && pricePln > 0 && area != null && area > 0) {
    return formatPricePerM2Pln(pricePln / area);
  }
  return null;
}

/** Param 19 — pierwsza liczba (np. „3”, „5+”, „3-POKOJOWE”). */
function parseRoomsCount(raw: string): number | null {
  const t = raw.trim();
  if (!t || t === "—" || t === "-") return null;
  const m = t.match(/(\d+)/);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** Param 79 — liczba pokoi (liczba); wyższe pokrycie niż sam param. 19. */
function parseRoomsCountFrom79(pm: Map<string, string>): number | null {
  const raw = (pm.get("79") ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

/** Łączy 79 (preferowane) i 19. */
function parseRoomsCountCombined(pm: Map<string, string>): number | null {
  const from79 = parseRoomsCountFrom79(pm);
  if (from79 != null) return from79;
  return parseRoomsCount((pm.get("19") ?? "").trim());
}

/** Krótka etykieta pokoi po polsku. */
function formatRoomsPhrasePl(n: number): string {
  if (n === 1) return "1 pokój";
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${n} pokoje`;
  }
  return `${n} pokoi`;
}

function buildRoomsLabel(pm: Map<string, string>): string {
  const n = parseRoomsCountCombined(pm);
  if (n != null && n > 0) return formatRoomsPhrasePl(n);
  const raw19 = (pm.get("19") ?? "").trim();
  if (raw19 && raw19 !== "—" && raw19 !== "-") return raw19;
  return "";
}

function formatFloorLabel(pm: Map<string, string>): string | null {
  const raw = (pm.get("62") ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return null;
  if (n === 0) return "Parter";
  const k = Math.round(n);
  return `${k}. piętro`;
}

function pickMainImage(
  pictures: { name: string; status: string; weight: number }[],
): string | null {
  if (pictures.length === 0) return null;
  const main = pictures.find((p) => String(p.status) === "1");
  if (main) return main.name;
  return [...pictures].sort((a, b) => a.weight - b.weight)[0]?.name ?? null;
}

function parseAreaM2(raw: string | undefined): number | null {
  const t = (raw ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!t) return null;
  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

/** Param 36 — działki: powierzchnia w polu 61 (lotArea), nie 128 (pow. budynku). */
function isPlotCategory(category: string): boolean {
  const c = category.trim().toUpperCase();
  return c === "DZIAŁKA" || c.startsWith("DZIAŁKA") || c.includes("DZIAŁK");
}

function formatAreaLabelM2(value: number): string {
  return `${value.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} m²`;
}

/** Próbuje kilku typowych parametrów Asari z datą wprowadzenia / modyfikacji. */
function parseListedAtMs(pm: Map<string, string>): number | null {
  const ids = ["500", "494", "495", "497", "496", "503", "498"];
  for (const id of ids) {
    const raw = (pm.get(id) ?? "").trim();
    if (!raw) continue;
    const ms = parseFlexibleDateMs(raw);
    if (ms != null) return ms;
  }
  return null;
}

function parseFlexibleDateMs(s: string): number | null {
  const t = s.trim();
  const m1 = t.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})/);
  if (m1) {
    const d = Number(m1[1]);
    const mo = Number(m1[2]) - 1;
    let y = Number(m1[3]);
    if (y < 100) y += 2000;
    const dt = new Date(y, mo, d);
    return Number.isFinite(dt.getTime()) ? dt.getTime() : null;
  }
  const iso = Date.parse(t);
  return Number.isFinite(iso) ? iso : null;
}

function buildAreaLabel(pm: Map<string, string>, category: string): string {
  const lotM2 = parseAreaM2(pm.get("61"));
  const totalM2 = parseAreaM2(pm.get("128"));
  const usableM2 = parseAreaM2(pm.get("58"));

  if (isPlotCategory(category)) {
    if (lotM2 != null) return formatAreaLabelM2(lotM2);
    if (totalM2 != null) return formatAreaLabelM2(totalM2);
    return "";
  }

  if (totalM2 != null) return formatAreaLabelM2(totalM2);
  if (usableM2 != null) return formatAreaLabelM2(usableM2);
  if (lotM2 != null) return formatAreaLabelM2(lotM2);
  return "";
}

export function rawOfferToDetail(raw: unknown): AsariOfferDetail | null {
  const offer = raw as {
    signature?: string;
    parameters?: unknown;
    pictures?: unknown;
    description?: string;
  };
  const signature = String(offer.signature ?? "").trim();
  if (!signature) return null;

  const pm = parametersToMap(offer.parameters);
  const price = parseOfferPricePln(pm);

  const category = (pm.get("36") ?? "").trim() || "Nieruchomość";
  const transaction = (pm.get("43") ?? "").trim() || "Oferta";
  const city = (pm.get("48") ?? pm.get("47") ?? "").trim();
  const district = (pm.get("300") ?? "").trim();
  const titleShort = (pm.get("491") ?? "").trim();
  const areaLabel = buildAreaLabel(pm, category);

  const roomsLabel = buildRoomsLabel(pm);
  const roomsCount = parseRoomsCountCombined(pm);

  const title =
    titleShort ||
    [category, city].filter(Boolean).join(" · ") ||
    `Oferta ${signature}`;

  const locationLabel = [district, city].filter(Boolean).join(", ") || city || "—";

  const pics = extractPictures(offer.pictures);
  const mainName = pickMainImage(pics);
  const mainImageSrc = mainName ? relativeUrlForZdjeciaFile(mainName) : null;

  const desc = String(offer.description ?? "").trim();

  const agentName = (pm.get("305") ?? "").trim();
  const agentPhone = (pm.get("170") ?? "").trim();
  const agentImageSrc = resolveAgentImageSrc(pm);

  const listedAtMs = parseListedAtMs(pm);
  const floorLabel = formatFloorLabel(pm);
  const pricePerM2Label = buildPricePerM2Label(pm, category, price, transaction);

  return {
    signature,
    slug: slugFromSignature(signature),
    title,
    priceLabel: formatPrice(price),
    pricePerM2Label,
    areaLabel,
    roomsLabel,
    locationLabel,
    tag: transaction,
    mainImageSrc,
    category,
    pricePln: price,
    roomsCount,
    transaction,
    descriptionHtml: desc,
    images: pics.map((p) => ({
      name: p.name,
      weight: p.weight,
      src: relativeUrlForZdjeciaFile(p.name),
    })),
    agentName,
    agentPhone,
    agentImageSrc,
    listedAtMs,
    floorLabel,
  };
}

/** Zdjęcie agenta: zewnętrzny URL lub nazwa pliku w katalogu zdjęć Asari (param. niestandardowy 306). */
function resolveAgentImageSrc(pm: Map<string, string>): string | null {
  const raw = (pm.get("306") ?? "").trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^[A-Za-z0-9_.-]+\.(jpe?g|png|webp|gif)$/i.test(raw)) {
    return relativeUrlForZdjeciaFile(raw);
  }
  return null;
}

export function toCard(o: AsariOfferDetail): AsariOfferCard {
  return {
    signature: o.signature,
    slug: o.slug,
    title: o.title,
    priceLabel: o.priceLabel,
    pricePerM2Label: o.pricePerM2Label,
    areaLabel: o.areaLabel,
    roomsLabel: o.roomsLabel,
    locationLabel: o.locationLabel,
    tag: o.tag,
    mainImageSrc: o.mainImageSrc,
    category: o.category,
    pricePln: o.pricePln,
    roomsCount: o.roomsCount,
    listedAtMs: o.listedAtMs,
    floorLabel: o.floorLabel,
  };
}

