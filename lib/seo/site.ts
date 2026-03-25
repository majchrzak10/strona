/**
 * Kanoniczny adres witryny — sitemap, robots, Open Graph, JSON-LD.
 *
 * Domyślnie produkcja: `https://dan-dom.pl`.
 * Testy na innej domenie (np. bioredlab.pl): przed buildem ustaw
 * `NEXT_PUBLIC_SITE_URL=https://bioredlab.pl` w `.env.local` lub w CI (GitHub Variables).
 */
function normalizeSiteUrl(raw: string | undefined): string {
  const fallback = "https://dan-dom.pl";
  if (raw == null) return fallback;
  const t = String(raw).trim().replace(/\/+$/, "");
  if (!t) return fallback;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/**
 * Absolutny URL z końcowym slashem — zgodnie z `trailingSlash: true` w next.config.
 * @param route fragment ścieżki bez domeny, np. `""`, `"oferty"`, `"oferty/128-6093-OGS"`
 */
export function canonicalUrl(route: string): string {
  const trimmed = route.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!trimmed) return `${SITE_URL}/`;
  return `${SITE_URL}/${trimmed}/`;
}
