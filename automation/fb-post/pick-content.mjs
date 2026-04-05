/**
 * FB Post — wybierz treść posta i wyślij payload do Make.com.
 *
 * Typy postów:
 *   - offer    — oferta z Asari (AI caption)
 *   - holiday  — życzenia świąteczne (AI caption)
 *   - general  — porada / post o biurze (AI caption)
 *
 * Wymagane zmienne środowiskowe:
 *   MAKE_WEBHOOK_URL     — URL webhooka Make.com
 *   ANTHROPIC_API_KEY    — klucz Claude API (opcjonalny — fallback na statyczny tekst)
 *
 * Opcjonalne:
 *   ASARI_DATA_DIR       — ścieżka do folderu XML (domyślnie: asari-export/)
 *   SITE_URL             — domena (domyślnie: https://dan-dom.pl)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const STATE_FILE = path.join(__dirname, "state.json");

const SITE_URL = (process.env.SITE_URL ?? "https://dan-dom.pl").replace(/\/$/, "");
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY?.trim() ?? "";
const MAX_PHOTOS = 5;

// ---------------------------------------------------------------------------
// Claude API — generowanie tekstu
// ---------------------------------------------------------------------------

async function generateWithClaude(prompt) {
  if (!ANTHROPIC_API_KEY) {
    console.warn("[fb-content] Brak ANTHROPIC_API_KEY — używam szablonu statycznego.");
    return null;
  }

  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 250,
        system: "Jesteś copywriterem piszącym posty na Facebook dla biura nieruchomości. BEZWZGLĘDNE ZASADY: 1) Tylko zwykły tekst — zero gwiazdek, zero markdown, zero hashtagów, zero list, zero cudzysłowów. 2) NIGDY nie wspominaj o biurze, jego historii, latach działalności, doświadczeniu, założeniu. 3) Pisz tylko o konkretnej ofercie. 4) Maksymalnie 4 zdania.",
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (err) {
    console.warn("[fb-content] Claude API błąd sieciowy:", err.message);
    return null;
  }

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.warn(`[fb-content] Claude API błąd: ${res.status} — ${err}`);
    return null;
  }

  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? null;
}

// ---------------------------------------------------------------------------
// Polskie święta (stałe + Wielkanoc)
// ---------------------------------------------------------------------------

function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getHolidays(year) {
  const easter = getEasterDate(year);
  return [
    { date: new Date(year, 0, 1),   name: "Nowy Rok",         emoji: "🎊" },
    { date: new Date(easter),       name: "Wielkanoc",        emoji: "🐣" },
    { date: new Date(year, 11, 25), name: "Boże Narodzenie",  emoji: "⭐" },
  ];
}

function getUpcomingHoliday(daysAhead = 3) {
  const now = new Date();
  const year = now.getFullYear();
  const allHolidays = [...getHolidays(year), ...getHolidays(year + 1)];

  for (const h of allHolidays) {
    // Normalizuj do północy
    const hDay = new Date(h.date.getFullYear(), h.date.getMonth(), h.date.getDate());
    const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.round((hDay.getTime() - nowDay.getTime()) / 86400000);
    if (diff >= 0 && diff <= daysAhead) return { ...h, daysUntil: diff };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Generowanie treści AI
// ---------------------------------------------------------------------------

async function generateOfferCaption(offer) {
  const city = (offer.locationLabel || "").toLowerCase();
  const phone = city.includes("rogoźno") || city.includes("rogozno") ? "506 541 111" : "501 769 166";

  // AI generuje TYLKO 2 zdania zachęty — nic więcej
  const prompt = `Napisz 2 zdania zachęty na Facebook o tej nieruchomości: ${offer.title}, ${offer.locationLabel || "okolice Wągrowca"}. Używaj prostej formy lokalizacji np. "w Runowie", "w Wągrowcu" — nigdy "w sercu", "w samym centrum". Tylko zwykły tekst, bez gwiazdek, bez hashtagów. Dokładnie 2 zdania.`;

  let intro = await generateWithClaude(prompt);

  // Oczyść z markdown i wzmianek o biurze
  if (intro) {
    intro = intro
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#+\s/g, "")
      .replace(/[^\S\r\n]{2,}/g, " ")
      .trim();
    // usuń zdania wspominające o biurze/historii
    const bad = /dan.?dom|1996|biuro|lat doświadcz|wieloletni|od roku/i;
    if (bad.test(intro)) intro = null;
  }

  // Buduj caption statycznie — gwarantowany format
  const parts = [];
  if (intro) parts.push(intro);
  parts.push("");
  if (offer.locationLabel) parts.push(`📍 ${offer.locationLabel}`);
  if (offer.areaLabel)     parts.push(`📐 ${offer.areaLabel}`);
  if (offer.priceLabel)    parts.push(`💰 ${offer.priceLabel}`);
  parts.push("");
  parts.push(`Zadzwoń ${phone} lub umów się na prezentację.`);
  parts.push("");
  parts.push(`🔗 ${offer.offerUrl}`);

  return parts.join("\n");
}

async function generateHolidayCaption(holiday) {
  const prompt = `Jesteś copywriterem biura nieruchomości Dan-Dom z Wągrowca (działa od 1996 roku).
Napisz serdeczne życzenia z okazji "${holiday.name}" ${holiday.emoji} na Facebook.
Post ma być po polsku, ciepły i osobisty, maksymalnie 80 słów. Podpisz jako "Zespół Dan-Dom".
NIE używaj hashtagów.

Napisz tylko treść posta, bez żadnych komentarzy od siebie.`;

  const aiText = await generateWithClaude(prompt);
  return aiText ?? `${holiday.emoji} Z okazji ${holiday.name} składamy serdeczne życzenia wszystkim naszym Klientom i Partnerom!\n\nŻyczymy wszystkiego najlepszego!\nZespół Dan-Dom 🏠`;
}

async function generateGeneralCaption() {
  const topics = [
    "Dlaczego warto skorzystać z biura nieruchomości przy sprzedaży?",
    "Na co zwrócić uwagę kupując pierwsze mieszkanie?",
    "Jak dobrze wycenić nieruchomość przed sprzedażą?",
    "Rynek nieruchomości w okolicach Wągrowca — co się dzieje?",
    "5 błędów, których unikać sprzedając dom lub mieszkanie",
    "Wynajem czy zakup? Co się bardziej opłaca?",
    "Jak szybko sprzedać nieruchomość — praktyczne wskazówki",
    "Co warto sprawdzić przed podpisaniem umowy kupna?",
  ];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `Jesteś ekspertem Dan-Dom — biura nieruchomości z Wągrowca działającego od 1996 roku.
Napisz wartościowy, krótki post na Facebook na temat: "${topic}"
Post ma być po polsku, ekspercki ale przystępny, maksymalnie 150 słów.
NIE używaj hashtagów. Zakończ zachętą do kontaktu z Dan-Dom lub odwiedzenia strony.

Napisz tylko treść posta, bez żadnych komentarzy od siebie.`;

  const aiText = await generateWithClaude(prompt);
  return aiText ?? `Masz pytania dotyczące nieruchomości? Jesteśmy do Twojej dyspozycji — Dan-Dom działa w Wągrowcu od 1996 roku! 🏠\n\n👉 ${SITE_URL}`;
}

// ---------------------------------------------------------------------------
// Statyczny fallback dla ofert
// ---------------------------------------------------------------------------

function buildStaticOfferCaption(offer) {
  const lines = [offer.title];
  if (offer.locationLabel) lines.push(`📍 ${offer.locationLabel}`);
  if (offer.priceLabel)    lines.push(`💰 ${offer.priceLabel}`);
  if (offer.areaLabel)     lines.push(`📐 ${offer.areaLabel}`);
  lines.push("");
  lines.push("Napisz komentarz lub wyślij wiadomość — chętnie odpowiemy na pytania.");
  lines.push("");
  lines.push(`🔗 ${offer.offerUrl}`);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Parsowanie XML Asari (wzorzec z pick-offer.mjs)
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
  return collectNodes(sigRaw).map((s) => String(s).trim()).filter(Boolean);
}

function extractPictures(pictures) {
  return collectNodes(pictures?.picture)
    .map((p) => ({ name: String(p?.unique ?? "").trim(), weight: Number(p?.weight ?? 999) }))
    .filter((p) => p.name)
    .sort((a, b) => a.weight - b.weight);
}

function isOfferPackageFile(name) {
  return /_001\.xml$/i.test(name) && !/^definictions\.xml$/i.test(name) && !/_CFG\.xml$/i.test(name);
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

function loadOffers(dataDir) {
  const names = fs.readdirSync(dataDir).filter(isOfferPackageFile);
  if (names.length === 0) return [];

  const withStat = names
    .map((n) => ({ n, mtime: fs.statSync(path.join(dataDir, n)).mtimeMs }))
    .sort((a, b) => a.mtime - b.mtime);

  const bySig = new Map();

  for (const { n } of withStat) {
    let xml;
    try { xml = fs.readFileSync(path.join(dataDir, n), "utf8"); } catch { continue; }
    let root;
    try { root = parser.parse(xml); } catch { continue; }
    for (const sig of packageDeletedSignatures(root)) bySig.delete(sig);
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
    const photoUrls = pictures.slice(0, MAX_PHOTOS)
      .map((p) => `${SITE_URL}/zdjecia/${encodeURIComponent(p.name)}`);
    return { signature, title, locationLabel, priceLabel, areaLabel,
      offerUrl: `${SITE_URL}/oferty/${slug}/`, photoUrls, listedAtMs: parseListedAtMs(pm) };
  });
}

// ---------------------------------------------------------------------------
// Stan publikacji
// ---------------------------------------------------------------------------

function readState() {
  if (!fs.existsSync(STATE_FILE)) return { entries: [] };
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); } catch { return { entries: [] }; }
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n", "utf8");
}

// ---------------------------------------------------------------------------
// Główna logika
// ---------------------------------------------------------------------------

async function main() {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.error("[fb-content] Brak MAKE_WEBHOOK_URL — ustaw sekret w GitHub Actions.");
    process.exit(1);
  }

  const state = readState();
  const handled = new Set(
    state.entries
      .filter((e) => ["published", "skipped", "draft_sent"].includes(e.status))
      .map((e) => e.signature),
  );

  // --- Wybór typu posta ---
  const upcomingHoliday = getUpcomingHoliday(3);

  let postType;
  if (upcomingHoliday) {
    // Jeśli już wysłaliśmy życzenia dla tego święta — pomiń
    const holidayKey = `holiday_${upcomingHoliday.name}_${upcomingHoliday.date.getFullYear()}`;
    if (handled.has(holidayKey)) {
      console.log(`[fb-content] Życzenia dla "${upcomingHoliday.name}" już wysłane — wybieram ofertę.`);
      postType = "offer";
    } else {
      postType = "holiday";
    }
  } else {
    // 80% oferta, 20% porada ogólna
    postType = Math.random() < 0.8 ? "offer" : "general";
  }

  console.log(`[fb-content] Typ posta: ${postType}`);

  // --- Holiday post ---
  if (postType === "holiday") {
    const holiday = upcomingHoliday;
    const holidayKey = `holiday_${holiday.name}_${holiday.date.getFullYear()}`;
    console.log(`[fb-content] Generuję życzenia: ${holiday.name} ${holiday.emoji}`);

    const caption = await generateHolidayCaption(holiday);
    const payload = {
      postType: "holiday",
      signature: holidayKey,
      caption,
      photos: [],
      holidayName: holiday.name,
      holidayEmoji: holiday.emoji,
    };

    state.entries.push({ signature: holidayKey, status: "draft_sent",
      addedAt: new Date().toISOString(), sentAt: new Date().toISOString() });
    writeState(state);

    await sendToMake(webhookUrl, payload);
    return;
  }

  // --- General post ---
  if (postType === "general") {
    console.log(`[fb-content] Generuję post ogólny o biurze...`);
    const caption = await generateGeneralCaption();
    const generalKey = `general_${new Date().toISOString().slice(0, 10)}`;
    const payload = { postType: "general", signature: generalKey, caption, photos: [] };

    state.entries.push({ signature: generalKey, status: "draft_sent",
      addedAt: new Date().toISOString(), sentAt: new Date().toISOString() });
    writeState(state);

    await sendToMake(webhookUrl, payload);
    return;
  }

  // --- Offer post ---
  const dataDir = resolveDataDir();
  if (!dataDir) {
    console.error("[fb-content] Brak katalogu Asari — ustaw ASARI_DATA_DIR.");
    process.exit(1);
  }

  const offers = loadOffers(dataDir);
  if (offers.length === 0) {
    console.error("[fb-content] Brak ofert w eksporcie Asari.");
    process.exit(1);
  }
  console.log(`[fb-content] Załadowano ${offers.length} ofert.`);

  const candidates = offers
    .filter((o) => !handled.has(o.signature) && o.photoUrls.length > 0)
    .sort((a, b) => {
      if (a.listedAtMs == null && b.listedAtMs == null) return 0;
      if (a.listedAtMs == null) return 1;
      if (b.listedAtMs == null) return -1;
      return a.listedAtMs - b.listedAtMs;
    });

  if (candidates.length === 0) {
    console.log("[fb-content] Brak nowych ofert — generuję post ogólny zamiast tego.");
    const caption = await generateGeneralCaption();
    const generalKey = `general_${new Date().toISOString().slice(0, 10)}_fallback`;
    const payload = { postType: "general", signature: generalKey, caption, photos: [] };
    state.entries.push({ signature: generalKey, status: "draft_sent",
      addedAt: new Date().toISOString(), sentAt: new Date().toISOString() });
    writeState(state);
    await sendToMake(webhookUrl, payload);
    return;
  }

  const offer = candidates[0];
  console.log(`[fb-content] Wybrano ofertę: ${offer.signature} — ${offer.title}`);
  console.log(`[fb-content] Generuję AI caption...`);

  const caption = await generateOfferCaption(offer);

  const payload = {
    postType: "offer",
    signature: offer.signature,
    title: offer.title,
    locationLabel: offer.locationLabel,
    priceLabel: offer.priceLabel,
    areaLabel: offer.areaLabel,
    offerUrl: offer.offerUrl,
    photo1: offer.photoUrls[0] ?? "",
    photo2: offer.photoUrls[1] ?? "",
    photo3: offer.photoUrls[2] ?? "",
    photo4: offer.photoUrls[3] ?? "",
    photo5: offer.photoUrls[4] ?? "",
    caption,
  };

  state.entries.push({ signature: offer.signature, status: "draft_sent",
    addedAt: new Date().toISOString(), sentAt: new Date().toISOString() });
  writeState(state);

  await sendToMake(webhookUrl, payload);
}

async function sendToMake(webhookUrl, payload) {
  console.log("[fb-content] Wysyłam do Make.com...");
  let res;
  try {
    res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[fb-content] Błąd sieciowy:", err.message);
    process.exit(1);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[fb-content] Make błąd: ${res.status} ${res.statusText}${body ? " — " + body : ""}`);
    process.exit(1);
  }

  console.log(`[fb-content] ✅ Wysłano (HTTP ${res.status}) — typ: ${payload.postType}, signature: ${payload.signature}`);
}

main().catch((e) => { console.error("[fb-content]", e); process.exit(1); });
