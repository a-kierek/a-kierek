# THE CATROOMS v1.5 - HUD i Wlasna Gra

## Menu
- GRAJ, USTAWIENIA, GRACZ, WLASNA GRA oraz < PRESS START.
- Nowy konfigurator pozwala wybrac motyw mapy (sektor 1-5), rozmiar (49/65/81/97/121), trudnosc, od 0 do 3 przeciwnikow kazdego typu i generowanie pokoju z automatem. Jesli wszystkie typy wrogow ustawiono na zero, domyslnie pojawia sie Marmur.
- Tryb wlasny nie odblokowuje kampanii ani nie zapisuje rekordow fabularnych. W trybie HARD losowane sa championy (rozowy moze rozdzielic wroga na dwie postacie).
- Wybor opcji i zawartosc zakladek nie sa juz obcinane przez waski pasek nawigacji.
- Wybor poziomu NORMAL/HARD uruchamia gre bez ekranu opisu przeciwnikow.

## HUD
- Pasek gorny i panel CEL OPERACYJNY sa ukryte; zasoby i monety znajduja sie po lewej, minimapa po prawej, aktywny ekwipunek na dole po srodku.
- Pasek HP ma ikone serca, a pasek stamina pikselowe udko.
- Minimapka pozostaje widoczna w grze. M: pokaz/ukryj polprzezroczysty zegar, przytrzymaj M: powieksz mapke, zwolnij: przywroc rozmiar. Na telefonie dostepny jest przycisk MAPA.
- Przytrzymaj V, aby spojrzec za siebie bez zmiany kierunku ruchu. Na telefonie przytrzymaj przycisk 180.
- Nie pojawia sie wielki komunikat STREFA BEZPIECZNA.

## Mechanika
- X-ray/gray champion nie uruchamia muzyki chase, o ile nie goni rowniez inny wariant.
- Berserker: mnoznik predkosci zmniejszony z 1.52 do 1.34.
- Fake Monster spowalnia przez 2.75 sekundy.
- Przyciski menu, zwykle pickupy i monety maja nizsza glosnosc.
- Mysz: ignorowane sa ekstremalne skoki po zablokowaniu kursora, a kat pojedynczego ruchu ma limit.

## Testy
- Kontrola skladni JS we wszystkich modulach.
- Przegladarkowy test menedzera menu (zakladki, powrot do ekranu tytulowego), seedy wlasnych map 49-121, start 5 motywow, minmapa i kombinacja M, renderowanie HTML/CSS na desktop/mobile.
- Test audio szarego i czerwonego wariantu w przegladarce bez WebGPU.
- W srodowisku testowym nie ma natywnego adaptera WebGPU; nie ma potwierdzenia wizualnego nowych shaderow na fizycznej karcie.
