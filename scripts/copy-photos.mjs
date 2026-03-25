/**
 * Prebuild — kopiuje zdjęcia Asari → public/zdjecia/, opcjonalnie WebP (sharp),
 * usuwa pliki nie występujące w aktualnym eksporcie XML (anti-bloat).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DEST = path.join(ROOT, "public", "zdjecia");

/** npm prebuild nie zawsze nadpisuje zmienne systemowe — ładujemy .env.local. */
function loadDotEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadDotEnvFile(path.join(ROOT, ".env"));
loadDotEnvFile(path.join(ROOT, ".env.local"));

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function stripQuotes(s) {
  const t = (s ?? "").trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

function resolveDir(raw) {
  const t = stripQuotes(raw);
  if (!t) return null;
  const n = path.normalize(t);
  if (path.isAbsolute(n)) return n;
  return path.normalize(path.join(ROOT, n));
}

function resolveSourceDir() {
  const photos = resolveDir(process.env.ASARI_PHOTOS_DIR);
  if (photos && fs.existsSync(photos)) return photos;
  const data = resolveDir(process.env.ASARI_DATA_DIR);
  if (data && fs.existsSync(data)) return data;
  const fotoDefault = path.join(ROOT, "asari-export", "foto");
  if (fs.existsSync(fotoDefault)) return fotoDefault;
  const exportDefault = path.join(ROOT, "asari-export");
  if (fs.existsSync(exportDefault)) return exportDefault;
  return photos || data;
}

/** Katalog z plikami *_001.xml (jak ASARI_DATA_DIR). */
function resolveDataDirForXml() {
  const d = resolveDir(process.env.ASARI_DATA_DIR);
  if (d && fs.existsSync(d)) return d;
  const def = path.join(ROOT, "asari-export");
  return fs.existsSync(def) ? def : null;
}

function collectUniqueFilenamesFromAsariXml(dataDir) {
  const set = new Set();
  if (!dataDir || !fs.existsSync(dataDir)) return set;
  let names;
  try {
    names = fs.readdirSync(dataDir);
  } catch {
    return set;
  }
  for (const name of names) {
    if (!/_001\.xml$/i.test(name) || /^definictions/i.test(name)) continue;
    const full = path.join(dataDir, name);
    let xml;
    try {
      xml = fs.readFileSync(full, "utf8");
    } catch {
      continue;
    }
    const re = /<unique>\s*([^<]+?)\s*<\/unique>/gi;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const f = m[1].trim();
      if (f && !f.includes("/") && !f.includes("\\")) set.add(f);
    }
  }
  return set;
}

/** Pliki do zachowania: dokładne nazwy z XML + typowe warianty .webp. */
function buildKeepSet(referenced) {
  const keep = new Set();
  for (const name of referenced) {
    keep.add(name);
    const ext = path.extname(name).toLowerCase();
    const base = path.basename(name, ext);
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      keep.add(`${base}.webp`);
      keep.add(`${base}.jpg`);
      keep.add(`${base}.jpeg`);
      keep.add(`${base}.png`);
    }
  }
  return keep;
}

async function main() {
  let sharpMod = null;
  try {
    const m = await import("sharp");
    sharpMod = m.default;
  } catch {
    console.warn("[copy-photos] sharp niedostępny — pomijam generowanie WebP.");
  }

  const sourceDir = resolveSourceDir();

  if (!sourceDir) {
    console.log("[copy-photos] Brak ASARI_PHOTOS_DIR / ASARI_DATA_DIR — pomijam kopiowanie zdjęć.");
    return;
  }

  if (!fs.existsSync(sourceDir)) {
    console.warn(`[copy-photos] Katalog źródłowy nie istnieje: ${sourceDir}`);
    return;
  }

  fs.mkdirSync(DEST, { recursive: true });

  const files = fs.readdirSync(sourceDir);
  let copied = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;
    const src = path.join(sourceDir, file);
    const dst = path.join(DEST, file);
    try {
      fs.copyFileSync(src, dst);
      copied++;
    } catch (err) {
      console.warn(`[copy-photos] Nie można skopiować: ${file} — ${err.message}`);
    }
  }

  let webpN = 0;
  if (sharpMod) {
    const inDest = fs.readdirSync(DEST);
    for (const file of inDest) {
      const ext = path.extname(file).toLowerCase();
      if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
      const srcPath = path.join(DEST, file);
      const webpPath = path.join(DEST, `${path.parse(file).name}.webp`);
      try {
        await sharpMod(srcPath).webp({ quality: 82, effort: 4 }).toFile(webpPath);
        webpN++;
      } catch (err) {
        console.warn(`[copy-photos] WebP ${file}: ${err.message}`);
      }
    }
  }

  const dataDir = resolveDataDirForXml();
  const referenced = collectUniqueFilenamesFromAsariXml(dataDir);

  if (referenced.size > 0) {
    const keep = buildKeepSet(referenced);
    let removed = 0;
    for (const f of fs.readdirSync(DEST)) {
      const ext = path.extname(f).toLowerCase();
      if (!IMAGE_EXTS.has(ext)) continue;
      if (!keep.has(f)) {
        try {
          fs.unlinkSync(path.join(DEST, f));
          removed++;
        } catch (err) {
          console.warn(`[copy-photos] Nie można usunąć ${f}: ${err.message}`);
        }
      }
    }
    if (removed > 0) {
      console.log(`[copy-photos] Usunięto ${removed} nieużywanych plików z public/zdjecia/ (wg XML).`);
    }
  } else {
    console.log("[copy-photos] Pomijam czyszczenie — brak wpisów <unique> w *_001.xml (lub brak katalogu XML).");
  }

  console.log(
    `[copy-photos] Skopiowano ${copied} plików z ${sourceDir} → public/zdjecia/` +
      (webpN > 0 ? `; WebP: ${webpN}` : ""),
  );
}

main().catch((e) => {
  console.error("[copy-photos]", e);
  process.exit(1);
});
