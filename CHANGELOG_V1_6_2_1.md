# THE CATROOMS v1.6.2.1 — Model Update

## Added
- Imported hospital_door.glb as a 740-triangle world mesh in Yellow Corridors (NORMAL, HARD, Custom with that theme, and the first Boss Rush safe room).
- Safe-room doors rotate on the hinge over 240 ms. Door open/closed collision and close-blocking checks remain authoritative in the existing grid.

## Modified
- Replaced the gambling machine in all safe rooms with slot_machine.glb: 1,968 triangles, 1,024 px base-color texture. Existing pose, footprint and lottery are retained.
- Yellow Corridors exit uses the same door model facing accessible sides, with a green completion cue; the original proximity-based exit condition remains intact. Other sectors retain their old door textures.
- Version and once-per-version What's New card updated to 1.6.2.1.

## Removed
- Previous slot geometry and albedo from the production assets. Original supplied GLBs are not duplicated in the runtime ZIP.

## Fixed / compatibility
- Mesh and raycast depth are shared with the existing mesh pipeline; only the renderer's copy of the replaced door tiles is cleared, never the authoritative collision map.
- Existing save keys and game logic are preserved.

## Limitations
- Door window uses opaque tinted material, not physically transparent glass. Imported slot uses base color rather than full PBR textures. Existing door collision toggles immediately on interaction, rather than following each intermediate animation position.
- The exit remains a completion trigger, not a traversable hinged door. Its ready state is tinted green.
- Test browser uses mocked WebGPU; final appearance and actual shader execution require testing on the player's GPU.

## Build
`python tools/import_hospital_models.py /path/slot_machine.glb /path/hospital_door.glb` regenerates imported assets, then `python tools/build_standalone.py` regenerates the HTML and bundle. Run `python tools/check_release.py --browser` for regressions and optional mocked-GPU integration.
