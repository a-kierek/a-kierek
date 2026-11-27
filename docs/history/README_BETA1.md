# THE CATROOMS v1.6 Beta 1 – Stabilizacja

Wersja Beta 1 bazuje na potwierdzonej przez gracza Alpha 4.2. Rozpakuj do nowego katalogu, zatrzymaj stary serwer i uruchom `START_HOST_WINDOWS.bat` (lub `node server/server.js`). `/health` powinien wskazywać `1.6-beta1`. Samodzielny HTML nie wymaga serwera.

Zmiany: `CHANGELOG_BETA1.md`. Aby zbudować obie wersje i uruchomić testy: `python tools/check_release.py`. Opcjonalny test przeglądarkowy: `python tools/check_release.py --browser` (Playwright, Chromium, symulowane WebGPU). Testy nie zastępują sprawdzenia gry na rzeczywistym GPU.

## Alpha 4.2 HTTP startup hotfix

Rozpakuj cały ZIP do nowego katalogu, zatrzymaj poprzedni serwer i uruchom START_HOST_WINDOWS.bat lub `node server/server.js`. Sprawdź `http://localhost:8765/health` (version: `1.6-alpha4.2`). Po modyfikacji źródeł uruchom `python tools/build_standalone.py`, aby odtworzyć również `js/game.bundle.js`. Kolejność skryptów jest w `tools/script-order.json`. Nowe testy: `python tests/server_smoke.py`, `node tests/startup.test.cjs`. Zobacz `CHANGELOG_ALPHA4_2.md`.

## Alpha 4.1 startup hotfix

See `CHANGELOG_ALPHA4_1.md` for the startup changes and test limitations.

# THE CATROOMS v1.6 alpha 4 | Engine Rework

Wersja testowa solo, oparta na v1.5.2.

## Uruchomienie
- Rozpakuj ZIP. W katalogu projektu uruchom `python -m http.server 8000` i otwórz `http://localhost:8000` w Chrome/Edge z WebGPU.
- Alternatywnie użyj osobnego samodzielnego HTML. `index.html` wymaga HTTP, ponieważ modele są osobnymi plikami binarnymi; gotowy HTML działa bez serwera.
- Wymagany WebGPU; brak działającego fallbacku Canvas2D.
- Własny HTML offline: `python tools/build_standalone.py` (wynik w katalogu nadrzędnym).

## Rozwój
CO-OP pozostaje wyłączony. Adapter solo zastępuje aktywne ładowanie klienta. Oryginały GLB, powielone pliki mesh, źródłowe zdjęcie i nagranie oraz klient CO-OP są w osobnym archiwum deweloperskim; ścieżki są zachowane. Aby przebudować modele, najpierw przywróć oryginalne GLB do `assets/models/`. Nie trzeba ich przywracać do grania. Konwerter zachowuje istniejący model choinki. Nie włączaj starego klienta sieciowego bez ponownej integracji i testów.

Historia: `docs/history/`. Poprzednie instrukcje mogą być nieaktualne.

## Alpha 2
Zmiany i instrukcje testów: `CHANGELOG_ALPHA2.md` i `CHANGELOG_ALPHA2_1.md`.
Testy logiczne: `node tests/debloat.test.cjs` i `node tests/bugfix.test.cjs`.

## Alpha 3
Zmiany: `CHANGELOG_ALPHA3.md`, pomiary assetów: `docs/alpha3-assets.json`.
Nowe testy: `node tests/performance.test.cjs` oraz `python tests/assets.test.py` (numpy, Pillow).
Optymalizator `tools/optimize_assets.py` (numpy, Pillow, ffmpeg) uruchamiać wyłącznie na świeżej kopii oryginalnych assetów Alpha 2.1. Do grania nie jest wymagany. Konwerter modeli pozostaje narzędziem dla źródłowych GLB.

## Alpha 4
Nowa architektura: `js/engine/{session,modes,loop,assets}.js`. Opis zmian: `CHANGELOG_ALPHA4.md`. Nowe testy: `node tests/engine.test.cjs`; opcjonalnie po zbudowaniu HTML `python tests/browser_smoke.py` (Playwright i Chromium, symulowane WebGPU). `docs/alpha4-mesh-integrity.json` potwierdza zachowanie danych modeli Alpha 3.
