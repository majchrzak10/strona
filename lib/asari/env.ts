import { existsSync, readFileSync } from "fs";
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

function resolveDataPath(raw: string): string {
  const cleaned = stripEnvQuotes(raw);
  if (!cleaned) return "";
  const n = path.normalize(cleaned);
  if (path.isAbsolute(n)) return n;
  return path.normalize(path.join(process.cwd(), n));
}

/** Jak copy-photos / dotenv: .env potem .env.local (lokalne wygrywa). */
function readMergedDotEnvAsari(): {
  ASARI_DATA_DIR?: string;
  ASARI_PHOTOS_DIR?: string;
} {
  const merged: Record<string, string> = {};
  for (const name of [".env", ".env.local"] as const) {
    const p = path.join(process.cwd(), name);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, "utf8");
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq <= 0) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      merged[key] = val;
    }
  }
  return {
    ASARI_DATA_DIR: merged.ASARI_DATA_DIR,
    ASARI_PHOTOS_DIR: merged.ASARI_PHOTOS_DIR,
  };
}

let dotenvAsariCache: ReturnType<typeof readMergedDotEnvAsari> | undefined;

function getDotenvAsari(): ReturnType<typeof readMergedDotEnvAsari> {
  if (dotenvAsariCache === undefined) {
    dotenvAsariCache = readMergedDotEnvAsari();
  }
  return dotenvAsariCache;
}

type AsariDirs = { data: string | null; photos: string | null };

let resolvedDirs: AsariDirs | undefined;

function pickFirstExistingDir(candidates: (string | undefined)[]): string | null {
  for (const raw of candidates) {
    if (raw == null) continue;
    const cleaned = stripEnvQuotes(raw);
    if (!cleaned) continue;
    const resolved = resolveDataPath(raw);
    if (resolved && existsSync(resolved)) return resolved;
  }
  return null;
}

function computeAsariDirs(): AsariDirs {
  const dot = getDotenvAsari();
  const data = pickFirstExistingDir([
    process.env.ASARI_DATA_DIR,
    dot.ASARI_DATA_DIR,
  ]);
  const dataFinal =
    data ?? (() => {
      const def = path.join(process.cwd(), "asari-export");
      return existsSync(def) ? def : null;
    })();

  const photos = pickFirstExistingDir([
    process.env.ASARI_PHOTOS_DIR,
    dot.ASARI_PHOTOS_DIR,
  ]);

  let photosFinal: string | null = photos;
  if (!photosFinal && dataFinal) {
    const foto = path.join(dataFinal, "foto");
    photosFinal = existsSync(foto) ? foto : dataFinal;
  }

  return { data: dataFinal, photos: photosFinal };
}

function getResolvedDirs(): AsariDirs {
  if (resolvedDirs === undefined) {
    resolvedDirs = computeAsariDirs();
  }
  return resolvedDirs;
}

export function getAsariDataDir(): string | null {
  return getResolvedDirs().data;
}

/**
 * Katalog ze zdjęciami z eksportu (pliki z atrybutem unique w XML).
 * Domyślnie ten sam co ASARI_DATA_DIR, jeśli XML i JPG są w jednym folderze.
 * Ustaw ASARI_PHOTOS_DIR, gdy zdjęcia są np. w podkatalogu "foto".
 */
export function getAsariPhotosDir(): string | null {
  return getResolvedDirs().photos;
}
