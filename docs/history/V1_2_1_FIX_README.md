# THE CATROOMS v1.2.1 - poprawka WebGPU

## Problem

WebGPU odrzucal shader `MODEL_WGSL` w pliku `js/graphics/webgpu.js`, poniewaz `light` zostalo zadeklarowane jako niemodyfikowalne `let`, a nastepnie bylo nadpisywane w specjalnym oswietleniu ogniska.

## Poprawka

Deklaracja `let light = clamp(...)` zostala zmieniona na `var light = clamp(...)` (linia ok. 360), zgodnie z WGSL. Wlasciwosc cieniowania i migotania ognia pozostala bez zmian.

## Testy

- Kontrola skladni wszystkich plikow JS przez Node.js.
- Sprawdzenie, ze w `MODEL_WGSL` zmienna `light` jest mutowalna.
- Regeneracja samodzielnego HTML z kodu zrodlowego i potwierdzenie, ze poprawka jest w nim osadzona.
- NIE wykonano testu natywnej kompilacji WebGPU na karcie graficznej. Srodowisko testowe nie udostepnia adaptera WebGPU i blokuje lokalne otwieranie strony w przegladarce.

## Uruchamianie

Otworz `THE_CATROOMS_V1_2_1_WEBGPU_FIX.html` w aktualnym Chrome lub Edge. Do edycji uzyj tego projektu i polecenia `python tools/build_standalone.py`.
