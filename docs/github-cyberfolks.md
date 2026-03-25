# GitHub Actions → CyberFolks (FTP)

Krótko: przy **pushu na `main` lub `master`** (albo ręcznie: **Actions → Deploy — CyberFolks → Run workflow**) GitHub buduje statyczną stronę (`npm run build` → folder `out/`) i wgrywa ją na hosting przez **FTP**.

## 1. Dane FTP w panelu CyberFolks

W panelu hostingu znajdź:

- **Host** (serwer FTP) — np. `ftp.twojadomena.pl` albo adres IP  
- **Login** i **hasło** FTP  
- **Katalog docelowy** — często `/public_html/` albo `/domains/nazwa-domeny.pl/public_html/`

Jeśli nie jesteś pewien katalogu, w FileZilli po zalogowaniu zobaczysz, gdzie leżą pliki strony (np. `index.html` z poprzedniej wersji).

## 2. Sekrety w GitHubie

1. Otwórz repozytorium na GitHubie → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret** i dodaj:

| Nazwa sekretu   | Wartość                          |
|-----------------|----------------------------------|
| `FTP_SERVER`    | host z panelu (bez `ftp://`)     |
| `FTP_USERNAME`  | login FTP                        |
| `FTP_PASSWORD`  | hasło FTP                        |

3. (Opcja) **Pełny build ofert w CI** — jeśli na runnerze masz mieć te same XML co lokalnie:

| `ASARI_DATA_DIR`    | np. `./asari-export` (musisz wcześniej skopiować pliki w workflow) |
| `ASARI_PHOTOS_DIR`  | jeśli zdjęcia są w osobnym folderze                                |

Bez XML na GitHubie build się **powinien udać**: strona `/oferty/[slug]` używa technicznego slug-a tylko po to, by Next.js (`output: export`) miał co wygenerować, gdy lista ofert jest pusta; prawdziwe podstrony ofert pojawią się dopiero, gdy w workflow podasz `ASARI_DATA_DIR` (lub skopiujesz eksport XML na runner przed `npm run build`). Eksport Asari wysyłany tylko na serwer FTP **nie** trafia automatycznie do Actions.

## 3. Ścieżka na serwerze (opcjonalnie)

Domyślnie workflow wgrywa do **`/public_html/`**.

Jeśli u Ciebie jest inna ścieżka, ustaw **zmienną repozytorium** (nie musi być tajna):

**Settings** → **Secrets and variables** → **Actions** → zakładka **Variables** → **New repository variable**:

- Nazwa: `FTP_SERVER_DIR`  
- Wartość: np. `/domains/moja-domena.pl/public_html/` (z ukośnikami jak w panelu / FileZilli)

Workflow używa: `vars.FTP_SERVER_DIR`, a gdy jest pusta — `/public_html/`.

## 4. Pierwszy deploy

1. Wgraj zmiany z tym workflow na GitHub (`push` na `main`).
2. **Actions** → wybierz workflow **Deploy — CyberFolks (FTP)** → ostatnie uruchomienie → sprawdź logi.
3. Wejdź na stronę w przeglądarce — powinieneś zobaczyć nową wersję z `out/`.

## 5. Problemy z FTP (np. „Server sent FIN packet”, „Failed to connect”)

Serwery typu CyberFolks często **zrywają** zwykłe połączenie **FTP z obcych IP** (firewall) albo wymagają **FTPS** albo innego portu.

1. **Spróbuj FTPS (explicit)** — w repozytorium: **Settings → Variables → Actions** → **New variable**  
   - Nazwa: `FTP_PROTOCOL`  
   - Wartość: `ftps`  
   Zrób ponownie **Run workflow**. Jeśli nadal błąd, zmień wartość na `ftps-legacy` (implicit FTPS — rzadziej).

2. **Host w sekrecie `FTP_SERVER`** — sam adres, np. `ftp.twojadomena.pl`, **bez** `ftp://` i bez ścieżki.

3. **Blokada krajów / firewall** — w panelu CyberFolks sprawdź, czy nie masz zablokowanych połączeń z **USA** (runnery GitHub Actions są głównie tam). Ewentualnie **whitelist IP** — w dokumentacji hostingu lub z supportem: „GitHub Actions outbound IPs” (albo tymczasowo wyłącz restrykcyjną blokadę do testu).

4. **Port** — domyślnie **21**. Jeśli w panelu masz inny (np. FTPS na **990**), dodaj zmienną **`FTP_PORT`** z wartością `990` (same cyfry, workflow zamienia je na numer).

5. **Tylko SFTP (SSH, port 22)** — akcja `FTP-Deploy-Action` **nie obsługuje SFTP**. Jeśli hosting podaje wyłącznie SFTP, użyj innej akcji, np. [SamKirkland/web-deploy](https://github.com/SamKirkland/web-deploy) (SSH), albo wgrywaj `out/` ręcznie (FileZilla).

6. **Zła ścieżka** — popraw zmienną `FTP_SERVER_DIR`.

7. **Hasło w logach** — sekrety się nie pokazują; to normalne.

Dokumentacja akcji: [FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action).

## 6. Surfshark / alerty o GitHubie

Ogólne ostrzeżenia VPN/antywirusa o starych incydentach GitHuba **nie dotyczą** Twojego workflow ani sekretów w repozytorium.
