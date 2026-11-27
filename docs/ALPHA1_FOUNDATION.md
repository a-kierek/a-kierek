# THE CATROOMS v1.7 — Alpha 1 / checkpoint 01

Status: foundation refactor, NOT full Alpha 1. The in-game version and server protocol remain 1.6.2.4 deliberately. No change to the rendering algorithm or gameplay.

## Changes
- Terrain, sprite and mesh WGSL extracted into `js/graphics/shaders/terrain.js`, `sprites.js` and `mesh.js`. All three WGSL bodies were compared byte for byte with the uploaded original.
- `tools/script-order.json` remains the canonical build manifest. Both online bundle and standalone HTML regenerated from it.
- Updated mock GPU renderer test to load shader modules in manifest order; added shader module assembly regression test.

## Verification
- Original project: `python tools/check_release.py` passed.
- Checkpoint: `python tools/check_release.py` passed, including JS syntax, Node regression tests, assets and HTTP server checks.
- `python tests/browser_smoke.py` passed all 14 printed groups, including all 13 mode starts and simulated GPU loss. Chromium uses a GPU mock for this test. This is not actual shader compilation or an FPS benchmark.
- No physical GPU is exposed to the current environment; visual verification and FPS on RTX 5060 Ti are pending. No new PBR, lighting, shadow, geometry or post-processing features are claimed.

## Next planned engineering milestone
Define shared camera/depth/material contracts and a small geometry-rendered sector 1 test corridor behind an experimental flag, preserving the original raycaster as a comparison/fallback path. Validate occlusion and camera alignment before adding lighting, HDR or PBR. Assets may remain placeholders until Alpha 2.

## Run
Extract the source into a new folder. Run START_HOST_WINDOWS.bat or open the separately provided standalone HTML in a WebGPU-compatible browser. The checkpoint intentionally still identifies as v1.6.2.4 inside the game. Existing saves are not modified by this refactor; browser storage may differ by file path or origin. Keep the original release and backups.
