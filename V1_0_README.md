# THE CATROOMS v1.0 — aktualizacja

## Zmiany
- Typografia gry: font Upheaval dostarczony przez użytkownika, osadzony bezpośrednio w `css/pixel-menu.css` jako CSS `@font-face`.
- Oznaczenie `v1.0` w prawym dolnym rogu menu i gry.
- Menu: miniaturowe, powtarzane zabrudzenia z przesłanego zdjęcia krwi, z usuniętym jasnym tłem. Osobny odcisk dłoni.
- Dźwięk `assets/audio/menu-beep.mp3` podczas przejścia do sekcji GRAJ.
- Wspólny pikselowy styl interfejsu, menu pauzy, ustawień, akt i HUD-u.
- Monety: `assets/items/grosz.png`, losowo 5–12 na każdą mapę, znajdowane i podnoszone przy przejściu obok.
- Bezpieczny pokój z drzwiami i automatem. Po zamknięciu drzwi przeciwnicy nie mogą zobaczyć gracza wewnątrz, a ściany/drzwi fizycznie blokują drogę.
- Interakcja `E` (lub UŻYJ na telefonie): otwarcie/zamknięcie drzwi, uruchomienie automatu za 1 grosz.
- Jednoręki bandyta: 15% zamrażacz, 35% spowalniacz, 50% pusto; wypłata trafia do ekwipunku.
- Wylosowane urządzenia działają również na poziomach NORMAL.
- Komendy F2: `unlock all` dla NORMAL i HARD, `hard 1..4`, `level 1..9`, `hardseed NUMER [ETAP]`, `coins ILE`, `tp safe`, `tp exit`.

## Komendy testowe
- `unlock all` — odblokowuje wszystkie poziomy normalne i HARD.
- `hard 1`, `hard 2`, `hard 3`, `hard 4` — uruchamia etapy HARD.
- `coins 10` — przyznaje 10 groszy w aktualnym poziomie.
- `tp safe` — przenosi do bezpiecznego pokoju.
- `hardseed 12345 3` — uruchamia HARD 3 na wskazanym seedzie.

## Pliki do edycji
- `js/gameplay/safe-room.js` — pokoje, monety, automaty.
- `js/graphics/collectibles.js` — sprite automatu i monety.
- `css/v1-style.css` — wygląd całego UI.
- `css/pixel-menu.css` — wygląd menu oraz styl Upheaval.
- `js/ui/pixel-menu.js` — dźwięk GRAJ i losowe zabrudzenia.
- `js/admin/console.js` — komendy F2.

## Budowa jednego pliku
`python tools/build_standalone.py` z katalogu projektu.

## Ograniczenia
Gra używa WebGPU. Testy w środowisku programistycznym dotyczyły składni JavaScript, generatorów map i mechanik logicznych, nie rzeczywistej karty WebGPU. Bezpieczny pokój i automat trzeba sprawdzić w manualnej rozgrywce na urządzeniu z WebGPU.
