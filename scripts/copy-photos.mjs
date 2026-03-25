/**
 * Prebuild script — kopiuje zdjęcia z ASARI_PHOTOS_DIR do public/zdjecia/
 * Uruchamiany automatycznie przed `next build` (patrz "prebuild" w package.json).
 *
 * Jeśli ASARI_PHOTOS_DIR lub ASARI_DATA_DIR nie jest ustawiony, skrypt
 * kończy działanie bez błędu (build nadal się powiedzie, ale zdjęcia będą puste).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DEST = path.join(ROOT, "public", "zdjecia");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function stripQuotes(s) {
  const t = (s ?? "").trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

function resolveSourceDir() {
  const photos = stripQuotes(process.env.ASARI_PHOTOS_DIR);
  if (photos) return path.normalize(photos);
  const data = stripQuotes(process.env.ASARI_DATA_DIR);
  if (data) return path.normalize(data);
  return null;
}

const sourceDir = resolveSourceDir();

if (!sourceDir) {
  console.log("[copy-photos] Brak ASARI_PHOTOS_DIR / ASARI_DATA_DIR — pomijam kopiowanie zdjęć.");
  process.exit(0);
}

if (!fs.existsSync(sourceDir)) {
  console.warn(`[copy-photos] Katalog źródłowy nie istnieje: ${sourceDir}`);
  process.exit(0);
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

console.log(`[copy-photos] Skopiowano ${copied} zdjęć z ${sourceDir} → public/zdjecia/`);
