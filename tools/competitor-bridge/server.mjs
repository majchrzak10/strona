/**
 * Minimalny most HTTP dla WordPressa (Webist WP Asari CRM → Konkurencja).
 * WordPress wysyła POST {bridgeUrl}/search z JSON: platform, keyword, category.
 *
 * Uruchomienie: npm start (npm w folderze tools/competitor-bridge)
 * Port: PORT (domyślnie 3847)
 */
import http from "http";
import { URL } from "url";

const PORT = Number(process.env.PORT) || 3847;

function sendJson(res, status, body) {
	const payload = typeof body === "string" ? body : JSON.stringify(body);
	res.writeHead(status, {
		"Content-Type": "application/json; charset=utf-8",
		"Access-Control-Allow-Origin": "*",
	});
	res.end(payload);
}

async function fetchCivitai(username) {
	const u = new URL("https://civitai.com/api/v1/creators");
	u.searchParams.set("username", username.trim());
	const r = await fetch(u, { headers: { Accept: "application/json" } });
	if (!r.ok) {
		throw new Error(`Civitai HTTP ${r.status}`);
	}
	const data = await r.json();
	const item = data.items?.[0];
	if (!item) {
		throw new Error("Brak wyniku dla podanej nazwy użytkownika.");
	}
	return {
		platform: "civitai",
		username: item.username ?? username,
		profile_url: item.link ?? `https://civitai.com/user/${encodeURIComponent(username)}`,
		raw: item,
	};
}

const server = http.createServer(async (req, res) => {
	if (req.method === "OPTIONS") {
		res.writeHead(204, {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS, GET",
			"Access-Control-Allow-Headers": "Content-Type",
		});
		return res.end();
	}

	let pathname;
	try {
		pathname = new URL(req.url || "/", `http://${req.headers.host}`).pathname;
	} catch {
		return sendJson(res, 400, { message: "Bad URL" });
	}

	if (req.method === "GET" && pathname === "/health") {
		return sendJson(res, 200, { ok: true, service: "wwac-competitor-bridge" });
	}

	if (req.method === "POST" && pathname === "/search") {
		let raw = "";
		for await (const chunk of req) {
			raw += chunk;
		}
		let payload;
		try {
			payload = JSON.parse(raw || "{}");
		} catch {
			return sendJson(res, 400, { message: "Niepoprawny JSON" });
		}
		const platform = String(payload.platform || "").trim();
		const keyword = String(payload.keyword || "").trim();
		const category = String(payload.category || "").trim();

		if (!platform || !keyword) {
			return sendJson(res, 400, { message: "Wymagane pola: platform, keyword" });
		}

		try {
			if (platform === "civitai") {
				const data = await fetchCivitai(keyword);
				return sendJson(res, 200, data);
			}
			return sendJson(res, 200, {
				platform,
				keyword,
				category,
				profile_url: null,
				message:
					"Stub — podłącz crawler dla tej platformy (Python/Playwright) i zwróć JSON z profile_url i username.",
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			return sendJson(res, 500, { message: msg });
		}
	}

	return sendJson(res, 404, { message: "Użyj POST /search lub GET /health" });
});

server.listen(PORT, "0.0.0.0", () => {
	console.log(`[wwac-competitor-bridge] POST http://127.0.0.1:${PORT}/search`);
	console.log(`[wwac-competitor-bridge] GET  http://127.0.0.1:${PORT}/health`);
});
