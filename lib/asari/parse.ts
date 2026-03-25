import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
  // Eksport Asari: opisy zawierają wiele encji (&lt;br/&gt; itd.); domyślny limit 1000 powoduje throw.
  processEntities: { maxTotalExpansions: 500_000 },
});

type RawP = { "@_id"?: string; "#text"?: string; [key: string]: unknown };

function collectP(nodes: unknown): RawP[] {
  if (nodes == null) return [];
  if (Array.isArray(nodes)) return nodes as RawP[];
  return [nodes as RawP];
}

function paramText(p: RawP): string {
  const text = p["#text"];
  if (typeof text === "string") return text;
  if (typeof text === "number" && Number.isFinite(text)) return String(text);
  if (typeof text === "boolean") return text ? "true" : "false";
  const t = p as Record<string, unknown>;
  for (const k of Object.keys(t)) {
    if (k.startsWith("@_")) continue;
    const v = t[k];
    if (typeof v === "string") return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
    if (typeof v === "boolean") return v ? "true" : "false";
  }
  return "";
}

export function parametersToMap(parameters: unknown): Map<string, string> {
  const map = new Map<string, string>();
  const raw = (parameters as { p?: unknown })?.p;
  for (const p of collectP(raw)) {
    const id = p["@_id"];
    if (id != null) map.set(String(id), paramText(p));
  }
  return map;
}

type RawPicture = {
  unique?: string | { "#text"?: string };
  status?: string | { "#text"?: string };
  weight?: string | { "#text"?: string };
};

function textField(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "#text" in v) {
    return String((v as { "#text": string })["#text"] ?? "");
  }
  return String(v);
}

export function extractPictures(picturesBlock: unknown): {
  name: string;
  status: string;
  weight: number;
}[] {
  const pics = (picturesBlock as { picture?: unknown })?.picture;
  const list = collectP(pics) as RawPicture[];
  const out: { name: string; status: string; weight: number }[] = [];
  for (const pic of list) {
    const name = textField(pic.unique).trim();
    if (!name) continue;
    const status = textField(pic.status).trim();
    const w = Number.parseInt(textField(pic.weight), 10);
    out.push({
      name,
      status,
      weight: Number.isFinite(w) ? w : 999,
    });
  }
  return out;
}

export function parsePackageXml(xml: string): unknown {
  return parser.parse(xml);
}

export function packageOffers(root: unknown): unknown[] {
  const pkg = (root as { PACKAGE?: { offer?: unknown } })?.PACKAGE;
  const o = pkg?.offer;
  if (o == null) return [];
  return Array.isArray(o) ? o : [o];
}
