# THE CATROOMS v1.6 Alpha 2 — Bugfix Overhaul

Baza: Alpha 1, potwierdzona przez użytkownika. Zasoby i shadery pozostawiono bez zmian; CO-OP nadal wyłączony.

## Zmiany
- Tarcza chroni przed dotykiem przeciwnika i toksycznym płynem przez 12 sekund symulacji od podniesienia. Po wygaśnięciu wraca normalna podatność. Nie blokuje awarii reaktora; to porażka zadania. God mode nadal blokuje wszystkie przyczyny śmierci, teraz również obrażenia HP. Komunikaty ochrony mają limit częstotliwości. F2 `status` pokazuje pozostałe sekundy tarczy.
- Boss Rush tworzy własne 3 safe roomy (sektory 1, 3, 5), bez drugiego generatora kasującego wyposażenie i dodającego monety/automat. Pierwszy pokój nie jest renderowany podwójnie. Przed zmianą mapy czyścimy stan i geometrię poprzedniej rundy.
- Kolizje mebli używają współrzędnych zmiennoprzecinkowych; ruch dzielony na krótkie kroki. BFS nawigacji AI uwzględnia statyczne meble i przejścia między środkami komórek. Bufor przeszkód jest tworzony ponownie po zmianie tablicy mebli/rozmiaru mapy, a ściany i bramy są zawsze odczytywane na żywo. BFS generatorów nadal działa na samych kaflach.
- Widoczność używa DDA kafelków i przecięć odcinka z meblami. Interakcje, zbieranie przedmiotów i wyjście nie działają przez obce ściany. Zamknięte docelowe drzwi/wyjście mogą być obsłużone z właściwej strony; automat ignoruje własną bryłę, nie obce przeszkody. E przekazuje faktycznie wybrany obiekt. Drzwi safe roomu nie zamkną się na graczu ani przeciwniku.
- AI porzuca pościg jednokrotnie przy wejściu gracza do zamkniętego safe roomu, zamiast co klatkę resetować patrol. Dźwięki z wnętrza zamkniętego pokoju są ignorowane w tej sytuacji. Nie zmieniano zasad dotyku zamrożonego przeciwnika: nadal zabija, zgodnie z wcześniejszym opisem FREEZE.
- Custom i rundy administratora nie zmieniają serii, rekordów, odblokowań ani ukończeń kampanii. F2 może otwierać testowe poziomy bez zmiany zwykłych odblokowań. Powtórka wymuszonej rundy testowej nadal jest testowa. `unlock all` i `streak reset` zachowano jako jawne polecenia modyfikujące zapis. Nie kasujemy ani nie migrujemy wcześniejszych zapisów, w tym wcześniejszych nieprawidłowych rekordów.
- Pętla wykonuje krótsze podkroki symulacji przy niższym FPS, zamiast gubić czas powyżej 45 ms. Maksymalny nadrabiany czas na klatkę: 250 ms, więc przy długich zawieszeniach nie nadrabia całości. To nie jest jeszcze docelowa stałokrokowa pętla z Alpha 4.
- Seed trybów proceduralnych kontroluje również wybór pokoju, plakaty, monety i generowanie wariantów napojów. Boss Rush pokazuje seed wejściowy; testowo `bossrush 12345`. Mapy wygenerowane z seedów starszej wersji mogą różnić się od Alpha 2. Powtarzalność między różnymi silnikami JS nie została sprawdzona, a losowanie podczas samej gry (np. automat) pozostaje losowe.
- Reset klas CSS trybów, w tym `custom-level`. Właściwy numer wersji w menu i nazwa pliku standalone.

## Testy automatyczne
- `node tests/debloat.test.cjs`: testy regresji Alpha 1.
- `node tests/bugfix.test.cjs`: 10 grup testów rzeczywistej logiki JS z mockami DOM/audio, w tym reset i pierwsza aktualizacja 13 identyfikatorów poziomów/trybów, tarcza, god mode, widoczność, meble, ścieżki i bramy, zamykanie drzwi, postęp, czas przy 10 FPS, patrol AI i powtarzalność seedów w 5/6/12.
- `node --check` wszystkich plików JS, `python tools/build_standalone.py`, kontrola archiwum i ścieżek lokalnych HTML.
- Brak rzeczywistego GPU w środowisku: nie zweryfikowano wyglądu sceny, kompilacji shaderów, FPS, zachowania audio ani długich rozgrywek. Geometria i pliki zasobów nie zostały zmodyfikowane.

## Testy manualne (priorytet)
1. HARD: znajdź tarczę, wejdź w toksyczny płyn lub zbliż się do przeciwnika, sprawdź działanie w ciągu 12 sekund i po wygaśnięciu. F2 `status` wyświetla pozostały czas; nie oznacza rundy jako testowej.
2. F2 `bossrush` (lub `bossrush 12345`): sprawdź safe roomy w sektorach 1/3/5, modele, krzesło, automat, monety i bramy. Wykonaj kilka prób E z obu stron drzwi.
3. We wszystkich trybach sprawdź kolizje, zbieranie, przechodzenie przez wyjście i interakcje E. Sprawdź, czy AI nie blokuje się w pobliżu mebli.
4. Custom oraz rundy F2: sprawdź, czy ukończenie lub przegrana nie zmienia postępu. Prawdziwa wygrana nadal odblokowuje kolejny poziom. Uwaga: `unlock all` celowo zmienia zapis.
5. Sprawdź zmiany NORMAL/HARD/Custom, pauzę i restart, zachowanie przy niskim FPS. Jeśli znajdziesz regresję, zanotuj tryb, seed (jeśli jest), kroki odtworzenia i błędy F12.

## Poza zakresem
Redukcja modeli, tekstur, obciążenia shaderów i transferów GPU, pełna refaktoryzacja AI i silnika oraz CO-OP pozostają kolejnymi etapami. Nie deklarujemy wzrostu FPS.
