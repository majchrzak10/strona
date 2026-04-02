# Asari CRM → strona dan-dom.pl: eksport, ścieżki, build, deploy

Ten dokument jest **jedynym źródłem prawdy** dla agentów AI i deweloperów.
Opisuje kompletny przepływ: skąd biorą się oferty i zdjęcia, przez co przechodzą,
gdzie fizycznie lądują. **Nie zgaduj ścieżek ani zachowań — wszystko jest tu opisane.**

---

## 1. Skrót: przepływ end-to-end

```
ASARI CRM
  | eksport FTP (przyrostowy, co ~30 min lub recznie)
  v
serwer CyberFolks (s59.cyber-folks.pl)
  |- domains/dan-dom.pl/public_html/asari2/          <- XML ofert (*_001.xml + *_CFG.xml + definictions.xml)
  +- domains/dan-dom.pl/public_html/asari2/foto/     <- zdjecia JPG (unikalne nazwy liczbowe, np. 100654543.jpg)
          |
          | GitHub Actions — co 2h (cron "15 */2 * * *") lub przy push na main
          | rsync przez SSH port 222
          v
repo (asari-export/)                                 <- XML commitowane do git (nie zdjecia — za duze)
  |- asari-export/*.xml
  +- asari-export/foto/                              <- zdjecia tylko w pamieci runnera CI, NIE w git
          |
          | npm run build
          |   prebuild: scripts/copy-photos.mjs      <- kopiuje zdjecia z asari-export/foto/ -> public/zdjecia/
          |   Next.js SSG: lib/asari/loadOffers.ts   <- wczytuje wszystkie *_001.xml, scala po signature
          v
out/                                                 <- gotowy statyczny build
  |- out/zdjecia/                                    <- zdjecia po WebP konwersji (sharp)
  +- out/_next/static/...
          |
          | rsync --delete --exclude=asari2 ./out/ -> public_html/
          v
serwer: domains/dan-dom.pl/public_html/              <- produkcja dan-dom.pl
  |- zdjecia/                                        <- zdjecia dostepne pod /zdjecia/
  +- asari2/                                         <- CHRONIONY (--exclude=asari2): folder zrodlowy Asari
```

---

## 2. Dwa foldery ze zdjeciami — absolutnie rozne role

| Folder | Gdzie | Rola | Kiedy powstaje |
|--------|-------|------|----------------|
| `public_html/asari2/foto/` | serwer hosting | **Zrodlo** — Asari wrzuca tu JPG przez FTP | automatycznie (Asari CRM) |
| `asari-export/foto/` | repo (CI runner) | **Staging** — rsync sciaga z serwera na czas buildu | tylko w CI, **nie w git** |
| `public/zdjecia/` | repo, git | **Build input** — copy-photos.mjs kopiuje tu z asari-export/foto | prebuild (`npm run build`) |
| `out/zdjecia/` | lokalne / CI | **Build output** — gotowe zdjecia WebP do serwowania | po buildzie |
| `public_html/zdjecia/` | serwer hosting | **Produkcja** — rsync wgrywa z out/zdjecia/ | po deployu |

**Kluczowe:** rsync deploy uzywa `--exclude=asari2`, zeby nigdy nie usunac folderu zrodlowego Asari.

---

## 3. Format eksportu Asari (XML)

Asari eksportuje **przyrostowo** — kazda paczka zawiera tylko zmiany od ostatniego eksportu, nie pelna baze.

### Pliki w asari-export/:
- `definictions.xml` — slownik parametrow (id -> nazwa pola, np. id=36 -> "Typ nieruchomosci")
- `XXXXXX_YYYYMMDD_HHMMSS_001.xml` — paczka ofert (nowe + zmodyfikowane + usuniete)
- `XXXXXX_YYYYMMDD_HHMMSS_CFG.xml` — plik konfiguracyjny paczki (pomijany przy wczytywaniu)

### Struktura paczki XML:
```xml
<PACKAGE>
  <!-- Usuniecia (opcjonalne — oferta wycofana w Asari): -->
  <DELETE>
    <offers>
      <signature>402/6093/OMS</signature>   <!-- moze byc wiele <signature> -->
    </offers>
    <pictures />
  </DELETE>

  <!-- Nowe / zmodyfikowane oferty: -->
  <offer>
    <signature>300/6093/ODS</signature>     <!-- unikalny klucz: nr/biuro/typ -->
    <parameters>
      <p id="1">300/6093/ODS</p>            <!-- id=1: sygnatura -->
      <p id="26">AKTUALNA</p>               <!-- id=26: status (AKTUALNA / ARCHIWALNA) -->
      <p id="36">DZIALKA</p>                <!-- id=36: typ nieruchomosci -->
    </parameters>
    <pictures>
      <picture>
        <unique>100654543.jpg</unique>       <!-- nazwa pliku w asari2/foto/ -->
        <status>AKTYWNE</status>
        <weight>1</weight>                  <!-- kolejnosc wyswietlania -->
      </picture>
    </pictures>
  </offer>
</PACKAGE>
```

### Jak loadOffers.ts scala paczki:
1. Wczytuje wszystkie `*_001.xml` posortowane po mtime (najstarsze pierwsze)
2. Dla kazdej paczki: usuwa sygnatury z `<DELETE>`, dodaje/nadpisuje oferty z `<offer>`
3. Wynik: `Map<signature, AsariOfferDetail>` — kazda sygnatura = jedna oferta (ostatnia wersja)

---

## 4. GitHub Actions — kiedy i co sie dzieje

### Wyzwalacze:
- **push na main** -> pelny build + deploy
- **cron `"15 */2 * * *"`** -> co 2h automatyczna aktualizacja ofert (bez push kodu)
- **Run workflow recznie** -> jak push

### Krok "Pobranie eksportu Asari":
1. rsync przez SSH (port 222) sciaga XML-e z `domains/dan-dom.pl/public_html/asari2/` do `$RUNNER_TEMP/asari-export-fetch/`
2. rsync sciaga zdjecia z `domains/dan-dom.pl/public_html/asari2/foto/` do `$RUNNER_TEMP/asari-export-fetch/foto/`
3. Liczy oferty w nowej paczce: jesli 0 — pomija (ochrona przed pustym eksportem)
4. **Scala** nowe XML-e z `asari-export/` w repo (bez --delete — zachowuje historyczne paczki)
5. **Commituje** nowe XML-e do repo (tag `[skip ci]` — nie wywoluje kolejnego buildu)
6. Kopiuje zdjecia z staging do `asari-export/foto/` na czas buildu (nie do git — za duze)

### Krok "Build statyczny":
- `ASARI_DATA_DIR` = `$GITHUB_WORKSPACE/asari-export` (domyslnie, fallback gdy sekret pusty)
- `ASARI_PHOTOS_DIR` = `$ASARI_DATA_DIR/foto`
- `prebuild` (`scripts/copy-photos.mjs`) kopiuje JPG -> WebP do `public/zdjecia/`
- Next.js SSG (`output: "export"`) generuje statyczny HTML z ofertami

### Krok "Deploy":
- rsync `./out/` -> `public_html/` z flagami `--delete --exclude=asari2`
- `--delete` usuwa stare pliki z hostingu, ale `--exclude=asari2` chroni folder Asari

---

## 5. Zmienne i sekrety CI (GitHub)

| Nazwa | Typ | Wartosc / Domyslna | Opis |
|-------|-----|-------------------|------|
| `FTP_SERVER` | sekret | `s59.cyber-folks.pl` | Host SSH do serwera |
| `FTP_USERNAME` | sekret | login SSH | |
| `FTP_PASSWORD` | sekret | haslo SSH | |
| `WEB3FORMS_ACCESS_KEY` | sekret | klucz API | formularz kontaktowy |
| `FTP_SERVER_DIR` | zmienna | `domains/dan-dom.pl/public_html` | Sciezka deploy na serwerze |
| `ASARI_REMOTE_XML_DIR` | zmienna | `domains/dan-dom.pl/public_html/asari2` | Skad rsync pobiera XML |
| `ASARI_REMOTE_FOTO_DIR` | zmienna | `domains/dan-dom.pl/public_html/asari2/foto` | Skad rsync pobiera zdjecia |
| `ASARI_SSH_PORT` | zmienna | `222` | Port SSH dla Asari |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | zmienna | `G-FN97HMK379` | Google Analytics |

---

## 6. Lokalne uruchamianie (dev)

```env
# .env.local (NIGDY nie commitowac do git):
ASARI_DATA_DIR=C:\Users\janma\Desktop\Claude Code\strona\asari-export
```

UWAGA: `process.cwd()` w Next.js 16 dev moze zwracac katalog **wyzej** niz projekt.
Uzywaj **bezwzglednej sciezki Windows** w `.env.local` zamiast relatywnej `asari-export`.

Zdjecia lokalnie: musza byc w `asari-export/foto/` — CI je sciaga, ale nie commituje do git.
Pobierz recznie przez FileZilla z `public_html/asari2/foto/` jesli potrzebujesz lokalnego podgladu.

---

## 7. Filtrowanie ofert (client-side)

Strona `/nieruchomosci` to statyczny HTML + React client components.
Filtry dzialaja przez `window.history.replaceState` -> `useSearchParams()`:

```
klik filtra
  -> window.history.replaceState(null, "", "?typ=wynajem&kat=mieszkanie")
  -> Next.js przechwytuje replaceState -> aktualizuje useSearchParams
  -> React re-render z nowymi parametrami -> filteredSorted sie zmienia
```

**NIE uzywaj `router.replace()`** — w static export wywoluje pelna nawigacje, ktora nie dziala.
Uzywaj `window.history.replaceState` bezposrednio (tak jak w `FilteredOffersGrid.tsx`).

---

## 8. Czeste pulapki

| Problem | Przyczyna | Rozwiazanie |
|---------|-----------|-------------|
| Oferty nie aktualizuja sie | CI nie commituje XML / asari folder na serwerze pusty | Sprawdz Actions log, czy rsync Asari dziala |
| Zdjecia nowych ofert brak na produkcji | CI nie skopiowal foto przed buildem | Sprawdz krok "Asari" w Actions — czy `foto_ok=true` |
| Stara oferta wciaz widoczna | Paczka DELETE nie jest wczytana | Upewnij sie ze plik DELETE jest w asari-export/ |
| `Brak ASARI_DATA_DIR` lokalnie | .env.local ma sciezke relatywna, cwd != projekt | Uzywaj bezwzglednej sciezki Windows w .env.local |
| Filtry nie dzialaja | `router.replace()` zamiast `history.replaceState` | Uzywaj window.history.replaceState |
| Deploy usuwa asari2/ | brak --exclude=asari2 w rsync | Deploy zawsze musi miec --exclude=asari2 |
| Oferta znikla mimo ze jest w ASARI | DELETE w starszej paczce, potem nie ma UPDATE | Sprawdz czy Asari wysylal paczke DELETE przed ostatnim cron |
