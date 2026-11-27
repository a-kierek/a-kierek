# THE CATROOMS · SOLO + USTAWIENIA

Tryb CO-OP jest **tymczasowo wyłączony**. Kod klienta `js/network/coop.js`, serwer
`server/server.js` i startery hosta pozostają w tej paczce, aby umożliwić jego
późniejsze włączenie. Flaga `COOP_ENABLED` w pliku sieciowym jest domyślnie `false`.
Nie da się utworzyć pokoju w tej wersji bez jawnej zmiany i ponownego przetestowania tej flagi.

## Ustawienia

- Menu główne lub pauza: **⚙ USTAWIENIA**. W grze jest też ikonka ⚙ w HUD.
- FOV 60–110°, czułość myszy 0.30–2.50×, czułość dotyku 0.55–1.90×.
- Głośność główna, efekty, głosy, ambient i jumpscare niezależnie 0–100%.
- Jakość renderowania 70% / 100% / 120% względem dotychczasowej rozdzielczości.
- Licznik FPS (próbkowanie klatek przez `requestAnimationFrame`).
- Preferencje zapisują się w `localStorage` konkretnej przeglądarki.

## Uruchamianie

Otwórz `THE_CATROOMS_SOLO_USTAWIENIA.html` (samodzielny plik) albo
`index.html` w projekcie z osobnymi assetami; można też umieścić projekt
na GitHub Pages. WebGPU działa, jeśli jest obsługiwane, inaczej stosowany
jest fallback Canvas2D. Panel ustawień i dźwięki są lokalne, nie wymagają serwera.

## CO-OP na przyszłość

Pliki serwera są zachowane do dalszych prac. Obecne przyciski łączenia są
ukryte i metody połączenia zablokowane, by działał wyłącznie tryb solo.

# THE CATROOMS · CO-OP WebGPU / Mobile 360°

**Nowość: sieciowy CO-OP na 2–4 osoby, host na jednym komputerze.**

## Uruchomienie multiplayer

Zacznij od pliku **`JAK_URUCHOMIC_COOP.md`** (dokładne instrukcje dla LAN, internetu i GitHub Pages).

Na komputerze hosta z Node.js uruchom `node server/server.js` albo `START_HOST_WINDOWS.bat`, następnie wejdź na `http://localhost:8765`, wybierz CO-OP i utwórz pokój. Znajomi w LAN wchodzą na adres IP hosta lub przez internet na bezpieczny adres tunelu HTTPS/WSS.

**Samo wrzucenie pliku HTML na GitHub Pages NIE uruchamia serwera multiplayer.** GitHub Pages pozostaje hostingiem klienta.

---

# THE CATROOMS — WebGPU edition

## Launch

- **Single-file/offline:** open `THE_CATROOMS_WEBGPU.html` in a modern browser.
- **Editable project:** open `The_Catrooms_Expanded/index.html` in a browser, or serve that folder via a local development server.
- Chrome or Edge with WebGPU enabled is recommended. The menu displays which backend is active.
- If WebGPU is unavailable, the project uses a Canvas2D compatibility renderer automatically. WebGPU is used for the 3D scene when supported; the minimap and HUD intentionally remain browser 2D UI.

## Rendering architecture

- `js/graphics/webgpu.js`: WebGPU initialization, WGSL ray-casting of wall/floor/ceiling textures, GPU floor decals, instanced sprites, wall-depth masking, soft lighting, fog and post-processing.
- `js/graphics/renderer-legacy.js`: Canvas2D fallback only, with the same source assets.
- `js/graphics/textures.js`: the original walls, floors, doors, interactables, characters and pickup source textures are retained.
- `assets/decals/blood-realistic.png`: replacement realistic transparent floor blood decal, rendered onto the actual floor in WebGPU.
- `assets/items/` and `assets/characters/`: same original images as the previous release.

## Marmur in Level 3

Older builds spawned Marmur (and some other guards) **inside non-walkable wall cells** after the map enlargement. `js/characters/ai.js` now uses `safeGuardSpawn()` to place every guard in a connected walkable cell and resets its path when stuck. The CPU navigation graph and combat behavior are unchanged otherwise. Capturing the player still ends the run instantly; the developer GOD mode is the only deliberate exception.


## Character voice lines and loss scream (audio update)

- **Szept** (listener): `assets/audio/voices/szept-jadymy-na-imielin.mp3`, `szept-nie-lubi-imielina.mp3`, `szept-vamos-polska.mp3`.
- **Błysk** (watcher): `assets/audio/voices/blysk-oni-gadaja.mp3`, `blysk-kurwy.mp3`, `blysk-pijany.mp3`.
- Both characters play their own three lines in rotating order with a randomized starting clip. Distance attenuation and wall muffling follow the same enemy-audio model as Marmur and CHRUM. Active lines do not overlap for an individual enemy.
- **Every defeat** (including toxic liquid) calls `playLossScream()` with `assets/audio/jumpscares/appear-scream-loud.wav`. The supplied sample is normalized **+10 dB** with about **3 dB peak headroom** and played at full in-game volume, independent of positional distance. The original recording is also retained as `appear-scream-original.wav`. This is a deliberately loud effect; turn headphone volume down before testing.
- The ordinary synthesized `playScare()` remains reserved for non-defeat warning events (for example a wrong reactor activation).
- The Sound toggle mutes the scream as well as the other effects.

## Other game features

The procedural generator now chooses a guaranteed floor spawn and avoids exit placements that split the dungeon. Tested with 75 fixed seeds.

HP, radioactive pools, Steve hurt sound, regenerating health, tutorial, admin F2 console, unlock all, win streak, procedural mode, CHRUM food can graphics, and the pre-existing audio stay enabled.

## Build the portable HTML

From the `The_Catrooms_Expanded/` folder:

```bash
python tools/build_standalone.py
```

The script creates `../THE_CATROOMS_WEBGPU.html` with all local images/audio/CSS/JavaScript embedded.

## QA and compatibility notes

The source JS passes `node --check`. Browser smoke tests exercise all five modes, F2/`unlock all`, all targets reachable from the player entry point, safe enemy spawn locations, Marmur patrol movement, and health damage/recovery. The WebGPU initialization, resource uploads and draw-command submission were smoke-tested with a simulated GPU device; the runtime available for these checks does **not** expose a real WebGPU adapter, so native shader compilation/rendering could not be independently verified here. To verify native rendering on your device, launch the game in WebGPU-capable Chrome/Edge and confirm the menu displays `WebGPU · GPU RAYCAST` (not `Tryb zgodności · Canvas2D`).


## Mobile controls (new)

- Left thumb: large analog joystick, full movement, dead zone.
- Right thumb: swipe the screen to look around. Horizontal look is unlimited (full 360°); vertical pitch is clamped to -75°..+75°.
- BIEG: hold to sprint; CICHO: tap to toggle crouch; E: interact; Q: throw decoy; LATARKA: flashlight; pause II.
- Mouse on desktop supports the same unlimited yaw and bounded vertical view.
- Mobile look sensitivity is adjustable in menu and pause settings.
- UI adapts to small landscape and portrait screens, including safe-area insets.
- Both WebGPU and Canvas fallback renderers share the same camera pitch.


## Najnowsza aktualizacja: HARD Kampania (2026-11-24)

Najważniejszy opis znajduje się w pliku [HARD_KAMPANIA_README.md](HARD_KAMPANIA_README.md). W menu wybierasz NORMAL lub HARD. HARD ma osobne poziomy 1–4, proceduralne mapy, championów, skały, naprawy reaktorów i ekwipunek aktywowanych przedmiotów. Zawarte mp3 pochodzą z przesłanych przez użytkownika plików. Stare informacje o jednym poziomie HARD mogą być nieaktualne.
