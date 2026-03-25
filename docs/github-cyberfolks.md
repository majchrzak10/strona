# GitHub Actions → CyberFolks (SFTP)

Przy **pushu na `main` lub `master`** (albo **Actions → Deploy — CyberFolks (SFTP) → Run workflow**) GitHub buduje stronę (`npm run build` → `out/`) i wgrywa ją na hosting przez **SFTP**.

## CyberFolks — SSH włączone (typowe parametry)

W panelu przy **Status SSH: Włączone** zwykle masz:

| Pole | Przykład |
|------|----------|
| **Host** | `s71.cyber-folks.pl` albo **dowolna domena** przypisana do konta (oba działają) |
| **Port** | **222** (to nie jest 22) |
| **Użytkownik** | login konta FTP/SSH z panelu (DirectAdmin) |
| **Hasło** | często **osobne hasło konta FTP/SSH** — **nie zawsze** to samo co hasło głównego logowania do DirectAdmin. W DirectAdmin sprawdź / ustaw hasło **dokładnie dla tego użytkownika FTP** co w `FTP_USERNAME` i użyj go w sekrecie `FTP_PASSWORD`. |

**Na GitHubie ustaw:**

- Sekret **`FTP_SERVER`** = `s71.cyber-folks.pl` (albo Twoja domena).
- Sekret **`FTP_USERNAME`** = dokładnie login z panelu (np. ten z sekcji SSH).
- Sekret **`FTP_PASSWORD`** = odpowiednie hasło (nie wklejaj go na czacie ani do repo).

Opcjonalnie zmienna **`SFTP_PORT`** = `222` — w workflow domyślnie i tak jest **222**, więc możesz pominąć, dopóki nie zmienisz hostingu.

**Odciski kluczy serwera (ECDSA / ED25519 / RSA)** — przy pierwszym połączeniu klient (FileZilla, GitHub Actions) pyta o zaufanie hosta; możesz porównać z tymi z panelu.

### Jak włączyć / skonfigurować SSH na CyberFolks

1. **Włączenie SSH** — w panelu (DirectAdmin / cyber_Admin) znajdź sekcję **SSH** i upewnij się, że dostęp jest **włączony** (zobaczysz host, port **222**, login).  
   Oficjalna pomoc: [Dostęp SSH — jak włączyć SSH](https://cyberfolks.pl/pomoc/dostep-ssh-jak-wlaczyc-ssh/), [Jak zalogować się na SSH?](https://cyberfolks.pl/pomoc/jak-zalogowac-sie-na-ssh/).

2. **Logowanie hasłem** — ustaw **hasło konta FTP** (tego samego użytkownika co SSH). W DirectAdmin: **Konta FTP** → wybierz konto → **zmień hasło**. To hasło wklejasz do sekretu `FTP_PASSWORD` na GitHubie (nie myl z hasłem do samego panelu, jeśli są różne).

3. **Logowanie kluczem SSH** (bez hasła w GitHubie — wygodne na GitHub Actions) — najpierw na swoim komputerze wygeneruj parę kluczy, np. w PowerShell:
   ```powershell
   ssh-keygen -t ed25519 -C "github-deploy" -f "$env:USERPROFILE\.ssh\github_cyberfolks_ed25519"
   ```
   - Plik **`.pub`** to klucz **publiczny** (ten idzie na serwer).
   - Plik **bez** `.pub` to klucz **prywatny** (tylko do sekretu `SSH_PRIVATE_KEY` na GitHubie — **nikomu go nie wysyłaj**).

   **Gdzie wkleić publiczny klucz w CyberFolks:**
   - **DirectAdmin:** *Pozostałe ustawienia* → **Klucze SSH** → *Wklej istniejący klucz SSH* → wklej **całą jedną linię** z pliku `.pub` → **Utwórz**.  
     [Pomoc: Logowanie SSH z użyciem klucza](https://cyberfolks.pl/pomoc/logowanie-ssh-z-uzyciem-klucza/)
   - Albo **cyber_Admin:** *Serwer WWW* → **FTP** → **Edytuj** konto → zakładka **KLUCZE SSH** → wklej pole **KLUCZ** (treść `.pub`) → **DODAJ**. Klucz może być potem **aktywny** (suwak zielony).

4. **GitHub Actions** — ustaw zmienną **`SFTP_USE_KEY_AUTH`** = `true`, sekret **`SSH_PRIVATE_KEY`** = cała zawartość pliku prywatnego (z nagłówkiem `BEGIN ... KEY`). Opcjonalnie **`SSH_KEY_PASSPHRASE`**, jeśli klucz jest z hasłem.

5. **Test z komputera** (opcjonalnie):
   ```powershell
   ssh -p 222 TWOJ_LOGIN@s71.cyber-folks.pl
   ```
   lub z kluczem:
   ```powershell
   ssh -p 222 -i "$env:USERPROFILE\.ssh\github_cyberfolks_ed25519" TWOJ_LOGIN@s71.cyber-folks.pl
   ```

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
| `FTP_SERVER_DIR` | **Dokładnie** jak w FileZilli (*Zdalna witryna*), np. `domains/domena.pl/public_html` lub `public_html` — przy SFTP często **nie** działa sztywne `/public_html/` od roota. |
| `SFTP_PORT` | Gdy nie CyberFolks — np. `22` na innym hostingu |
| `DEPLOY_METHOD` = `lftp` | Tylko gdy SFTP nie działa — wtedy FTP/FTPS (port 21) |
| `SFTP_USE_KEY_AUTH` = `true` | Zamiast hasła: deploy **kluczem SSH** — wtedy sekret `SSH_PRIVATE_KEY` (i opcjonalnie `SSH_KEY_PASSPHRASE`) |

### Port inny niż u CyberFolks

Workflow domyślnie używa portu **222**. Na hostingu ze standardowym SSH ustaw **`SFTP_PORT`** = `22`.

### Gdy SFTP z GitHuba nadal nie działa

Firewall / blokada regionów — wtedy **ręczne wgranie** `out/`, **self-hosted runner** albo **`DEPLOY_METHOD=lftp`**.

## 4. Pierwszy deploy

1. Uzupełnij sekrety i ewentualnie `FTP_SERVER_DIR`.
2. `push` na `main` lub **Run workflow**.
3. Sprawdź log „Wgranie na CyberFolks (SFTP)”.

## 5a. „destination is not a directory” / błąd `put` przy deployu

Workflow wgrywa **cały folder** `out/` (nie `out/*`). Zdalna ścieżka musi wskazywać **istniejący katalog** strony — ustaw **`FTP_SERVER_DIR`** tak jak pełna ścieżka w FileZilli (np. `domains/twoja-domena.pl/public_html`), bez zgadywania.

## 5. „Permission denied, please try again” (SFTP)

Połączenie z serwerem **jest** (w logu: *Permanently added … to known hosts*), ale **odrzucane jest hasło**.

1. **Hasło konta FTP ≠ hasło do panelu DirectAdmin** — wejdź w DirectAdmin → **Konta FTP** (lub zarządzanie użytkownikiem SSH) i **ustaw / zresetuj hasło** dla tego samego loginu co w `FTP_USERNAME`. Wklej **nowe** hasło do sekretu `FTP_PASSWORD` na GitHubie (bez spacji na końcu wiersza).

2. **Login** — `FTP_USERNAME` musi być **identyczny** jak w panelu (np. ten z sekcji SSH), nie adres e-mail, jeśli panel podaje krótki login.

3. **Test w FileZilli** — SFTP, host `s71.cyber-folks.pl`, port **222**, ten sam login + hasło. Jeśli **FileZilla też** zwraca „Permission denied”, problem jest po stronie **hasła/loginu** na hostingu, nie GitHuba.

4. **Znaki specjalne w haśle** — rzadko psują `sshpass`; jeśli nadal błąd, ustaw tymczasowo prostsze hasło w panelu, zaktualizuj sekret, zrób deploy ponownie.

5. **Klucz SSH zamiast hasła** — wygeneruj parę (`ssh-keygen -t ed25519`), **klucz publiczny** dodaj w panelu (SSH / authorized keys), **prywatny** wklej jako sekret **`SSH_PRIVATE_KEY`** (cały blok, z końcową pustą linią). Ustaw zmienną **`SFTP_USE_KEY_AUTH`** = `true`. Opcjonalnie sekret **`SSH_KEY_PASSPHRASE`**, jeśli klucz jest z hasłem.

## 6. Inne problemy

- **Timeout** — firewall / support CyberFolks.
- **Ścieżka** — popraw `FTP_SERVER_DIR`.

Akcja: [SFTP-Deploy-Action](https://github.com/wlixcc/SFTP-Deploy-Action).

## 7. Bezpieczeństwo

Nie udostępniaj haseł w issue ani w kodzie. Alerty VPN o GitHubie nie dotyczą sekretów w repozytorium.
