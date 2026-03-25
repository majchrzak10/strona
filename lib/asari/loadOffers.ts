import fs from "fs/promises";
import path from "path";
import { getAsariDataDir } from "./env";
import type { AsariOfferDetail } from "./types";
import { packageOffers, parsePackageXml } from "./parse";
import { rawOfferToDetail } from "./mapOffer";

/** Pliki paczek ofert Asari: końcówka _001.xml, bez definicji i bez CFG. */
function isOfferPackageFile(name: string): boolean {
  if (!/_001\.xml$/i.test(name)) return false;
  if (/^definictions\.xml$/i.test(name)) return false;
  if (/_CFG\.xml$/i.test(name)) return false;
  return true;
}

export type LoadAsariResult = {
  offers: AsariOfferDetail[];
  /** Nazwy plików XML, z których zbudowano listę (po przecinku w UI). */
  sourceFile: string | null;
  error: string | null;
};

export async function loadAsariOffers(): Promise<LoadAsariResult> {
  const dir = getAsariDataDir();
  if (!dir) {
    return {
      offers: [],
      sourceFile: null,
      error:
        "Brak ASARI_DATA_DIR. Ustaw w .env.local pełną ścieżkę do folderu z eksportem (XML + zdjęcia).",
    };
  }

  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return {
      offers: [],
      sourceFile: null,
      error: `Nie można odczytać katalogu Asari: ${dir}`,
    };
  }

  const candidates = names.filter(isOfferPackageFile);
  if (candidates.length === 0) {
    return {
      offers: [],
      sourceFile: null,
      error: `Brak pliku *_001.xml w ${dir} (potrzebny plik paczki ofert obok definictions.xml).`,
    };
  }

  const withStat = await Promise.all(
    candidates.map(async (n) => {
      const p = path.join(dir, n);
      const st = await fs.stat(p);
      return { n, mtime: st.mtimeMs };
    }),
  );
  withStat.sort((a, b) => a.mtime - b.mtime);

  const bySig = new Map<string, AsariOfferDetail>();
  const usedFiles: string[] = [];
  let parseErrors = 0;

  for (const { n } of withStat) {
    const full = path.join(dir, n);
    let xml: string;
    try {
      xml = await fs.readFile(full, "utf8");
    } catch {
      parseErrors++;
      continue;
    }
    let root: unknown;
    try {
      root = parsePackageXml(xml);
    } catch {
      parseErrors++;
      continue;
    }
    const rawList = packageOffers(root);
    let count = 0;
    for (const raw of rawList) {
      const d = rawOfferToDetail(raw);
      if (d) {
        bySig.set(d.signature, d);
        count++;
      }
    }
    if (count > 0) usedFiles.push(n);
  }

  const offers = [...bySig.values()];

  if (offers.length === 0) {
    return {
      offers: [],
      sourceFile: null,
      error:
        parseErrors > 0
          ? `Znaleziono ${candidates.length} plik(ów) *_001.xml, ale nie udało się wczytać ofert (błąd odczytu lub XML).`
          : `W plikach *_001.xml w ${dir} nie ma poprawnych ofert.`,
    };
  }

  return {
    offers,
    sourceFile: usedFiles.length ? usedFiles.join(", ") : null,
    error: null,
  };
}
