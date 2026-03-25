import open from "open";

// `localhost` jak w `next dev` — spójna domena dla Fast Refresh / HMR.
const url = process.env.PREVIEW_URL ?? "http://localhost:3000/";
await open(url);
