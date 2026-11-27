# THE CATROOMS v1.6 Alpha 4 | Engine Rework

Baza: Alpha 3. Wydanie testowe solo. Nie zmieniano zasad, parametrów AI, grafiki, muzyki ani geometrii. Stały krok symulacji może jednak nieznacznie zmienić wynik zachowania przy granicznych odległościach/czasach.

## Architektura
- `js/engine/session.js`: GameSession przejmuje 54 wcześniej niezależne pola stanu rundy (gracz, mapa, przeciwnicy, zadania, przedmioty, efekty i zegary). Kod gry korzysta jawnie z `gameSession.*`; nie ma produkcyjnych aliasów dawnych globalnych zmiennych. Reset przydziela świeże kolekcje i zwiększa generację rundy oraz rewizję świata. Zapis kampanii, ustawienia, audio, wejście oraz GPU pozostają oddzielne.
- `js/engine/modes.js`: jeden rejestr generatorów i aktualizacji dla identyfikatorów 1–13. Boss Rush sam odpowiada za swoje pokoje, Custom może korzystać z pokoju lub go wyłączyć. Zachowano ID poziomów, reguły odblokowania oraz klucze zapisu.
- `js/engine/loop.js`: stały krok 1/60 s, akumulator czasu; limit 250 ms nadrabiania na klatkę (maks. 15 kroków). Pauza, koniec rundy i restart usuwają zaległy czas. Render działa niezależnie od symulacji, z interpolacją pozycji gracza i przeciwników; kamera myszą nadal reaguje bezpośrednio. Interpolacja nie zmienia fizyki, pozycji kolizji ani AI; po teleportacji/pauzie pozycja jest aktualna. Zachowano ograniczenie menu do 24 FPS i render pauzy na żądanie. Przy niskim FPS CPU może mieć więcej pracy niż w Alpha 3; nie zmierzono wpływu na fizyczny sprzęt.
- Timery przejść i śmierci mają własne anulowalne kanały. Zmiana rundy lub opuszczenie jumpscare'a nie pozwala staremu callbackowi zakończyć nowej gry. Wyjście z rozgrywki czyści aktywne wejścia klawiatury/dotyku. Przeniesiono dekoracyjny HUD do harmonogramu klatek zamiast niezależnego setInterval. Czyszczenie statusu reaktora i pamięci podręcznej interfejsu przy zmianie rundy.
- `js/engine/assets.js`: wspólne ładowanie/parsowanie binarnych CRM2, walidacja nagłówka, rozmiaru i liczby indeksów. `model-data.js` jest małym manifestem ścieżek; 3 pliki mesh są byte-for-byte zgodne z Alpha 3. Wersja serwowana pobiera binaria bez Base64, wersja offline osadza te same dane jako data URL. Zaktualizowano konwerter, bundler i typ MIME w lokalnym serwerze Node. Bez ponownej kompresji zasobów.
- F2 `engine`: numer generacji, tryb, stan, Hz symulacji, łączna liczba kroków od startu aplikacji, odrzucony czas, alpha interpolacji, zegar rundy. `perf`, `ai`, `sprites`, `status` pozostają dostępne.

## Testy wykonane
- `node tests/debloat.test.cjs` – regresje atlasu i przedmiotów.
- `node tests/bugfix.test.cjs` – 16 grup (kolizje, ochrona, AI, postęp, seedy, inicjalizacja 13 ID, render cadence). Test stałego kroku dostosowano z 3 zmiennych kroków do 6 kroków 1/60 s przy dt=.1.
- `node tests/performance.test.cjs` – 6 grup, WebGPU mock.
- `node tests/engine.test.cjs` – 7 grup, w tym identyczny upływ czasu przy 5/10/30/60/144/240 FPS, limit nadrabiania, izolacja rund, interpolacja, timery, mapowanie trybów i ładowanie binariów.
- `python tests/assets.test.py` – walidacja modeli i SHA-256, alfa przeciwników.
- `python tools/build_standalone.py` – kompletny HTML.
- `python tests/browser_smoke.py` – pełny HTML w rzeczywistym Chromium (DOM, grafiki, modele, 13 startów, wywołania renderera, pauza, restart podczas jumpscare'a, anulowanie przejścia). **WebGPU zastąpiony mockiem, nie waliduje shaderów i pikseli.** Nawigacja Chromium do localhost jest zablokowana przez środowisko. Nie uzyskano benchmarku FPS, realnego renderu ani testu prawdziwego adaptera.

## Testy manualne
1. Ruch, bieganie, mysz, kamera na monitorze 60/144 Hz; czy ruch gracza i przeciwników jest płynny, czy nie czuć nowych opóźnień.
2. NORMAL 1/4, HARD, Custom, Boss Rush; Chrum widoczny i reagujący, automaty/choinka/ognisko widoczne.
3. Pauza na kilka sekund, wznowienie, restart, przejście do kolejnego poziomu, powrót do menu, ponowne rozpoczęcie. Zegar nie powinien naliczać pauzy. F2 `engine` i `perf` w razie regresji.
4. Wersja ZIP: uruchomić lokalny serwer HTTP z katalogu projektu. Nie otwierać samego `index.html` przez file://, ponieważ wczytuje osobne binaria przez fetch; samodzielny HTML służy do gry offline.

## Zakres pozostawiony do kolejnego etapu
To migracja etapowa, nie pełne przepisanie silnika. Klasyczne skrypty zachowano ze względu na kompatybilność z offline. Pełne ES Modules, całkowite rozdzielenie HUD od symulacji, zmiany WGSL, konsolidacja CSS i CO-OP pozostają poza zakresem. Prawdziwa walidacja GPU i testy długich rozgrywek wymagają środowiska użytkownika. Przechowywanie lokalnych zapisów zależy od originu przeglądarki; klucze zapisu zachowano, ale zmiana pliku HTML może oznaczać osobny localStorage.
