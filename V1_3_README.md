# THE CATROOMS v1.3 — OSTATNIE SPOTKANIE

Zmiany:
- Obrocono model GLB automatu 3D w bezpiecznym pokoju o 180 stopni. Front automatu jest skierowany od sciany do srodka pokoju.
- Dodano nowy 5. poziom kampanii NORMAL: **OSTATNIE SPOTKANIE** (wewnetrzne ID 10). Na mapie 61x61 niezaleznie poluja **CHRUM** i **NIEZNAJOMY** oparty na przeslanym zdjeciu. Sektor zawiera 8 celow, 3 panele, surowce, zagrozenia i bezpieczny pokoj z automatem.
- Dodano 5. etap HARD (wewnetrzne ID 11) z proceduralnym ukladem 97x97, championem CHRUM czerwonym oraz Nieznajomym szarym.
- Przejscie poziomu 4 odblokowuje 5. poziom w danym trybie trudnosci. Postepy NORMAL i HARD nadal sa rozdzielne.
- Zachowano osobny tryb proceduralny NORMAL (wewnetrzne ID 5), dotychczasowe poziomy, dzwieki, webgpu, mechanike HP, monety, bezpieczne pokoje i wylaczony kod CO-OP.
- W menu i dossier pojawia sie nowa postac, a w konsoli F2 dzialaja: `unlock all`, `hard 5`, `level 10` i `level 11`.

## Uwagi techniczne

Nowa postac: `assets/characters/nowy-przeciwnik.png`, z tlem usunietym przez segmentacje. Definicja postaci w `js/characters/actors.js`, wspolne AI w `js/characters/ai.js`, normalny etap w `js/maps/level5.js`, etap HARD w `js/gameplay/hard.js`.

Silnik pozostaje WebGPU-only. Testy logiki wykonano w Chromium bez natywnego adaptera WebGPU. Uwaga: trzeba sprawdzic koncowy shader, wyglad sprite'a i geometrie automatu na komputerze z dzialajacym WebGPU.

## Komendy

`unlock all` - odblokowuje wszystkie rozdzialy NORMAL i HARD. `level 10` - normalny 5. poziom; `hard 5` lub `level 11` - HARD 5.
