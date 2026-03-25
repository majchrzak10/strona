# GitHub Actions → CyberFolks (SFTP)

Przy **pushu na `main` lub `master`** (albo **Actions → Deploy — CyberFolks (SFTP) → Run workflow**) GitHub buduje stronę (`npm run build` → `out/`) i wgrywa ją na hosting przez **SFTP**.

## CyberFolks — SSH włączone (typowe parametry)

W panelu przy **Status SSH: Włączone** zwykle masz:

| Pole | Przykład |
|------|----------|
| **Host** | `s71.cyber-folks.pl` albo **dowolna domena** przypisana do konta (oba działają) |
| **Port** | **222** (to nie jest 22) |
| **Użytkownik** | login konta FTP/SSH z panelu (DirectAdmin) |
| **Hasło** | to samo co do panelu DirectAdmin (lub hasło konta FTP — zgodnie z tym, co podaje panel) |

**Na GitHubie ustaw:**

- Sekret **`FTP_SERVER`** = `s71.cyber-folks.pl` (albo Twoja domena).
- Sekret **`FTP_USERNAME`** = dokładnie login z panelu (np. ten z sekcji SSH).
- Sekret **`FTP_PASSWORD`** = odpowiednie hasło (nie wklejaj go na czacie ani do repo).

Opcjonalnie zmienna **`SFTP_PORT`** = `222` — w workflow domyślnie i tak jest **222**, więc możesz pominąć, dopóki nie zmienisz hostingu.

**Odciski kluczy serwera (ECDSA / ED25519 / RSA)** — przy pierwszym połączeniu klient (FileZilla, GitHub Actions) pyta o zaufanie hosta; możesz porównać z tymi z panelu.

## 1. Ogólne (inni dostawcy)

- **Katalog** na serwerze — np. `/public_html/` lub `/domains/nazwa.pl/public_html/` (sprawdź w FileZilli po połączeniu SFTP).

W **FileZilli**: protokół **SFTP**, host jak wyżej, port **222** (CyberFolks).

## 2. Sekrety w GitHubie

**Settings → Secrets and variables → Actions:**

| Nazwa sekretu    | Wartość |
|------------------|---------|
| `FTP_SERVER`     | host (bez `ftp://`) |
| `FTP_USERNAME`   | login SSH/SFTP |
| `FTP_PASSWORD`   | hasło |

Opcja: **`ASARI_DATA_DIR`**, **`ASARI_PHOTOS_DIR`** — pełny build ofert w CI.

## 3. Zmienne (Variables)

| Nazwa | Kiedy |
|-------|--------|
| `FTP_SERVER_DIR` | Ścieżka na serwerze, jeśli nie `/public_html/` |
| `SFTP_PORT` | Gdy nie CyberFolks — np. `22` na innym hostingu |
| `DEPLOY_METHOD` = `lftp` | Tylko gdy SFTP nie działa — wtedy FTP/FTPS (port 21) |

### Port inny niż u CyberFolks

Workflow domyślnie używa portu **222**. Na hostingu ze standardowym SSH ustaw **`SFTP_PORT`** = `22`.

### Gdy SFTP z GitHuba nadal nie działa

Firewall / blokada regionów — wtedy **ręczne wgranie** `out/`, **self-hosted runner** albo **`DEPLOY_METHOD=lftp`**.

## 4. Pierwszy deploy

1. Uzupełnij sekrety i ewentualnie `FTP_SERVER_DIR`.
2. `push` na `main` lub **Run workflow**.
3. Sprawdź log „Wgranie na CyberFolks (SFTP)”.

## 5. Problemy

- **Authentication** — login/hasło/host z panelu (DirectAdmin).
- **Timeout** — support CyberFolks / whitelist IP (rzadko).
- **Ścieżka** — popraw `FTP_SERVER_DIR`.

Akcja: [SFTP-Deploy-Action](https://github.com/wlixcc/SFTP-Deploy-Action).

## 6. Bezpieczeństwo

Nie udostępniaj haseł w issue ani w kodzie. Alerty VPN o GitHubie nie dotyczą sekretów w repozytorium.
