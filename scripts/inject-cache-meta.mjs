/**
 * Po `next build` (static export) Next.js nie zachowuje meta http-equiv z layoutu.
 * Wstrzykujemy je do każdego index.html w out/, żeby przeglądarki nie trzymały starego HTML.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "out");

const SNIPPET =
  '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>' +
  '<meta http-equiv="Pragma" content="no-cache"/>' +
  '<meta http-equiv="Expires" content="0"/>';

function walk(dir, acc = []) {
  let names;
  try {
    names = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of names) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name === "index.html") acc.push(p);
  }
  return acc;
}

function inject(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  if (html.includes('http-equiv="Cache-Control"')) return false;
  const headOpen = html.indexOf("<head>");
  if (headOpen === -1) return false;
  const insertAt = headOpen + "<head>".length;
  const next = html.slice(0, insertAt) + SNIPPET + html.slice(insertAt);
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

const files = walk(OUT);
let n = 0;
for (const f of files) {
  if (inject(f)) n++;
}
console.log(`[inject-cache-meta] Zaktualizowano ${n} plików index.html (łącznie ${files.length}).`);
