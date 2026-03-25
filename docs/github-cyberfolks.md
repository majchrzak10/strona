# GitHub Actions → CyberFolks (SFTP)

Przy **pushu na `main` lub `master`** (albo **Actions → Deploy — CyberFolks (SFTP) → Run workflow**) GitHub buduje stronę (`npm run build` → `out/`) i wgrywa ją na hosting przez **SFTP** (SSH, zwykle port **22**).

Dlaczego nie FTP? Wiele hostingów (w tym CyberFolks) **zrywa zwykłe połączenia FTP** z adresów GitHub Actions (`Server sent FIN packet`). **SFTP** zwykle działa stabilniej z tym samym loginem i hasłem co w panelu.

## 1. Dane w panelu CyberFolks

- **Host** — często ten sam co „serwer FTP” (np. `ftp.twojadomena.pl`) lub osobny host SFTP; sprawdź w panelu / w FileZilli przy połączeniu **SFTP**.
- **Login** i **hasło** — to samo konto co FTP.
- **Katalog** — np. `/public_html/` lub `/domains/nazwa.pl/public_html/`.

W **FileZilli**: *Plik → Menedżer witryn → Nowe połączenie* → protokół **SFTP**, port **22** — jeśli tu działa, workflow też powinien.

## 2. Sekrety w GitHubie

**Settings → Secrets and variables → Actions → New repository secret:**

| Nazwa sekretu    | Wartość |
|------------------|---------|
| `FTP_SERVER`     | host (bez `ftp://`, bez ścieżki) |
| `FTP_USERNAME`   | login |
| `FTP_PASSWORD`   | hasło |

Nazwy zostają `FTP_*`, żeby nie zmieniać istniejących sekretów — to **to samo konto**, tylko protokół na runnerze to SFTP.

Opcja: **`ASARI_DATA_DIR`**, **`ASARI_PHOTOS_DIR`** — jeśli chcesz pełny build ofert w CI (XML na runnerze).

## 3. Ścieżka i port (Variables)

**Variables → New repository variable:**

| Nazwa | Przykład |
|-------|----------|
| `FTP_SERVER_DIR` | `/domains/moja-domena.pl/public_html/` |
| `SFTP_PORT` | `22` (pomiń, jeśli domyślny 22) |

Gdy `FTP_SERVER_DIR` jest pusta, używane jest `/public_html/`.

## 4. Pierwszy deploy

1. `push` na `main`.
2. **Actions** → **Deploy — CyberFolks (SFTP)** → sprawdź logi przy kroku „Wgranie na CyberFolks (SFTP)”.
3. Odśwież stronę w przeglądarce.

## 5. Problemy z SFTP

- **Permission denied / authentication** — sprawdź login, hasło, ewentualnie osobny host SFTP z panelu.
- **Connection timed out** — firewall / blokada krajów (np. USA); zapytaj support CyberFolks o połączenia z GitHub Actions.
- **Zła ścieżka** — popraw `FTP_SERVER_DIR` (musisz widzieć ten sam katalog w FileZilli).
- **Katalog nie istnieje** — przy `sftp_only: true` zdalny folder musi już być (zwykle `public_html` jest).

Akcja: [SFTP-Deploy-Action](https://github.com/wlixcc/SFTP-Deploy-Action).

## 6. Surfshark / alerty o GitHubie

Ogólne alerty VPN o GitHubie **nie dotyczą** sekretów w repozytorium — te są przechowywane po stronie GitHuba.
