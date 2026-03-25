import path from "path";

/** Katalog z plikami eksportu Asari (definictions.xml, *_001.xml, *_CFG.xml). */
function stripEnvQuotes(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1).trim();
  }
  return t;
}

export function getAsariDataDir(): string | null {
  const raw = process.env.ASARI_DATA_DIR;
  if (raw == null) return null;
  const cleaned = stripEnvQuotes(raw);
  if (!cleaned) return null;
  return path.normalize(cleaned);
}

/**
 * Katalog ze zdjęciami z eksportu (pliki z atrybutem unique w XML).
 * Domyślnie ten sam co ASARI_DATA_DIR, jeśli XML i JPG są w jednym folderze.
 * Ustaw ASARI_PHOTOS_DIR, gdy zdjęcia są np. w podkatalogu "foto".
 */
export function getAsariPhotosDir(): string | null {
  const raw = process.env.ASARI_PHOTOS_DIR;
  if (raw != null) {
    const cleaned = stripEnvQuotes(raw);
    if (cleaned) return path.normalize(cleaned);
  }
  return getAsariDataDir();
}
