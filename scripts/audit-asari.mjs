/**
 * Audyt eksportu Asari: pokrycie parametrów w ofertach vs definictions.xml.
 * Wynik: asari-audit-report.json + asari-audit-report.md w katalogu projektu.
 * Uruchamiane w postbuild (npm run build).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
  processEntities: { maxTotalExpansions: 500_000 },
});

function loadDotEnv() {
  for (const name of [".env", ".env.local"]) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, "utf8");
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
      process.env[key] = val;
    }
  }
}

function resolveDataDir() {
  const raw = process.env.ASARI_DATA_DIR?.trim();
  if (raw) {
    const n = path.normalize(raw.replace(/^["']|["']$/g, ""));
    const abs = path.isAbsolute(n) ? n : path.join(ROOT, n);
    if (fs.existsSync(abs)) return abs;
  }
  const def = path.join(ROOT, "asari-export");
  if (fs.existsSync(def)) return def;
  return null;
}

function isOfferPackageFile(name) {
  if (!/_001\.xml$/i.test(name)) return false;
  if (/^definictions\.xml$/i.test(name)) return false;
  if (/_CFG\.xml$/i.test(name)) return false;
  return true;
}

function collectP(nodes) {
  if (nodes == null) return [];
  if (Array.isArray(nodes)) return nodes;
  return [nodes];
}

function paramText(p) {
  const text = p["#text"];
  if (typeof text === "string") return text;
  if (typeof text === "number" && Number.isFinite(text)) return String(text);
  if (typeof text === "boolean") return text ? "true" : "false";
  for (const k of Object.keys(p)) {
    if (k.startsWith("@_")) continue;
    const v = p[k];
    if (typeof v === "string") return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
    if (typeof v === "boolean") return v ? "true" : "false";
  }
 return "";
}

function parametersToMap(parameters) {
  const map = new Map();
  const raw = parameters?.p;
  for (const p of collectP(raw)) {
    const id = p["@_id"];
    if (id != null) map.set(String(id), paramText(p));
  }
  return map;
}

function parsePackageXml(xml) {
  return parser.parse(xml);
}

function packageOffers(root) {
  const pkg = root?.PACKAGE;
  const o = pkg?.offer;
  if (o == null) return [];
  return Array.isArray(o) ? o : [o];
}

function packageDeletedSignatures(root) {
  const offers = root?.PACKAGE?.DELETE?.offers;
  if (offers == null || typeof offers !== "object") return [];
  const sigRaw = offers.signature;
  if (sigRaw == null) return [];
  const list = Array.isArray(sigRaw) ? sigRaw : [sigRaw];
  const out = [];
  for (const item of list) {
    const s =
      typeof item === "string" || typeof item === "number"
        ? String(item)
        : paramText(item);
    const t = s.trim();
    if (t) out.push(t);
  }
  return out;
}

function textField(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "#text" in v) {
    return String(v["#text"] ?? "");
  }
  return String(v);
}

/** Pierwszy blok <definitions><parameters> z <p id=""><name></name><type></type></p> */
function parseParameterDefinitions(defXml) {
  const root = parser.parse(defXml);
  const defs = root.definitions ?? root;
  const paramsBlock = defs.parameters;
  const list = collectP(paramsBlock?.p);
  const byId = new Map();
  for (const p of list) {
    const id = p["@_id"];
    if (id == null) continue;
    const idStr = String(id);
    const nameRaw = p.name;
    const name =
      typeof nameRaw === "string"
        ? nameRaw.trim()
        : textField(nameRaw).trim();
    const typeRaw = p.type;
    const typ =
      typeof typeRaw === "string"
        ? typeRaw.trim()
        : textField(typeRaw).trim();
    if (name || typ) {
      byId.set(idStr, { name: name || null, type: typ || null });
    }
  }
  return byId;
}

function signatureFromOffer(raw) {
  const s = raw?.signature;
  if (s == null) return "";
  if (typeof s === "string" || typeof s === "number") return String(s).trim();
  return textField(s).trim();
}

function isNonEmpty(v) {
  return String(v ?? "").trim() !== "";
}

function main() {
  loadDotEnv();
  const dataDir = resolveDataDir();
  const outJson = path.join(ROOT, "asari-audit-report.json");
  const outMd = path.join(ROOT, "asari-audit-report.md");

  if (!dataDir) {
    const payload = {
      generatedAt: new Date().toISOString(),
      dataDir: null,
      error:
        "Brak katalogu Asari (ustaw ASARI_DATA_DIR lub dodaj folder asari-export).",
      offerCount: 0,
      parameters: [],
    };
    fs.writeFileSync(outJson, JSON.stringify(payload, null, 2), "utf8");
    fs.writeFileSync(
      outMd,
      `# Audyt Asari\n\n_Brak danych — nie znaleziono katalogu eksportu._\n`,
      "utf8",
    );
    console.warn("[audit-asari] Brak ASARI_DATA_DIR / asari-export — pusty raport.");
    return;
  }

  const defPath = path.join(dataDir, "definictions.xml");
  let defMap = new Map();
  if (fs.existsSync(defPath)) {
    try {
      defMap = parseParameterDefinitions(fs.readFileSync(defPath, "utf8"));
    } catch (e) {
      console.warn("[audit-asari] Nie udało się sparsować definictions.xml:", e.message);
    }
  } else {
    console.warn("[audit-asari] Brak pliku definictions.xml w", dataDir);
  }

  let names;
  try {
    names = fs.readdirSync(dataDir);
  } catch (e) {
    console.error("[audit-asari]", e.message);
    process.exit(1);
  }

  const candidates = names.filter(isOfferPackageFile);
  if (candidates.length === 0) {
    const payload = {
      generatedAt: new Date().toISOString(),
      dataDir: path.relative(ROOT, dataDir) || ".",
      error: "Brak plików *_001.xml",
      offerCount: 0,
      parameters: [],
    };
    fs.writeFileSync(outJson, JSON.stringify(payload, null, 2), "utf8");
    fs.writeFileSync(
      outMd,
      `# Audyt Asari\n\n_Brak plików paczek *_001.xml._\n`,
      "utf8",
    );
    console.warn("[audit-asari] Brak *_001.xml — pusty raport.");
    return;
  }

  const withStat = candidates.map((n) => ({
    n,
    mtime: fs.statSync(path.join(dataDir, n)).mtimeMs,
  }));
  withStat.sort((a, b) => a.mtime - b.mtime);

  const bySig = new Map();
  const usedFiles = [];

  for (const { n } of withStat) {
    const full = path.join(dataDir, n);
    let xml;
    try {
      xml = fs.readFileSync(full, "utf8");
    } catch {
      continue;
    }
    let root;
    try {
      root = parsePackageXml(xml);
    } catch {
      continue;
    }
    for (const sig of packageDeletedSignatures(root)) {
      bySig.delete(sig);
    }
    const rawList = packageOffers(root);
    let count = 0;
    for (const raw of rawList) {
      const sig = signatureFromOffer(raw);
      if (!sig) continue;
      bySig.set(sig, raw);
      count++;
    }
    if (count > 0) usedFiles.push(n);
  }

  const offers = [...bySig.values()];
  const offerCount = offers.length;

  const allIds = new Set(defMap.keys());
  for (const raw of offers) {
    const pm = parametersToMap(raw.parameters);
    for (const id of pm.keys()) allIds.add(id);
  }

  /** @type {Map<string, { nonEmpty: number, empty: number, values: Map<string, number> }>} */
  const agg = new Map();

  for (const id of allIds) {
    agg.set(id, { nonEmpty: 0, empty: 0, values: new Map() });
  }

  for (const raw of offers) {
    const pm = parametersToMap(raw.parameters);
    for (const id of allIds) {
      const a = agg.get(id);
      const val = pm.get(id);
      const nonempty = val != null && isNonEmpty(val);
      if (nonempty) {
        a.nonEmpty++;
        const t = val.trim();
        a.values.set(t, (a.values.get(t) ?? 0) + 1);
      } else {
        a.empty++;
      }
    }
  }

  const parameters = [];

  for (const id of allIds) {
    const a = agg.get(id);
    const def = defMap.get(id);
    const coverage =
      offerCount > 0 ? Math.round((a.nonEmpty / offerCount) * 10000) / 100 : 0;

    const topValues = [...a.values.entries()]
      .sort((x, y) => y[1] - x[1])
      .slice(0, 12)
      .map(([value, count]) => ({ value, count }));

    const distinctNonEmpty = a.values.size;

    parameters.push({
      id,
      name: def?.name ?? null,
      definitionType: def?.type ?? null,
      offersWithNonEmptyValue: a.nonEmpty,
      offersMissingOrEmpty: a.empty,
      coveragePercent: coverage,
      distinctNonEmptyValues: distinctNonEmpty,
      topValues,
    });
  }

  parameters.sort(
    (x, y) =>
      y.offersWithNonEmptyValue - x.offersWithNonEmptyValue ||
      String(x.id).localeCompare(String(y.id), "pl"),
  );

  const idsInOffers = new Set();
  for (const raw of offers) {
    const pm = parametersToMap(raw.parameters);
    for (const id of pm.keys()) idsInOffers.add(id);
  }
  const idsInDefs = new Set(defMap.keys());
  const inOffersNotInDefinitions = [...idsInOffers].filter((id) => !idsInDefs.has(id));
  const inDefinitionsNeverInOffers = [...idsInDefs].filter(
    (id) => !idsInOffers.has(id),
  );

  const dataDirRel = path.relative(ROOT, dataDir) || ".";

  const summary = {
    generatedAt: new Date().toISOString(),
    dataDir: dataDirRel,
    definitionFile: fs.existsSync(defPath) ? "definictions.xml" : null,
    definitionParameterCount: defMap.size,
    packageFilesUsed: usedFiles,
    offerCount,
    parameterStatsRows: parameters.length,
    idsSeenInOffersNotInFirstParameterBlock: inOffersNotInDefinitions.sort(),
    definitionIdsNeverPresentInAnyOffer: inDefinitionsNeverInOffers.sort(),
  };

  const payload = { ...summary, parameters };

  fs.writeFileSync(outJson, JSON.stringify(payload, null, 2), "utf8");

  const md = [`# Audyt Asari (pokrycie parametrów)`, ``];
  md.push(`- **Data:** ${summary.generatedAt}`);
  md.push(`- **Katalog danych (względem projektu):** \`${summary.dataDir}\``);
  md.push(`- **Ofert (po scaleniu paczek):** ${summary.offerCount}`);
  md.push(`- **Parametrów w definictions (blok nazw):** ${summary.definitionParameterCount}`);
  md.push(`- **Pliki paczek użyte:** ${summary.packageFilesUsed.join(", ") || "—"}`);
  md.push(``);
  if (inOffersNotInDefinitions.length) {
    md.push(
      `### ID w ofertach, brak nazwy w pierwszym bloku definictions (${inOffersNotInDefinitions.length})`,
    );
    md.push(inOffersNotInDefinitions.map((x) => `- \`${x}\``).join("\n"));
    md.push(``);
  }
  if (inDefinitionsNeverInOffers.length) {
    md.push(
      `### ID w definicjach, nigdy nie występuje w żadnej ofercie (${inDefinitionsNeverInOffers.length})`,
    );
    md.push(inDefinitionsNeverInOffers.slice(0, 40).map((x) => `- \`${x}\``).join("\n"));
    if (inDefinitionsNeverInOffers.length > 40) {
      md.push(`- _… i ${inDefinitionsNeverInOffers.length - 40} dalszych (pełna lista w JSON)._`);
    }
    md.push(``);
  }
  md.push(`### Top parametrów według liczby ofert z niepustą wartością`);
  md.push(``);
  md.push(`| ID | Nazwa (definictions) | Ofert z wartością | % | Różnych wartości |`);
  md.push(`|----|----------------------|-------------------|----|------------------|`);
  for (const row of parameters.slice(0, 60)) {
    const name = (row.name ?? "—").replace(/\|/g, "\\|");
    md.push(
      `| ${row.id} | ${name} | ${row.offersWithNonEmptyValue} | ${row.coveragePercent}% | ${row.distinctNonEmptyValues} |`,
    );
  }
  if (parameters.length > 60) {
    md.push(``);
    md.push(`_Tabela skrócona do 60 wierszy — pełne dane: \`asari-audit-report.json\`._`);
  }
  md.push(``);

  fs.writeFileSync(outMd, md.join("\n"), "utf8");
  console.log(
    `[audit-asari] Zapisano ${path.relative(ROOT, outJson)} i .md (${offerCount} ofert, ${parameters.length} wierszy statystyk).`,
  );
}

main();
