/**
 * Generuje zestaw ikon do `public/` (bez plików w `app/` — unikamy podwójnych
 * `<link rel="icon">` z metadata API + file convention Next.js).
 *
 * Wyjścia:
 *   - public/icon.svg          (SVG — preferowany w karcie, ostry na każdym DPI)
 *   - public/favicon.ico       (16 + 32 + 48 px — ostrzejszy fallback niż sam 32)
 *   - public/apple-touch-icon.png (180×180)
 *   - public/icon-192.png, public/icon-512.png (PWA / manifest)
 *   - public/site.webmanifest  (generowany, z ?v= w URL ikon)
 *
 * Wersja cache (bump po zmianie grafiki): lib/seo/favicon.config.json → cacheVersion
 *
 * Zalecane źródło: wektor SVG 512×512 (viewBox), lub PNG min. 512×512 px,
 * logo wyśrodkowane z marginesem (skrypt dodaje ~10% padding).
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
const SAFE_PADDING_RATIO = 0.1;

function loadFaviconConfig() {
  const p = path.join(root, "lib", "seo", "favicon.config.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

function resolveSource() {
  const env = process.env.FAVICON_SOURCE;
  const candidates = [
    env && path.resolve(root, env),
    path.join(root, "public", "favicon-source.png"),
    path.join(root, "public", "icon.svg"),
    path.join(root, "public", "brand", "logo-source.svg"),
    path.join(root, "public", "brand", "logo.png"),
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(
    "Brak pliku źródłowego. Dodaj public/favicon-source.png, public/brand/logo.png lub public/icon.svg, albo ustaw FAVICON_SOURCE.",
  );
}

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

function writeWebManifest(cfg, cacheVersion) {
  const q = (src) => `${src}?v=${cacheVersion}`;
  const manifest = {
    name: cfg.manifestName,
    short_name: cfg.manifestShortName,
    icons: [
      {
        src: q("/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: q("/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: q("/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: q("/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: cfg.manifestThemeColor,
    background_color: cfg.manifestBackgroundColor,
    display: "standalone",
    start_url: "/",
  };
  const out = path.join(root, "public", "site.webmanifest");
  fs.writeFileSync(out, JSON.stringify(manifest, null, 2), "utf8");
  console.log("[generate-favicons] Zapisano public/site.webmanifest");
}

async function main() {
  const cfg = loadFaviconConfig();
  const cacheVersion = String(cfg.cacheVersion ?? "1");

  const source = resolveSource();
  console.log(`[generate-favicons] Źródło: ${path.relative(root, source)}`);

  const publicDir = path.join(root, "public");
  fs.mkdirSync(publicDir, { recursive: true });

  const buf16 = await pngSquareWithPaddingBuffer(source, 16);
  const buf32 = await pngSquareWithPaddingBuffer(source, 32);
  const buf48 = await pngSquareWithPaddingBuffer(source, 48);
  const buf180 = await pngSquareWithPaddingBuffer(source, 180);
  const buf192 = await pngSquareWithPaddingBuffer(source, 192);
  const buf512 = await pngSquareWithPaddingBuffer(source, 512);

  const ico = await toIco([buf16, buf32, buf48]);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);
  console.log("[generate-favicons] Zapisano public/favicon.ico (16 + 32 + 48)");

  fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), buf180);
  console.log("[generate-favicons] Zapisano public/apple-touch-icon.png (180×180)");

  fs.writeFileSync(path.join(publicDir, "icon-192.png"), buf192);
  console.log("[generate-favicons] Zapisano public/icon-192.png");

  fs.writeFileSync(path.join(publicDir, "icon-512.png"), buf512);
  console.log("[generate-favicons] Zapisano public/icon-512.png");

  if (source.endsWith(".svg")) {
    fs.copyFileSync(source, path.join(publicDir, "icon.svg"));
    console.log("[generate-favicons] Zapisano public/icon.svg (SVG)");
  } else {
    const svgPath = path.join(publicDir, "icon.svg");
    if (!fs.existsSync(svgPath)) {
      console.warn(
        "[generate-favicons] Brak public/icon.svg — dodaj plik SVG dla ostrego favicona w kartach (lub ustaw źródło na .svg).",
      );
    } else {
      console.log("[generate-favicons] Zachowano istniejący public/icon.svg");
    }
  }

  writeWebManifest(cfg, cacheVersion);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
