# THE CATROOMS: naprawy NORMAL / HARD

## Najważniejsze zmiany

- W menu głównym jest jeden przełącznik **NORMAL / HARD**. W trybie HARD główny przycisk uruchamia duży proceduralny labirynt (89×89) z sześcioma wariantami anomalii. Tryb NORMAL pozostawia standardowe poziomy i osobny zwykły tryb proceduralny.
- Pole **NAZWA GRACZA** przechowuje nick lokalnie w przeglądarce i wyświetla go w HUD.
- `M` lub przycisk mapy otwiera **nową minimapę** w odrębnym module `js/graphics/minimap.js`. Rysowanie mapy jest w Canvas2D, a scena 3D nadal w WebGPU.
- Żółta anomalia losuje odstępy pomiędzy impulsami (30–90 sekund), spowalnia tylko gracza i tylko gdy widzi go bez przeszkody. Po utracie linii wzroku spowolnienie nie działa.
- Zasięg widzenia wszystkich klasycznych przeciwników jest zwiększony o 48%, a słyszenie hałasu o 20%. Szara anomalia nadal wykrywa gracza przez ściany.
- Do map 2, 3 i 4 dodano puszki napoju energii. Zwykły tryb proceduralny gwarantuje napoje, a HARD ma już własne. Każda puszka losuje jeden z pięciu sprite'ów, **jedna na rundę** jest FAKE MONSTER. Zebranie fałszywej puszki spowalnia ruch na 15 sekund zamiast regenerować staminę.
- Usunięto czasowy „bob” ścian w shaderze oraz zbyt mocne przesunięcie perspektywy przy patrzeniu w górę/dół. Zmieniono skalowanie obrazu tak, aby zachowywać proporcje we wszystkich rozdzielczościach.
- Ukryto niepotrzebne paski przewijania. Długie menu pozostaje dostępne przez przesunięcie/pokrętło, ale bez rysowanych pasków.

## Sterowanie

- **WASD**: ruch, **mysz**: rozglądanie, **Shift**: bieg, **Ctrl**: skradanie.
- **E**: interakcja, **M**: mapa, **Q**: wabik, **F**: latarka.
- **HARD**: **Z** spowalniacz, **X** zamrażacz; na telefonie osobne przyciski.
- **F2**: konsola administratora.

## Technologia i ograniczenia

Trójwymiarowa scena wymaga **WebGPU**. Stary renderer Canvas2D nie jest przywracany, a minimapa 2D nie jest zamiennikiem renderowania 3D. Tryb CO-OP pozostaje wyłączony w interfejsie, ale jego logika i serwer są zachowane.

Testy uruchamiania i renderowania przeprowadzono z **symulowanym urządzeniem WebGPU**, a nie na fizycznym adapterze. Rzeczywista kompilacja WGSL i płynność na konkretnym GPU wymagają sprawdzenia w Chrome/Edge wspierającym WebGPU.
