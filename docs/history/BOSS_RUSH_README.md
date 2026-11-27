# THE CATROOMS v1.4 - BOSS RUSH

## Rozgrywka
- Boss Rush jest widoczny w zakladce **GRAJ** przy wybranym trybie HARD dopiero po wygraniu wszystkich pieciu poziomow HARD. Stare uczciwe rekordy HARD sa uznawane.
- Na mapie 121 x 121 znajduje sie **piec polaczonych stref**. Zamkniete bramy otwieraja sie automatycznie po odnalezieniu wszystkich przedmiotow i aktywowaniu paneli **w biezacej strefie**.
- Bossowie sa podwojeni wzgledem oryginalnego skladu kazdej strefy: 2 Marmury, 2 Blyski + 2 Szepty, 2 Marmury + 2 Blyski + 2 Szepty, 2 CHRUM-y oraz 2 CHRUM-y + 2 Nieznajomych. Lacznie 18 fizycznych bossow, losowe warianty kolorow (czerwony, zielony, zolty, szary i zwykly) z ulepszonym AI. Rozowy wariant z podzialem jest wylaczony TYLKO w Boss Rush, aby liczba bossow byla dokladnie podwojona.
- Osiagniecie wyjscia wymaga wszystkich 25 przedmiotow, szesciu aktywowanych paneli i przejscia przez cztery bramy.
- 3 zamykane pokoje bezpieczne z osobnymi automatami i ogniskami, w strefach 1, 3 i 5.
- Losowe kamienie utrudniaja przejscie, ale nie blokuja dostepu do celow.
- Gracz **nie regeneruje HP** w Boss Rush. Bossowie nadal zabijaja natychmiast przy zlapaniu.
- **Na ziemi nie pojawiaja sie zamrazacze**. Mozna je wygrac z automatu: 15% zamrazacz, 35% spowalniacz, 50% puste losowanie, za 1 grosz.
- Nie ma systemu walki ani zabijania bossow. Ukonczenie sekcji oznacza zebranie celow i naprawe paneli.

## Audio i menu
- Pierwszy MP3: `assets/audio/music/menu-ambient.mp3`, menu, po pierwszej interakcji `PRESS START` (ograniczenia autoplay przegladarek).
- Drugi MP3: `assets/audio/music/game-ambient.mp3`, tlo gry.
- Trzeci MP3: `assets/audio/music/chase-trailer.mp3`, kiedy aktywny boss wykryje i sciga gracza.
- Plynne przyciszenie tła podczas poscigu, osobny suwak ambient i efekty w ustawieniach.
- Beep po najechaniu myszka na przyciski i pola menu, rowniez przy kliknieciu.
- Nowy ekran ladowania pozostaje widoczny, az WebGPU zakonczy inicjalizacje tekstur i modeli, albo wyswietli blad.

## Wymagania
- Wymagany dzialajacy WebGPU. Kod zawiera renderer 3D GPU i nie ma zapasowego silnika Canvas2D.
- GitHub Pages moze serwowac gre przez HTTPS, ale to urzadzenie gracza musi miec WebGPU. Jesli `navigator.gpu.requestAdapter()` zwraca `null`, strona nie moze wymusic adaptera.
- Fonty i pliki dzwiekowe nalezy publikowac zgodnie z warunkami ich licencji.

## Programistycznie
- `js/gameplay/boss-rush.js` - mapa, cele, bramy, 3 pokoje i bossowie.
- `js/graphics/webgpu.js` - tekstury stref zalezne od pozycji, osobne siatki 3D automatow i ognisk.
- `js/audio/sound.js` - soundtrack menu, gry i poscigu.
- `css/boss-rush.css` - ekran ladowania i przycisk nowego trybu.
- W konsoli F2 mozna uruchomic test: `bossrush`. Uzycie komendy oznacza runde testowa, bez uczciwego wyniku.

## Testy
- 100 generowanych map: sprawdzone przejscia, cele i odciecie kolejnej strefy przed otwarciem bramy.
- 22 testy funkcjonalne: odblokowanie, bezpieczne pokoje, sloty, brak regeneracji HP, bramy, zwyciestwo.
- Kontrola skladni JS, osadzenia plikow MP3 i kompletnego HTML.
- Native WebGPU NIE bylo dostepne w srodowisku testowym, wiec koncowy wyglad shaderow i rendering modeli na fizycznym GPU wymagaja jeszcze testu na komputerze z WebGPU.

## Poprawka 1.4.1: unlock all

Komenda F2 `unlock all` odblokowuje teraz rowniez BOSS RUSH oraz zapisuje `catroomsBossRushUnlocked=1` w localStorage. Przycisk BOSS RUSH jest widoczny w zakladce GRAJ niezaleznie od wybranego trybu NORMAL/HARD, ale sam tryb BOSS RUSH wciaz ma zasady HARD. Naturalne odblokowanie po pieciu ukonczonych etapach HARD nadal dziala. W starszej wersji 1.4 mozna uruchomic testowy Boss Rush komenda `bossrush`.
