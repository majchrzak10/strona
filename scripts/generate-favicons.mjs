/**
 * Generuje zestaw ikon z jednego źródła (SVG/PNG) z bezpiecznym marginesem,
 * żeby uniknąć przycinania i artefaktów przy skalowaniu w pasku adresu.
 *
 * Wyjścia (Next.js App Router — file-based metadata):
 *   - app/icon.png          (32×32, PNG)
 *   - app/apple-icon.png    (180×180, PNG)
 *   - app/favicon.ico       (16×16 + 32×32)
 *   - app/icon.svg          (kopia źródła SVG, jeśli źródłem jest SVG)
 *
 * Dodatkowo (hosting statyczny / starsze klienty):
 *   - public/favicon.ico
 *
 * Źródło (pierwsze istniejące — preferowane wektorowe SVG):
 *   1. FAVICON_SOURCE — ścieżka względem katalogu projektu
 *   2. public/icon.svg
 *   3. public/brand/logo-source.svg
 *   4. public/brand/logo.png
 *
 * Uruchomienie: npm run generate-favicons
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const WHITE_BG = { r: 255, g: 255, b: 255, alpha: 1 };

/** Margines wewnętrzny (np. 0.1 = 10% z każdej strony) — ikona „w środku”, bez obcięcia krawędzi. */
const SAFE_PADDING_RATIO = 0.1;

function resolveSource() {
  const env = process.env.FAVICON_SOURCE;
  const candidates = [
    env && path.resolve(root, env),
    path.join(root, "public", "icon.svg"),
    path.join(root, "public", "brand", "logo-source.svg"),
    path.join(root, "public", "brand", "logo.png"),
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(
    "Brak pliku źródłowego. Dodaj public/brand/logo.png lub public/icon.svg, albo ustaw FAVICON_SOURCE.",
  );
}

/**
 * Raster kwadratowy: fit contain w (size−2pad)², potem białe tło do size×size.
 */
async function pngSquareWithPaddingBuffer(input, size) {
  const pad = Math.max(0, Math.round(size * SAFE_PADDING_RATIO));
  const inner = Math.max(1, size - 2 * pad);
  return sharp(input)
    .resize(inner, inner, {
      fit: "contain",
      position: "centre",
      background: WHITE_BG,
    })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: WHITE_BG,
    })
    .png()
    .toBuffer();
}

async function main() {
  const source = resolveSource();
  console.log(`[generate-favicons] Źródło: ${path.relative(root, source)}`);

  const appDir = path.join(root, "app");
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }

  const buf32 = await pngSquareWithPaddingBuffer(source, 32);
  const buf180 = await pngSquareWithPaddingBuffer(source, 180);

  fs.writeFileSync(path.join(appDir, "icon.png"), buf32);
  console.log("[generate-favicons] Zapisano app/icon.png (32×32)");

  fs.writeFileSync(path.join(appDir, "apple-icon.png"), buf180);
  console.log("[generate-favicons] Zapisano app/apple-icon.png (180×180)");

  const buf16 = await pngSquareWithPaddingBuffer(source, 16);
  const ico = await toIco([buf16, buf32]);
  fs.writeFileSync(path.join(appDir, "favicon.ico"), ico);
  console.log("[generate-favicons] Zapisano app/favicon.ico (16×16 + 32×32)");

  if (source.endsWith(".svg")) {
    fs.copyFileSync(source, path.join(appDir, "icon.svg"));
    console.log("[generate-favicons] Zapisano app/icon.svg (kopia SVG)");
  } else {
    console.log(
      "[generate-favicons] Pominięto app/icon.svg (źródło nie jest SVG — dodaj public/icon.svg jeśli chcesz SVG w <head>).",
    );
  }

  fs.writeFileSync(path.join(root, "public", "favicon.ico"), ico);
  console.log("[generate-favicons] Zapisano public/favicon.ico (legacy / hosting statyczny)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
