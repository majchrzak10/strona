/**
 * FB Post — wybierz jedną ofertę z eksportu Asari i wyślij payload do Make.com.
 *
 * Wymagane zmienne środowiskowe:
 *   MAKE_WEBHOOK_URL  — URL webhooka Make.com (GitHub Secret)
 *
 * Opcjonalne zmienne środowiskowe:
 *   ASARI_DATA_DIR    — ścieżka do folderu z plikami XML (domyślnie: asari-export/ w repo)
 *   SITE_URL          — domena strony (domyślnie: https://dan-dom.pl)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const STATE_FILE = path.join(__dirname, "state.json");

const SITE_URL = (process.env.SITE_URL ?? "https://dan-dom.pl").replace(/\/$/, "");
const MAX_PHOTOS = 5;

// ---------------------------------------------------------------------------
// Parsowanie XML (wzorzec z scripts/audit-asari.mjs)
// ---------------------------------------------------------------------------

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
  processEntities: { maxTotalExpansions: 500_000 },
});

function collectNodes(nodes) {
  if (nodes == null) return [];
  return Array.isArray(nodes) ? nodes : [nodes];
}

function paramText(p) {
  if (typeof p === "string") return p;
  if (typeof p === "number") return String(p);
  const t = p?.["#text"];
  if (t != null) return String(t);
  return "";
}

function parametersToMap(parameters) {
  const map = new Map();
  for (const p of collectNodes(parameters?.p)) {
    const id = p["@_id"];
    if (id != null) map.set(String(id), paramText(p));
  }
  return map;
}

function packageOffers(root) {
  const o = root?.PACKAGE?.offer;
  if (o == null) return [];
  return Array.isArray(o) ? o : [o];
}

function packageDeletedSignatures(root) {
  const sigRaw = root?.PACKAGE?.DELETE?.offers?.signature;
  if (sigRaw == null) return [];
  return collectNodes(sigRaw)
    .map((s) => String(s).trim())
    .filter(Boolean);
}

function extractPictures(pictures) {
  return collectNodes(pictures?.picture)
    .map((p) => ({
      name: String(p?.unique ?? "").trim(),
      weight: Number(p?.weight ?? 999),
    }))
    .filter((p) => p.name)
    .sort((a, b) => a.weight - b.weight);
}

function isOfferPackageFile(name) {
  return /_001\.xml$/i.test(name) &&
    !/^definictions\.xml$/i.test(name) &&
    !/_CFG\.xml$/i.test(name);
}

function resolveDataDir() {
  const raw = (process.env.ASARI_DATA_DIR ?? "").trim().replace(/^["']|["']$/g, "");
  if (raw) {
    const abs = path.isAbsolute(raw) ? raw : path.join(ROOT, raw);
    if (fs.existsSync(abs)) return abs;
  }
  const def = path.join(ROOT, "asari-export");
  return fs.existsSync(def) ? def : null;
}

// ---------------------------------------------------------------------------
// Parsowanie dat (wzorzec z lib/asari/mapOffer.ts)
// ---------------------------------------------------------------------------

function parseFlexibleDateMs(s) {
  const t = s.trim();
  const m = t.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})/);
  if (m) {
    let y = Number(m[3]);
    if (y < 100) y += 2000;
    const dt = new Date(y, Number(m[2]) - 1, Number(m[1]));
    return Number.isFinite(dt.getTime()) ? dt.getTime() : null;
  }
  const iso = Date.parse(t);
  return Number.isFinite(iso) ? iso : null;
}

function parseListedAtMs(pm) {
  for (const id of ["500", "494", "495", "497", "496", "503", "498"]) {
    const raw = (pm.get(id) ?? "").trim();
    if (!raw) continue;
    const ms = parseFlexibleDateMs(raw);
    if (ms != null) return ms;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Ładowanie i scalanie ofert
// ---------------------------------------------------------------------------

function loadOffers(dataDir) {
  const names = fs.readdirSync(dataDir).filter(isOfferPackageFile);
  if (names.length === 0) return [];

  const withStat = names
    .map((n) => ({ n, mtime: fs.statSync(path.join(dataDir, n)).mtimeMs }))
    .sort((a, b) => a.mtime - b.mtime);

  const bySig = new Map();

  for (const { n } of withStat) {
    let xml;
    try {
      xml = fs.readFileSync(path.join(dataDir, n), "utf8");
    } catch {
      continue;
    }
    let root;
    try {
      root = parser.parse(xml);
    } catch {
      continue;
    }
    for (const sig of packageDeletedSignatures(root)) {
      bySig.delete(sig);
    }
    for (const raw of packageOffers(root)) {
      const sig = String(raw?.signature ?? "").trim();
      if (sig) bySig.set(sig, raw);
    }
  }

  return [...bySig.entries()].map(([signature, raw]) => {
    const pm = parametersToMap(raw.parameters);
    const pictures = extractPictures(raw.pictures);

    const city = (pm.get("48") ?? pm.get("47") ?? "").trim();
    const district = (pm.get("300") ?? "").trim();
    const locationLabel = [district, city].filter(Boolean).join(", ") || city || "";

    const category = (pm.get("36") ?? "").trim() || "Nieruchomość";
    const titleShort = (pm.get("491") ?? "").trim();
    const title = titleShort || [category, city].filter(Boolean).join(" · ") || `Oferta ${signature}`;

    const pricePln = (() => {
      const r = (pm.get("10") ?? "").trim().replace(/\s/g, "").replace(",", ".");
      const n = Number.parseFloat(r);
      return Number.isFinite(n) && n > 0 ? n : null;
    })();
    const priceLabel = pricePln
      ? new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0, useGrouping: true }).format(pricePln) + " zł"
      : "Cena do uzgodnienia";

    const areaM2 = (() => {
      for (const id of ["128", "58", "61"]) {
        const r = (pm.get(id) ?? "").trim().replace(/\s/g, "").replace(",", ".");
        const n = Number.parseFloat(r);
        if (Number.isFinite(n) && n > 0) return n;
      }
      return null;
    })();
    const areaLabel = areaM2
      ? `${areaM2.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} m²`
      : "";

    const slug = signature.replace(/\//g, "-");
    const photoUrls = pictures
      .slice(0, MAX_PHOTOS)
      .map((p) => `${SITE_URL}/zdjecia/${encodeURIComponent(p.name)}`);

    return {
      signature,
      title,
      locationLabel,
      priceLabel,
      areaLabel,
      offerUrl: `${SITE_URL}/oferty/${slug}/`,
      photoUrls,
      listedAtMs: parseListedAtMs(pm),
    };
  });
}

// ---------------------------------------------------------------------------
// Stan publikacji
// ---------------------------------------------------------------------------

function readState() {
  if (!fs.existsSync(STATE_FILE)) return { entries: [] };
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { entries: [] };
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n", "utf8");
}

// ---------------------------------------------------------------------------
// Budowanie podpisu (caption) posta
// ---------------------------------------------------------------------------

function buildCaption(offer) {
  const lines = [offer.title];
  if (offer.locationLabel) lines.push(`📍 ${offer.locationLabel}`);
  if (offer.priceLabel) lines.push(`💰 ${offer.priceLabel}`);
  if (offer.areaLabel) lines.push(`📐 ${offer.areaLabel}`);
  lines.push("");
  lines.push("Napisz komentarz lub wyślij wiadomość — chętnie odpowiemy na pytania.");
  lines.push("");
  lines.push(`🔗 ${offer.offerUrl}`);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Główna logika
// ---------------------------------------------------------------------------

async function main() {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.error("[fb-pick] Brak MAKE_WEBHOOK_URL — ustaw sekret w GitHub Actions.");
    process.exit(1);
  }

  const dataDir = resolveDataDir();
  if (!dataDir) {
    console.error("[fb-pick] Brak katalogu Asari — ustaw ASARI_DATA_DIR lub dodaj folder asari-export/.");
    process.exit(1);
  }

  console.log(`[fb-pick] Wczytuję oferty z: ${dataDir}`);
  const offers = loadOffers(dataDir);
  if (offers.length === 0) {
    console.error("[fb-pick] Brak ofert w eksporcie Asari.");
    process.exit(1);
  }
  console.log(`[fb-pick] Załadowano ${offers.length} ofert.`);

  // Wyklucz już obsłużone sygnatury
  const state = readState();
  const handled = new Set(
    state.entries
      .filter((e) => ["published", "skipped", "draft_sent"].includes(e.status))
      .map((e) => e.signature),
  );

  // FIFO po dacie dodania (null → na końcu kolejki)
  const candidates = offers
    .filter((o) => !handled.has(o.signature))
    .sort((a, b) => {
      if (a.listedAtMs == null && b.listedAtMs == null) return 0;
      if (a.listedAtMs == null) return 1;
      if (b.listedAtMs == null) return -1;
      return a.listedAtMs - b.listedAtMs;
    });

  if (candidates.length === 0) {
    console.log("[fb-pick] Brak kandydatów — wszystkie oferty już obsłużone.");
    process.exit(0);
  }

  const offer = candidates[0];
  console.log(`[fb-pick] Wybrano: ${offer.signature} — ${offer.title}`);

  if (offer.photoUrls.length === 0) {
    console.warn(`[fb-pick] Oferta ${offer.signature} nie ma zdjęć — pomijam.`);
    process.exit(0);
  }

  const payload = {
    signature: offer.signature,
    title: offer.title,
    locationLabel: offer.locationLabel,
    priceLabel: offer.priceLabel,
    areaLabel: offer.areaLabel,
    offerUrl: offer.offerUrl,
    photos: offer.photoUrls,
    caption: buildCaption(offer),
  };

  // Zapisz stan PRZED POST — zapobiega powtórnemu wysyłaniu przy retry workflow
  state.entries.push({
    signature: offer.signature,
    status: "draft_sent",
    addedAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
  });
  writeState(state);
  console.log(`[fb-pick] Zapisano draft_sent dla ${offer.signature}.`);

  // Wyślij do Make
  console.log("[fb-pick] Wysyłam payload do Make...");
  let res;
  try {
    res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[fb-pick] Błąd sieciowy przy POST do Make:", err.message);
    process.exit(1);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[fb-pick] Make zwrócił błąd: ${res.status} ${res.statusText}${body ? " — " + body : ""}`);
    process.exit(1);
  }

  console.log(`[fb-pick] Sukces (HTTP ${res.status}).`);
  console.log(`[fb-pick] Signature: ${offer.signature} | Zdjęć: ${offer.photoUrls.length} | ${offer.offerUrl}`);
}

main().catch((e) => {
  console.error("[fb-pick]", e);
  process.exit(1);
});
