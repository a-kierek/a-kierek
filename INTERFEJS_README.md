# THE CATROOMS | Interfejs monitoringu

Przebudowa interfejsu na wersję inspirowaną starym systemem monitoringu. Zmiany dotyczą wyłącznie interfejsu i ikon, bez zastępowania istniejących tekstur gry ani zmiany jej zasad.

## Pliki

- `css/haunted-ui.css` – mroczne motywy menu, HUD-u, ustawień, ekranu przegranej, akt przeciwników i kontrolek dotykowych.
- `js/ui/icons.js` – samodzielna biblioteka ikon wektorowych SVG; nie pobiera bibliotek ani fontów z internetu.
- `index.html` – podłączenie nowego stylu i SVG, drobne zmiany opisów i nagłówków.
- `js/ui/interface.js`, `js/ui/controls.js`, `js/gameplay/campaign.js` i inne – obsługa ikon w napisach aktualizowanych podczas gry.

## Jak uruchomić

1. Rozpakuj projekt.
2. Otwórz `index.html` lub wgraj katalog jako statyczną stronę (np. GitHub Pages).
3. Wersja samodzielna `THE_CATROOMS_MROCZNE_UI.html` ma grafikę, dźwięki i kod osadzone w jednym pliku.

## Zachowane funkcje

Kampania poziomów 1–4, tryb proceduralny, konsola F2 i `unlock all`, HP, toksyczne kałuże, mapa, WebGPU wraz z awaryjnym Canvas2D, dźwięki i ustawienia FOV, czułości, głośności oraz FPS. Kod CO-OP i serwer zostały zachowane w projekcie, ale tryb pozostaje wyłączony w menu.

Ikony przycisków i komunikatów są dekoracyjne; dostępność kontrolek wynika z ich tekstu lub etykiet ARIA.
