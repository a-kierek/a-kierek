# THE CATROOMS — aktualizacja audio i pokoju bezpiecznego

- Widoczne napisy po polsku w grze sa zapisane bez polskich znakow diakrytycznych.
- Nowe dzwieki `assets/audio/coin-pickup.mp3` oraz `assets/audio/coin-slot.wav`.
- Menu odtwarza `assets/audio/menu-beep.mp3` podczas wyboru zakladek, trudnosci, poziomow, opcji ustawien oraz zmiany nicku.
- Bezpieczny pokoj powstaje przy dostepnym korytarzu. Generator szuka wiekszego pomieszczenia (11x11, 9x9 lub 7x7), a w ciasnych mapach moze uzyc 5x5, aby nie odcinac celow.
- Specjalny material scian, nieruchoma maszyna 3D przy scianie, krzeslo z elementow 3D, plakaty przytwierdzone do scian i ognisko z animacja plomienia.
- Meble i automat sa renderowane na GPU jako statyczne bryly przez sledzenie promieni w `js/graphics/webgpu.js`. Nie sa juz obrotowymi billboardami. Wciaz wymagane jest WebGPU.
- Jedno losowanie kosztuje 1 grosz. Szanse pozostaja niezmienione: zamrazacz 15%, spowalniacz 35%, brak nagrody 50%.

## Testy

Testy wykonane w przegladarce Chromium z symulowanym urzadzeniem WebGPU: uruchomienie gry i wszystkich 4 poziomow NORMAL i HARD, generowanie dostepnych pokojow, monet, stalej geometrii i automatow; trzy wyniki losowania. Sprawdzono tez skladnie JS. Brak testu shaderow na realnym adapterze WebGPU oraz dluzszej recznej rozgrywki.

## Wazne

To wersja rozwojowa. Klient WebGPU moze zachowywac sie roznie na starszych przegladarkach i telefonach; szczegolnie nowe bryly 3D sa zalezne od wsparcia shaderow WGSL.
