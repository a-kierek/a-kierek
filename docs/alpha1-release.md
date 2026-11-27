# Notatki wydania v1.7 Alpha 1

## Zmiany od Checkpoint 11 Hotfix

- Miękkie cienie próbkują obszar źródła światła dla lamp, ognia i latarki. Twarde cienie ścian i zamkniętych drzwi są dostępne osobno.
- Modele wyposażenia, skały, drzwi, drzewka i automaty rzucają cienie o kształcie swoich siatek. Drzwi rzucają cień zgodny z animacją otwierania. Ognisko nadal emituje światło bez zasłaniania go własną siatką.
- Tryb 3D wyznacza głębokość ściany z pozycji siatki, co poprawia stabilność UV i głębokość używaną przy zasłanianiu obiektów. Sąsiednie powierzchnie podłogi i sufitu są łączone w prostokąty. Zmiany drzwi unieważniają bufor geometrii.
- PBR i normal mapping korzystają z tych samych materiałów w obu trybach renderowania terenu.
- Korytarz demonstracyjny zawiera stałe stanowiska z oświetleniem, zamkniętymi drzwiami i inspirowanymi kampanią rekwizytami. Zwiedzanie i pomiar są oddzielone od zapisu postępów.
- AUTO zapisuje preset wybrany przez benchmark. Benchmark ręczny zachowuje bieżące ustawienia. Można anulować pomiar także z pauzy.
- Przywracanie domyślnych ustawień stosuje właściwe wartości grafiki. Zegar limitu FPS zachowuje żądaną średnią częstotliwość na ekranach o innym odświeżaniu. Licznik pomija próby renderowania ukrytego menu.

## Zakres renderowania

PBR dotyczy ścian, podłogi i sufitu obsługujących atlas szczegółów. Wysokość sektora wynosi jeden kafel. Cienie siatek działają w pobliżu gracza i wygasają między 9 a 11 kaflami. Bufor obejmuje do 96 najbliższych modeli rzucających cień. Cienie siatek i miękkie cienie są opcjonalne i domyślnie wyłączone poza presetem Ultra.

## Weryfikacja

- Testy regresji gry obejmują m.in. generowanie map, kolizje, zachowanie drzwi, AI, zapis postępów, ustawienia, zasoby i limit FPS.
- Test Chromium z WebGPU i SwiftShaderem sprawdza kompilację shaderów, odczyt cieni z bufora i piksele renderowane na teksturze GPU. W testowanym kadrze geometria 3D odpowiadała klasycznemu renderowaniu, a przełączenie HD/PBR oraz cieni zmieniało wynik renderowania.
- Geometria korytarza używa 36 trójkątów podłogi i sufitu zamiast 944. FPS na fizycznych kartach graficznych zależy od urządzenia i rozdzielczości. Wydanie zawiera pomiar AUTO uruchamiany na urządzeniu gracza.
- Benchmark WebGPU przeszedł pięć presetów i zachował stan pauzy. W środowisku SwiftShader z oknem 320 × 216 AUTO wybrał Potato. Pomiar tego presetu dał 8,1 szac. FPS i 177,5 ms p90. Są to wyniki renderowania programowego w środowisku testowym.
