/**
 * Przed `npm run dev`: jeśli public/zdjecia jest puste lub nie istnieje,
 * uruchamia copy-photos (Asari → public/zdjecia + WebP).
 * Pełny build i tak robi to w prebuild; tutaj naprawiamy „goły” klon / brak kroku prebuild.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DEST = path.join(ROOT, "public", "zdjecia");

function imageCount() {
  if (!fs.existsSync(DEST)) return 0;
  return fs.readdirSync(DEST).filter((f) => /\.(webp|jpg|jpeg|png|gif)$/i.test(f)).length;
}

const n = imageCount();
if (n > 0) {
  console.log(`[ensure-zdjecia] public/zdjecia — ${n} plików, pomijam kopiowanie.`);
  console.log("[ensure-zdjecia] Po nowym eksporcie Asari uruchom: npm run copy-photos");
  process.exit(0);
}

const defaultFoto = path.join(ROOT, "asari-export", "foto");
let hasPhotoSource = false;
if (fs.existsSync(defaultFoto)) {
  hasPhotoSource = fs.readdirSync(defaultFoto).some((f) => /\.(jpe?g|png|webp)$/i.test(f));
}
if (!hasPhotoSource) {
  console.warn(
    "[ensure-zdjecia] public/zdjecia jest puste i nie ma plików w asari-export/foto — dodaj eksport Asari lub uruchom npm run copy-photos po skonfigurowaniu ASARI_PHOTOS_DIR.",
  );
  process.exit(0);
}

console.log("[ensure-zdjecia] Brak zdjęć w public/zdjecia — uruchamiam copy-photos…");
const r = spawnSync(process.execPath, [path.join(ROOT, "scripts", "copy-photos.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(r.status ?? 1);
