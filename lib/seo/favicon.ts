import faviconConfig from "./favicon.config.json";

/** Zwiększ po zmianie ikon — wymusza odświeżenie agresywnego cache faviconów w przeglądarkach. */
export const FAVICON_CACHE_VERSION = String(faviconConfig.cacheVersion);

export function faviconUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const sep = clean.includes("?") ? "&" : "?";
  return `${clean}${sep}v=${FAVICON_CACHE_VERSION}`;
}
