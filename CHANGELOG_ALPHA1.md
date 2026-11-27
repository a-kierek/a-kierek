# v1.6 alpha 1 — Deep Debloat

## Zmiany
- Oddzielono nieaktywny klient CO-OP od wersji solo; zachowano adapter zgodności i serwer. Kod klienta w osobnym archiwum deweloperskim. Ukryty interfejs CO-OP nadal istnieje.
- Usunięto tablicę i resety wabików, ikonę, grafikę oraz warstwę tekstur GPU. Skorygowano indeksy pozostałych sprite'ów (26 → 25 warstw). Identyfikatory prawdziwych przedmiotów z dawną nazwą `decoy` pozostawiono celowo.
- Usunięto pustą funkcję playStep i wywołania (dźwięk kroków nadal obsługuje syncWalkingAudio; mechanizm hałasu AI pozostawiono).
- Usunięto nieosiągalne odwołanie do nieistniejącej updateLevel2; poziom 2 używa updateFacility.
- Usunięto podwójne odczytanie postępu przy starcie.
- Naprawiono podwójne dodawanie monet do sprite'ów na poziomach >= 2.
- Przeniesiono zbędne w runtime GLB, pliki mesh oraz źródłowe zdjęcie CHRUM i nagranie jumpscare do oddzielnego archiwum. Wszystkie trzy osadzone modele pozostały identyczne.
- Uporządkowano dokumentację i poprawiono konwerter, aby nie gubił istniejącej choinki. Nie uruchamiano ponownej konwersji modeli.

## Testy
- `node --check` wszystkich aktywnych plików JS i serwera: OK.
- `python -m py_compile tools/*.py`: OK.
- `node tests/debloat.test.cjs`: OK (adapter solo, pojedyncze monety w 4 identyfikatorach trybów, indeksy 5 wariantów napojów, tarcz, kluczy, urządzeń, skał i Nieznajomego).
- `python tools/build_standalone.py`: OK, brak zewnętrznych lokalnych ścieżek JS/CSS/grafik/dźwięku w samodzielnym HTML.
- Trzy osadzone modele: nagłówki i rozmiary poprawne, plik identyczny bajtowo z oryginałem.
- Chromium w środowisku testowym zgłasza błąd inicjalizacji EGL; nie potwierdzono uruchomienia gry, kompilacji shaderów na realnym GPU ani FPS.

## Testy użytkownika
1. Uruchom HTML w Chrome/Edge z WebGPU. Sprawdź menu, ładowanie, muzykę i F2.
2. Rozpocznij NORMAL 1 oraz pozostałe dostępne poziomy, HARD, Custom i Boss Rush (jeśli odblokowany).
3. Sprawdź wygląd monet, napojów, baterii, kart, przeciwników, skał i urządzeń HARD oraz modele wyposażenia safe roomu.
4. Sprawdź kroki, pościg, hałas, pauzę, restart, powrót do menu i zapis postępu.
5. Zgłoś poziom/tryb, kroki do odtworzenia błędu, komunikat konsoli F12 i ewentualnie zrzut ekranu.

## Poza zakresem
W tej wersji nie przebudowano AI, kolizji, tarcz, Boss Rush, czasu gry, CSS ani geometrii i ładowania modeli. Nie zmieniano balansu. To mała, możliwa do odizolowania wersja regresyjna przed właściwą naprawą błędów. Brak obietnicy wzrostu FPS.
