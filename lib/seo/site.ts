/** Kanoniczny adres produkcyjny — używany w sitemap, robots i metadanych. */
export const SITE_URL = "https://dan-dom.pl" as const;

/**
 * Absolutny URL z końcowym slashem — zgodnie z `trailingSlash: true` w next.config.
 * @param route fragment ścieżki bez domeny, np. `""`, `"oferty"`, `"oferty/128-6093-OGS"`
 */
export function canonicalUrl(route: string): string {
  const trimmed = route.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!trimmed) return `${SITE_URL}/`;
  return `${SITE_URL}/${trimmed}/`;
}
