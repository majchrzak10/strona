import { existsSync } from "fs";
import path from "path";

/**
 * URL publiczny dla pliku w `public/zdjecia/`.
 * Przy buildzie preferuje `.webp`, jeśli istnieje (generowany w prebuild przez sharp).
 */
export function relativeUrlForZdjeciaFile(fileName: string): string {
  const safeName = path.basename(fileName.trim());
  if (!safeName) return "/globe.svg";

  const dir = path.join(process.cwd(), "public", "zdjecia");
  const parsed = path.parse(safeName);
  const base = parsed.name;

  const webpPath = path.join(dir, `${base}.webp`);
  if (existsSync(webpPath)) {
    return `/zdjecia/${encodeURIComponent(`${base}.webp`)}`;
  }

  const exactPath = path.join(dir, safeName);
  if (existsSync(exactPath)) {
    return `/zdjecia/${encodeURIComponent(safeName)}`;
  }

  return `/zdjecia/${encodeURIComponent(safeName)}`;
}
