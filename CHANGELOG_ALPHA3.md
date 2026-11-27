# THE CATROOMS v1.6 Alpha 3 | Performance Overhaul + Chrum sprite hotfix

## Zmiany
- Grafiki wszystkich pięciu przeciwników pozostają identyczne bajtowo. Plik Chrum jest obecny, zawiera poprawne dane alfa i jest przypisany do warstwy 1. Dokładna przyczyna zgłoszonej niewidoczności na GPU nie została odtworzona.
- Atlas czeka na dekodowanie obrazów (również tych z `complete=true`), sprawdza wymiary i ponawia próbę dla wymaganych tekstur przeciwników. Brak grafiki daje czytelny błąd, a nie ciche zastąpienie jej innym przedmiotem. Proporcje są buforowane na podstawie faktycznie załadowanej grafiki.
- Przy przekroczeniu limitu 256 sprite'ów pierwszeństwo mają przeciwnicy, następnie najbliższe przedmioty. Renderowanie przezroczystości pozostaje od najdalszych do najbliższych. Zmniejszono margines testu głębokości sprite'a. Naprawiono również przypadek `spawn pig` na Level 1: przeciwnik jest renderowany, symulowany i obsługiwany przez audio.
- Nowe polecenia F2: `sprites` (warstwa Chruma, głębokość i przyczyna odrzucenia lub zgłoszenie do GPU) oraz `perf` (licznik przesłanych buforów i bajtów, klatki, trójkąty i sprite'y ostatniej klatki). `sprites` nie mierzy faktycznego zasłaniania przez GPU.
- Bufory mapy, wyposażenia i hazardów aktualizowane tylko po zmianie; drzwi i bramy oznaczają zmianę mapy. Statyczne pozycje modeli mają cache; tablice klatki i sprite'ów są wielokrotnego użytku. Usunięto niewykorzystywane bufory pozycji modeli.
- Konserwatywne odrzucanie modeli poza poziomym polem widzenia. Zredukowano trójkąty: automat 172288 → 52198, choinka 134271 → 29699, ognisko 1832 (bez zmian). Redukcja 72,85%. Wymiary modeli zachowane; maski sylwetek z 3 kierunków pokrywają się w ponad 99% (test geometryczny, nie wizualny test GPU). Uproszczenie może zmieniać drobne detale, UV i oświetlenie.
- BFS korzysta z wielokrotnie używanych tablic; nasłuch ogranicza wyszukiwanie do maksymalnego dystansu i nie buduje ścieżki; patrol nie tworzy zbędnych obiektów ścieżki. Kolejność BFS i parametry AI zachowano. Odkrywanie minimapy tylko po zmianie pola lub tablicy `seen`.
- Menu renderowane maksymalnie 24 razy na sekundę; pauza renderowana tylko po zmianie stanu lub potrzebie odświeżenia (np. rozmiar/FOV/komenda F2). Rozgrywka nadal renderowana w każdej klatce. Opcja jakości Potato (0.5). FPS liczony z rzeczywistych wywołań renderera.
- `card.png` 1536×1024 → 512×341, `battery.png` 1100×1422 → 396×512. Zachowano PNG, proporcje i przezroczystość. Pozostałe grafiki, w tym przeciwnicy, bez zmian.
- Trzy długie ścieżki muzyczne skompresowane z 256 do 128 kb/s; krótkie efekty i głosy bez zmian. Dłuższe ścieżki nie są wstępnie pobierane wszystkie naraz; muzyka tworzona w momencie użycia. Wersja HTML nadal zawiera wszystkie zasoby w Base64, by działać offline.

## Testy
- `node tests/debloat.test.cjs`
- `node tests/bugfix.test.cjs` (w tym inicjalizacja 13 poziomów/trybów, AI oraz harmonogram renderowania)
- `node tests/performance.test.cjs` (6 grup, WebGPU mock)
- `python tests/assets.test.py` (format modeli, poprawność indeksów, dane alfa)
- Kontrola składni JS/Python i budowanie HTML offline.
- Chromium nie zainicjalizował GPU w środowisku testowym. Shadery, widoczność na ekranie, jakość modeli, muzyka i realny FPS wymagają testu użytkownika. Nie zmierzono wzrostu FPS ani wykorzystania VRAM w działającej grze.

## Testy manualne
1. NORMAL Level 4, HARD 4, Custom z Chrumem i Boss Rush: widoczność, szarża, pościg, warianty koloru. Jeśli problem wystąpi: F2 `sprites`, `ai`, `status` (w miarę możliwości zrzut ekranu, informacja o trybie i seedzie).
2. Safe room: otwieranie/zamykanie drzwi, wygląd automatu, choinki i ogniska. HARD: pojawianie się i znikanie toksycznych śladów, bramy Boss Rush.
3. Porównanie FPS Alpha 2.1 i Alpha 3 przy tej samej mapie, rozdzielczości i jakości grafiki. `perf` dostarcza liczniki, nie pomiar czasu GPU.
4. Pauza, zmiana FOV/rozdzielczości, powrót do gry, muzyka i efekty.

## Zachowane ograniczenia
- CO-OP nadal wyłączony. Nie przeprowadzono jeszcze pełnej przebudowy silnika, raycastingu per kolumna, wspólnego bufora głębokości dla modeli i sprite'ów ani migracji modeli z Base64 na oddzielne binaria. Są to dalsze prace wymagające testów rzeczywistego renderera.
- Oryginalne modele, muzyka i obrazy są w dostarczonym wcześniej projekcie Alpha 2.1 (oryginalne GLB również w archiwum deweloperskim Alpha 1). `tools/optimize_assets.py` uruchamiać na świeżej kopii zasobów Alpha 2.1, nie ponownie na skompresowanych assetach. Raport liczbowy: `docs/alpha3-assets.json`.
