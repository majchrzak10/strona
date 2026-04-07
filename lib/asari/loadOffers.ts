import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { getAsariDataDir } from "./env";
import { rawOfferToDetail } from "./mapOffer";
import {
  packageDeletedSignatures,
  packageOffers,
  parsePackageXml,
} from "./parse";
import { normalizeRawOffer } from "./schemas";
import type { AsariOfferDetail } from "./types";

/** Parsuje znacznik czasu z nazwy pliku Asari: XXXXXX_YYYYMMDD_HHMMSS_001.xml → liczba YYYYMMDDHHMMSS */
function filenameTimestamp(name: string): number {
  const m = name.match(/_(\d{8})_(\d{6})_/);
  return m ? parseInt(m[1] + m[2], 10) : 0;
}

/** Parsuje timestamp pliku Asari jako Unix ms (do ustawienia listedAtMs gdy brak w XML). */
function filenameTimestampMs(name: string): number {
  const m = name.match(/_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_/);
  if (!m) return 0;
  return new Date(
    parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]),
    parseInt(m[4]), parseInt(m[5]), parseInt(m[6]),
  ).getTime();
}

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
  try {
    return await loadAsariOffersInner();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      offers: [],
      sourceFile: null,
      error: `Błąd wczytywania ofert: ${msg}`,
    };
  }
}

async function loadAsariOffersInner(): Promise<LoadAsariResult> {
  const dir = getAsariDataDir();
  if (!dir) {
    return {
      offers: [],
      sourceFile: null,
      error:
        "Brak ASARI_DATA_DIR. W pliku .env.local ustaw ścieżkę do folderu z eksportem Asari (definictions.xml + pliki *_001.xml), np. ASARI_DATA_DIR=asari-export — patrz folder asari-export/README.txt.",
    };
  }

  if (!existsSync(dir)) {
    return {
      offers: [],
      sourceFile: null,
      error: `Folder ASARI_DATA_DIR nie istnieje: ${dir}. Popraw ścieżkę w .env.local (lub usuń błędną zmienną ASARI_DATA_DIR z ustawień systemu Windows). Możesz użyć ścieżki względnej względem projektu, np. asari-export.`,
    };
  }

  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return {
      offers: [],
      sourceFile: null,
      error: `Nie można odczytać katalogu Asari: ${dir}. Sprawdź uprawnienia i czy to folder, nie plik.`,
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

  const withStat = candidates.map((n) => ({ n }));
  withStat.sort((a, b) => {
    const ta = filenameTimestamp(a.n);
    const tb = filenameTimestamp(b.n);
    if (ta !== tb) return ta - tb;
    return a.n.localeCompare(b.n);
  });

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
    for (const sig of packageDeletedSignatures(root)) {
      bySig.delete(sig);
    }

    const rawList = packageOffers(root);
    const fileMs = filenameTimestampMs(n);
    let count = 0;
    for (const raw of rawList) {
      const normalized = normalizeRawOffer(raw);
      if (!normalized) {
        parseErrors++;
        continue;
      }
      try {
        const d = rawOfferToDetail(normalized);
        if (d) {
          if (d.listedAtMs == null && fileMs > 0) d.listedAtMs = fileMs;
          bySig.set(d.signature, d);
          count++;
        }
      } catch {
        parseErrors++;
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
