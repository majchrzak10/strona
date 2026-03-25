import type { AsariOfferCard, AsariOfferDetail } from "./types";
import { extractPictures, parametersToMap } from "./parse";

const PLACEHOLDER_IMG = "/globe.svg";

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

function buildAreaLabel(pm: Map<string, string>, category: string): string {
  const lotM2 = parseAreaM2(pm.get("61"));
  const totalM2 = parseAreaM2(pm.get("128"));
  const usableM2 = parseAreaM2(pm.get("58"));

  if (isPlotCategory(category)) {
    if (lotM2 != null) return formatAreaLabelM2(lotM2);
    if (totalM2 != null) return formatAreaLabelM2(totalM2);
    return "Brak danych";
  }

  if (totalM2 != null) return formatAreaLabelM2(totalM2);
  if (usableM2 != null) return formatAreaLabelM2(usableM2);
  if (lotM2 != null) return formatAreaLabelM2(lotM2);
  return "Brak danych";
}

export function rawOfferToDetail(raw: unknown): AsariOfferDetail | null {
  const offer = raw as {
    signature?: string;
    parameters?: unknown;
    pictures?: unknown;
    description?: string;
  };
  const signature = (offer.signature ?? "").trim();
  if (!signature) return null;

  const pm = parametersToMap(offer.parameters);
  const price = parseOfferPricePln(pm);

  const category = (pm.get("36") ?? "").trim() || "Nieruchomość";
  const transaction = (pm.get("43") ?? "").trim() || "Oferta";
  const city = (pm.get("48") ?? pm.get("47") ?? "").trim();
  const district = (pm.get("300") ?? "").trim();
  const titleShort = (pm.get("491") ?? "").trim();
  const areaLabel = buildAreaLabel(pm, category);

  const rooms = (pm.get("19") ?? "").trim();
  const roomsLabel = rooms || "—";

  const title =
    titleShort ||
    [category, city].filter(Boolean).join(" · ") ||
    `Oferta ${signature}`;

  const locationLabel = [district, city].filter(Boolean).join(", ") || city || "—";

  const pics = extractPictures(offer.pictures);
  const mainName = pickMainImage(pics);
  const mainImageSrc = mainName
    ? `/zdjecia/${encodeURIComponent(mainName)}`
    : null;

  const desc = (offer.description ?? "").trim();

  const agentName = (pm.get("305") ?? "").trim();
  const agentPhone = (pm.get("170") ?? "").trim();
  const agentImageSrc = resolveAgentImageSrc(pm);

  return {
    signature,
    slug: slugFromSignature(signature),
    title,
    priceLabel: formatPrice(price),
    areaLabel,
    roomsLabel,
    locationLabel,
    tag: transaction,
    mainImageSrc,
    category,
    transaction,
    descriptionHtml: desc,
    images: pics.map((p) => ({ name: p.name, weight: p.weight })),
    agentName,
    agentPhone,
    agentImageSrc,
  };
}

/** Zdjęcie agenta: zewnętrzny URL lub nazwa pliku w katalogu zdjęć Asari (param. niestandardowy 306). */
function resolveAgentImageSrc(pm: Map<string, string>): string | null {
  const raw = (pm.get("306") ?? "").trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^[A-Za-z0-9_.-]+\.(jpe?g|png|webp|gif)$/i.test(raw)) {
    return `/zdjecia/${encodeURIComponent(raw)}`;
  }
  return null;
}

export function toCard(o: AsariOfferDetail): AsariOfferCard {
  return {
    signature: o.signature,
    slug: o.slug,
    title: o.title,
    priceLabel: o.priceLabel,
    areaLabel: o.areaLabel,
    roomsLabel: o.roomsLabel,
    locationLabel: o.locationLabel,
    tag: o.tag,
    mainImageSrc: o.mainImageSrc,
    category: o.category,
  };
}

export { PLACEHOLDER_IMG };
