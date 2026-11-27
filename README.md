# THE CATROOMS v1.6.2.4 REFORGED

Based on v1.6.2.3. See `CHANGELOG_V1_6_2_4.md`. The original GLBs are not required to play; use `python tools/import_decor.py /path/to/models` to regenerate the environment meshes.

- Offline: open `THE_CATROOMS_V1_6_2_4.html` in current Chrome or Edge with WebGPU.
- Source: extract the whole ZIP into a fresh folder, stop the previous server and run `START_HOST_WINDOWS.bat` or `node server/server.js`. Open http://localhost:8765; `/health` reports `version: 1.6.2.4`.
- Build: `python tools/build_standalone.py`. Checks: `python tools/check_release.py` (optional `--browser` uses mocked GPU).
- Save keys are unchanged; different local HTML paths may have separate browser storage. CO-OP remains disabled.
- Menu autoplay is subject to browser policy; the first click or keypress retries it without interrupting the loop.

## Alpha 1 checkpoint 05
See `docs/alpha1-checkpoint-05.md` for camera, lighting, controls and test limitations.

## Alpha 1 checkpoint 07
See `docs/alpha1-checkpoint-07.md` for the flashlight, randomized decor, controls and test limitations.

## Alpha 1 checkpoint 08
See `docs/alpha1-checkpoint-08.md` for the internal HDR pipeline, F4 controls, exposure and test limitations.

## Alpha 1 checkpoint 08 hotfix
See `docs/alpha1-checkpoint-08-hotfix.md` for light visibility fixes and limitations.

## Alpha 1 checkpoint 09
See `docs/alpha1-checkpoint-09.md`.
