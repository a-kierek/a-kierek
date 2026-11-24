# THE CATROOMS v1.2 - Modele GLB i dzwieki bezpiecznego pokoju

## Zmiany
- Uzyto oryginalnego modelu `low_poly_-_campfire_free_download.glb` zamiast prostej kostki plomienia/ogniska.
- Uzyto oryginalnego `retro_slot_machine.glb` zamiast uproszczonego automatu z prostopadloscianow.
- Oba modele sa renderowane jako **nieruchome siatki trojkatow** w osobnym przebiegu WebGPU z nakladaniem tekstury i zaslanianiem przez sciany. Nie sa sprite'ami podazajacymi za kamera.
- Przeniesiono ognisko i automat do ustawionych pozycji wewnatrz pokoju bezpiecznego. Automat nadal posiada kolizje i obsluguje interakcje za 1 grosz.
- W pokoju gra muzyka `lift-music.mp3`, ktora cichnie poza nim.
- Ognisko emituje zapetlony `campfire-crackle.mp3`, z glosnoscia malejaca wraz z odlegloscia; zamkniete drzwi dodatkowo tlumia dzwiek.
- Pauza, zakonczenie gry i wyciszenie zatrzymuja oba nagrania. Suwaki Ambient i Efekty kontroluja odpowiednie sciezki.
- Tryb NORMAL proceduralny (level 5) dostaje **zawsze** pokoj boczny 9x9, polaczony korytarzem z dostepna czescia mapy. Rozszerza to mape z 49x49 do 63x63 i usuwa problem z brakiem automatu.
- Wczesniejsza mechanika wygranych 15% zamrazacz, 35% spowalniacz, 50% nic zostala zachowana.

## Modele i konwersja
W `assets/models/` sa oryginalne GLB oraz pliki runtime `campfire-optimized.mesh`, `slot-optimized.mesh` i `slot-albedo.webp`.
W `js/graphics/model-data.js` sa osadzone kopie optymalizowanych siatek. Generuje je skrypt:

```bash
python tools/convert_models.py
```

Wykorzystuje on `numpy`, `trimesh` i `Pillow`. Zmodyfikowana siatka slot machine ma okolo 172 tys. trojkatow zamiast okolo 500 tys. w oryginale. Oryginalne GLB nie zostaly usuniete.

## Uruchomienie
- Z archiwum: otworz `index.html` na stronie HTTPS (np. GitHub Pages) z wlaczonym WebGPU.
- Wersja pojedynczego pliku: otworz `THE_CATROOMS_V1_2_MODELE_3D.html`.
- Przebudowa samodzielnego HTML: `python tools/build_standalone.py`.

## Testy
- Kontrola skladni JS.
- 160 seedow HARD i 80 map kampanii NORMAL: pokoj i 5-12 monet obecne.
- 100 seedow NORMAL procedural: pokoj 9x9 polaczony z mapa, slot i pozycje ogniska obecne.
- Test przegladarkowy z emulowanym WebGPU: menu i level 1 startuja, indexed draw dla obu siatek, level 5 generuje automat i ognisko, losowanie monety, dwa zapetlone audio, suwaki glosnosci i pauza bez bledow JS.

**Ograniczenie:** natywnego urzadzenia WebGPU nie udalo sie uruchomic w przegladarce testowej. Krotki test na prawdziwej karcie w Chrome/Edge jest potrzebny, by ostatecznie potwierdzic wyglad shaderow i wydajnosc.
