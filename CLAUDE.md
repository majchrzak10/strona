@AGENTS.md

## Asari CRM, eksport ofert, zdjecia, deploy

Przed zmianami w **eksporcie Asari**, **ofertach**, **zdjeciach**
(`asari-export/`, `public/zdjecia/`, `scripts/copy-photos.mjs`, `lib/asari/*`)
lub **deployu** (`deploy.yml`, rsync) przeczytaj:

**`docs/ASARI_EKSPORT_I_DEPLOY.md`** — pelny opis przeplywu FTP -> hosting -> CI -> build -> produkcja.

Kluczowe fakty (nie zgaduj — szczegoly w docs/):
- Asari eksportuje **przyrostowo** (XML + zdjecia przez FTP na serwer CyberFolks, asari2/)
- CI co 2h sciaga XML+foto z `public_html/asari2/` przez rsync SSH, commituje XML do repo, zdjecia NIE sa w git
- Build: `ASARI_DATA_DIR` musi byc bezwzgledna sciezka; lokalnie .env.local z abs. sciezka Windows
- Deploy rsync zawsze ma `--exclude=asari2` — **nigdy nie usuwaj tej flagi**
- Filtry ofert: `window.history.replaceState`, **nie** `router.replace()`
