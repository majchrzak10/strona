<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Asari CRM, eksport XML, zdjecia, CI/CD — obowiazkowa lektura

Ten projekt laduje oferty nieruchomosci z eksportu **Asari CRM** (XML + JPG).
Przed kazda edycja ponizszych plikow przeczytaj `docs/ASARI_EKSPORT_I_DEPLOY.md`:

- `lib/asari/*` — parsowanie XML, ladowanie ofert, typy
- `scripts/copy-photos.mjs` — prebuild: kopiuje zdjecia z asari-export/foto/ -> public/zdjecia/
- `asari-export/` — XML ofert commitowane do git (zdjecia NIE sa w git)
- `.github/workflows/deploy.yml` — CI: rsync Asari, build, deploy
- `components/nieruchomosci/FilteredOffersGrid.tsx` — filtry ofert (client-side)

### Najwazniejsze zasady (szczegoly w docs/ASARI_EKSPORT_I_DEPLOY.md):

1. **Eksport przyrostowy** — kazda paczka XML zawiera tylko zmiany (ADD/UPDATE/DELETE), nie pelna baze.
   `loadOffers.ts` scala wszystkie paczki w kolejnosci mtime; DELETE usuwa po signature.

2. **Dwa rozne foldery ze zdjeciami:**
   - `public_html/asari2/foto/` (serwer) = zrodlo, Asari wrzuca JPG przez FTP
   - `asari-export/foto/` = staging w CI (NIE w git — za duze pliki)
   - `public/zdjecia/` / `out/zdjecia/` = wynik buildu

3. **rsync deploy musi miec `--exclude=asari2`** — inaczej usunie folder zrodlowy Asari z serwera.

4. **Filtry**: uzywaj `window.history.replaceState`, nie `router.replace()`.
   W `output: "export"` router.replace wywoluje pelna nawigacje i nie dziala poprawnie.

5. **Lokalny dev**: `.env.local` wymaga bezwzglednej sciezki Windows do `asari-export/`
   (process.cwd() w Next.js 16 dev moze zwracac katalog wyzej niz projekt).

Szczegoly, diagram przeplywu i tabela sekretow CI: `docs/ASARI_EKSPORT_I_DEPLOY.md`
Deploy i SSH CyberFolks: `docs/github-cyberfolks.md`
