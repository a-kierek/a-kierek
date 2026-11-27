# THE CATROOMS v1.7 Alpha 1

## Uruchomienie

- **Offline** — otwórz plik `THE_CATROOMS_V1_7_ALPHA1.html` w aktualnym Chrome lub Edge z WebGPU. Plik zawiera grę i wszystkie potrzebne zasoby.
- **Projekt** — rozpakuj cały katalog projektu. Uruchom `START_HOST_WINDOWS.bat`, `./START_HOST_MAC_LINUX.sh` lub `node server/server.js` i wejdź na `http://localhost:8765`. Endpoint `/health` zwraca wersję `1.7.0-alpha.1`.
- Zapisy w przeglądarce zależą od ścieżki pliku offline lub adresu serwera. Aktualizacja projektu nie zmienia kluczy kampanii ani profilu.

## Grafika i benchmark

- **Play → Graphics Demo** otwiera korytarz do swobodnego zwiedzania. `F` przełącza latarkę, `E` otwiera drzwi z bliska, a `Esc` otwiera pauzę. W trybie dotykowym skorzystaj z przycisków gry.
- **Settings → Graphics and Performance → AUTO** mierzy pięć presetów na tej samej trasie i zapisuje najwyższy spełniający cel 60 FPS z zapasem. Jeśli żaden go nie spełnia, wybiera Potato. Po zmianie rozdzielczości wynik można przeliczyć przez ponowny wybór AUTO.
- **Run Graphics Benchmark** pokazuje szacowaną przepustowość renderera i 90. percentyl czasu klatki dla każdej jakości bez zmiany preferencji. Test korzysta z kolejki WebGPU i działa niezależnie od limitu FPS gry. Wynik zależy od rozdzielczości okna, urządzenia i obciążenia systemu.
- **Ultra** włącza rasteryzację świata, miękkie cienie i cienie siatek modeli. Opcje można też włączać osobno. Klawisze `F8` i `F9` porównują geometrię oraz materiały. `F7` przełącza cienie otoczenia, `F6` przełącza model latarki, a `F4` przełącza postprocessing.

## Budowanie i testy

W katalogu projektu uruchom `python tools/build_standalone.py`, aby odtworzyć paczkę skryptów i plik offline w katalogu nadrzędnym. Polecenie `python tools/check_release.py` wykonuje kompilację, testy regresji, kontrolę zasobów i test serwera. Opcje `--browser` i `--webgpu` uruchamiają odpowiednio test interfejsu z atrapą GPU i test renderera WebGPU w Chromium ze SwiftShaderem. Testy przeglądarkowe wymagają pakietu Playwright dla Pythona.

Szczegóły zmian, ograniczenia i wyniki weryfikacji znajdują się w [notatkach wydania](docs/alpha1-release.md).
