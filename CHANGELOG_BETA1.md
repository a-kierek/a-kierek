# v1.6 Beta 1 — Stabilizacja

Baza: Alpha 4.2, potwierdzona przez gracza. Zachowane aktywne tryby, balans, silnik WebGPU i wszystkie assety.

## Zmiany
- Odczyt ustawień liczbowych z localStorage odrzuca NaN, nieskończoność i puste ciągi, ogranicza wartości do dozwolonego zakresu. Nie kasujemy zapisów; nieprawidłowe wartości otrzymują bezpieczne wartości domyślne przy odczycie. Rekordy i win streak są nieujemne i skończone. Nieprawidłowy rekord Infinity nie odblokuje Boss Rush.
- Odmowa pointer lock (wyjątek synchroniczny lub odrzucona obietnica) nie przerywa rozgrywki. Kliknięcie obszaru gry ponawia próbę.
- Rozgrywka nie zaczyna się podczas inicjalizacji grafiki ani po utracie GPU. Po utracie aktualnego urządzenia renderer nie wysyła kolejnych klatek, gra przechodzi na pauzę, wyświetla komunikat i przycisk RELOAD. Nie ma automatycznej odbudowy GPU; bieżąca runda zostanie utracona przy przeładowaniu.
- Custom Game: walidacja identyfikatorów przeciwników, całkowite liczby sztuk i poprawny identyfikator motywu.
- Identyfikator wydania beta1 w HTML, adresach skryptów i /health. Nadal jeden uporządkowany bundle online oraz samodzielny HTML offline.
- Jedno polecenie budowania i kontroli: python tools/check_release.py [--browser]. Rozszerzony test HTTP wszystkich 60 plików mediów i faktycznych przycisków menu w Chromium.

## Weryfikacja
Uruchomiono tools/check_release.py --browser: wszystkie testy zakończone powodzeniem. Pełny log w docs/beta1-test-results.txt. Test przeglądarkowy używa prawdziwego DOM i dekodowania obrazów, ale symulowanego GPU i localStorage. Test HTTP uruchamia rzeczywisty serwer Node; testy przeglądarkowe dotyczą samodzielnego HTML, nie bezpośredniej nawigacji do serwera. Nie potwierdzono rzeczywistego renderowania WGSL, FPS, utraty fizycznego GPU ani długotrwałych sesji na Windows. CO-OP pozostaje wyłączony. Brak zmian assetów lub celowych zmian trudności.

## Testy gracza
Uruchom obie dystrybucje, sprawdź start każdej kampanii, Chruma, pauzę i restart, zapis rekordu po normalnym zwycięstwie, brak zapisu po rundzie testowej, Boss Rush i Custom. W przypadku problemu zachowaj komunikaty F12, seed i wynik F2 `status`, `ai`, `sprites`, `perf` lub `engine` odpowiednio do objawu.
