# THE CATROOMS — HARD / WebGPU

## Najważniejsze zmiany

- Menu i pauza zajmują pełny ekran, bez czarnych pasów dookoła paneli.
- Krwawe nadruki UI występują **wyłącznie w menu głównym**. W scenie gry nie są wyświetlane krwawe plamy (również z dawnego systemu naklejek podłogowych). Niebezpieczne zielone plamy pozostały.
- Usunięty renderer sceny Canvas2D `renderer-legacy.js`. WebGPU to jedyny backend sceny. Canvas2D jest nadal używany wyłącznie do wytworzenia/załadowania tekstur i mapy pomocniczej.
- Nie ma obsługi gry w przeglądarce bez WebGPU. Zamiast pustego ekranu pokazuje się komunikat błędu, a start jest zablokowany.
- Wabiki przez 12 sekund ponawiają sygnał co 1,15 s, nie tylko przy rzuceniu.

## Tryb HARD

- Osobne wejście w menu. Każdy start tworzy nowy seed mapy 89 × 89, większej od proceduralnego poziomu 49 × 49; korytarze zawierają zwykle około 25–34 ślepych zaułków na seed (w 15 sprawdzonych mapach).
- 10–12 artefaktów, losowe zasoby, jeden zamrażacz i trzy spowalniacze.
- Zawsze sześć wariantów wrogów: RED (1,5× speed), GREEN (toksyczne ślady), YELLOW (7 sekund spowolnienia około co 30 s), GRAY (wzrok przez ściany/bez limitu dystansu, 0,66× speed), CLASSIC (bez perku), PINK (dwie niezależne mniejsze sztuki, 0,85× speed). Z wyjątkiem różowego wszystkie mają szybciej odświeżane trasy, zwiększony zasięg widzenia/nasłuchiwania i dłuższą pamięć pościgu.
- Kolor wroga jest nakładany w shaderze WebGPU, a zamrożeni dostają niebieskie/lodowe cieniowanie.
- `Z`: aktywacja spowalniacza na całą mapę na 30 sekund. Dodatkowe użycia przedłużają efekt.
- `X`: aktywacja zamrażacza. Wymaga widocznego stwora w zasięgu 15 jednostek; raz użyty zamraża go na stałe. Nie wyłącza szkód kontaktowych ani dźwięków.
- Na telefonie są dwa dodatkowe przyciski.
- `F2` → `hardseed 12345` odtwarza proceduralny HARD z konkretnym seedem.
- Tryb CO-OP nadal jest wyłączony, ale zachowany w kodzie projektu.

## Instalacja

**Gra w jednym pliku:** otwórz `THE_CATROOMS_HARD_WEBGPU.html` w aktualnym Chrome lub Edge z aktywnym WebGPU. W niektórych konfiguracjach przeglądarka wymaga uruchomienia przez HTTPS/localhost zamiast `file://`.

**GitHub Pages:** publikuj plik pojedynczy jako `index.html`, albo rozpakowany projekt z `index.html` w katalogu głównym.

**Projekt źródłowy:** `index.html`, `js/graphics/webgpu.js`, `js/gameplay/hard.js`, `js/characters/ai.js`, `js/gameplay/campaign.js`, `css/hard-release.css`, `assets/items/`.

## Zasięg testów

- Test logiczny uruchomienia wszystkich sześciu trybów, 60 seedów HARD, 125 aktualizacji klatkowych HARD, aktywacji spowalniacza i zamrażacza, ponawiania odgłosów wabika.
- WebGPU: symulowany adapter (inicjalizacja, transfer tekstur, draw calls). **Shader WGSL i finalny obraz WebGPU nie były zweryfikowane na rzeczywistym GPU.**
- Układ menu 1360 × 820 oraz 390 × 844 w przeglądarce headless.
