Eksport Asari (XML)
====================

Skopiuj tutaj zawartość eksportu z Asari, np.:
  - definictions.xml
  - pliki *_001.xml (paczki ofert)
  - opcjonalnie *_CFG.xml

Zdjęcia: folder "foto/" obok XML (lub podaj ASARI_PHOTOS_DIR w .env.local).

W .env.local (w katalogu głównym projektu) ustaw np.:

  ASARI_DATA_DIR=asari-export
  ASARI_PHOTOS_DIR=asari-export/foto

Ścieżka może być względna do projektu — wtedy działa tak samo lokalnie i na GitHub Actions,
jeśli w repozytorium jest ten folder z plikami XML.
