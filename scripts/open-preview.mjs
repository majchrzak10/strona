import open from "open";

// `localhost` jak w `next dev` — spójna domena dla Fast Refresh / HMR.
const url = process.env.PREVIEW_URL ?? "http://localhost:3000/";
console.log("\n>>> Podgląd strony: otwórz w przeglądarce (nie file://):\n>>>   %s\n", url);
try {
  await open(url);
} catch (e) {
  console.warn("[open-preview] Nie udało się otworzyć przeglądarki automatycznie — skopiuj URL powyżej.");
}
