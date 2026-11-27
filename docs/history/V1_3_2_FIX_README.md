# THE CATROOMS v1.3.2 — automat odsunięty od ściany

Model retro_slot_machine został odsunięty od ściany w każdym generowanym bezpiecznym pokoju NORMAL/HARD/proceduralnym. W `js/gameplay/safe-room.js` zmieniono `machineWallOffset` z 0.72 na 1.12. Ta sama pozycja jest wykorzystywana przez model WebGPU, kolizję, podpowiedź interakcji i automat do losowań. Nie zmieniano nagród ani ustawień AI.

Wygeneruj pojedynczy HTML: `python tools/build_standalone.py`.
