/**
 * Po buildzie sprawdza, czy `out/` jest gotowe do wgrania na hosting.
 * Uruchamiane: `npm run verify-out` (albo z postbuild — opcjonalnie).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "out");

function fail(msg) {
  console.error(`[verify-out] BŁĄD: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(OUT)) {
  fail('Brak folderu out/ — najpierw uruchom npm run build');
}

const index = path.join(OUT, "index.html");
if (!fs.existsSync(index)) {
  fail("Brak out/index.html");
}

const html = fs.readFileSync(index, "utf8");
if (!html.includes('http-equiv="Cache-Control"')) {
  fail("out/index.html bez meta anty-cache — czy odpalił się postbuild (inject-cache-meta)?");
}

const ht = path.join(OUT, ".htaccess");
if (!fs.existsSync(ht)) {
  fail("Brak out/.htaccess — sprawdź, czy public/.htaccess istnieje i zrób build ponownie");
}

const nextDir = path.join(OUT, "_next");
if (!fs.existsSync(nextDir)) {
  fail("Brak out/_next/ — build Next.js nie zakończył się poprawnie");
}

console.log("[verify-out] OK — możesz wgrać całą zawartość folderu out/ na serwer (FTP / rsync).");
console.log(`[verify-out] Ścieżka: ${OUT}`);
