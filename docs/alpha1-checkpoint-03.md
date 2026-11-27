# v1.7 Alpha 1 – Checkpoint 03: World Geometry (experimental walls)

Checkpoint 02 was confirmed working by the project owner. CP03 adds an opt-in rasterized wall path without modifying the classic renderer or gameplay data. Press F8 during play to switch, and F8 again to return to classic. The default after reload is classic, and the menu remains classic. The old version label stays for build/save compatibility.

## Implementation

- `js/graphics/world-geometry.js`: generate triangles only on faces adjacent to visually open cells from the authoritative uploaded render grid. Tile 5 remains visually open; animated door openings use the same processed grid as classic. Outer bounds have virtual walls. Cache vertices by map upload revision, replace stale buffers, reuse the buffer each frame. No simulation/collision changes.
- `js/graphics/shaders/world-geometry.js`: same camera/near/far conventions as imported meshes. A depth-tested geometry pass writes wall distance, grid coordinates and wall axis into a half-float hit buffer. The alternate terrain fragment samples those hits instead of traversing the grid, retaining established wall textures, fog, decals, lighting approximation and gameplay screen effects. Floors, ceilings and furniture remain legacy shader paths. Imported models and billboards still use the shared linear distance target.
- Shader compilation and pipeline validation are checked separately from the classic renderer; if the experimental initialization fails, it stays disabled. `window.CatroomsTerrainExperiment` exposes `available`, `enabled`, `error`, and `wallTriangles` for diagnostics.
- Runtime resources for the experimental path are allocated only when first enabled. Menu continues to use classic.

## Limitations / acceptance

This is not a full rasterized world renderer. The floor/ceiling have not been converted to geometry; legacy floor depth and experimental wall coverage may differ around edges, and half-float hit depth may cause minor texture differences. PBR, shadows, geometry height variation, new textures and lighting are not included. Extra pass and geometry buffer mean performance may increase or decrease; no FPS claims. Browser mock cannot compile WGSL or verify pixels. Real GPU probe in the managed environment was blocked by browser administrator policy, so physical GPU validation is outstanding. Use Sector 1, switch F8 on/off in the same scene; compare walls, corners, doors, decorations, enemies, camera pitch/FOV and FPS at identical settings. If shader initialization fails report the console diagnostic; if visual artifacts appear, press F8 to return to classic. Do not expand the experiment until it passes visual validation.
