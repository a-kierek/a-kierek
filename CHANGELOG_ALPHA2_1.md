# Alpha 2.1 — AI hotfix
Feedback: CHRUM w pierwszej rundzie nie wykrywał gracza i nie gonił. Brak danych o trybie, seedzie i stanie AI; nie potwierdzono dokładnej przyczyny zgłoszonej rundy.

Naprawy wspólnego AI:
- Cel pościgu nie jest już nadpisywany celem patrolu w odległości <0,7 jednostki. Wymuszenie przeliczenia trasy przy wejściu w pościg; bezpośredni ruch do widocznego celu przy braku trasy, z zachowaniem kolizji.
- Powtarzające się odgłosy aktualizują cel nasłuchu bez restartu odliczania. W stanie suspicious aktualizują cel dochodzenia, zamiast wracać do nasłuchu.
- Po dojściu do podejrzanego punktu AI wyznacza cel przeszukiwania zamiast go porzucać; po zmianie celu przelicza trasę. Stojący przeciwnik w patrolu/przeszukiwaniu/dochodzeniu skanuje otoczenie, a nie utrzymuje stałego kierunku.
- Custom Normal: wybór pozycji startowej przeciwnika używa faktycznego wejścia mapy (7,7), tak jak Custom Hard.
- F2 `ai`: diagnostyka odległości, kąta, widoczności (LOS), stanu, ścieżki, wariantu, zamrożenia i ochrony gracza. Polecenie nie modyfikuje postępu.

Nie zmieniano zasięgu wzroku, kąta wykrywania, prędkości, zasad skradania, latarki, safe roomu ani zasobów. Zmiana stanów dotyczy wszystkich przeciwników współdzielących updateGuard.

Testy: 15 grup tests/bugfix.test.cjs (10 z Alpha 2 + 5 nowych), tests/debloat.test.cjs, kontrola składni JS, budowa HTML i integralność ZIP. Testy logiki nie zastępują rozgrywki WebGPU. Pierwszy nowy test (cel pościgu w odległości 0,68) reprodukuje błąd w niezmodyfikowanym Alpha 2.

Test manualny: F2 `level 4`, podejść do Chruma z włączoną latarką i bez skradania, sprawdzić pościg oraz reakcję na bieganie. Przy powtórzeniu problemu odczytać F2 `status` i `ai` i przesłać wyniki. Warto sprawdzić też NORMAL 5/SEKTOR 05, HARD i Custom. Zmiany nie są jeszcze potwierdzone na rzeczywistym GPU.
