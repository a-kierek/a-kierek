# v1.7 Alpha 1 / Checkpoint 04: Material System HD

Owner confirmed CP03's F8 activation and no obvious visual difference (expected). CP04 creates a separate HD albedo library shared by both terrain pipelines. No changes to maps, physics, enemy AI, progression or saves. The previous release label remains for compatibility.

- 12 original procedural RGB PNGs; four wall textures at 512x1024 and eight floor/ceiling textures at 512x512. Existing sector 3/5 material sharing remains unchanged; existing door and poster art is retained (resampled in HD atlas).
- Generator: `python tools/generate_hd_materials.py` (Pillow and NumPy); generated assets included, no generator needed to play. No third-party asset downloads.
- `js/graphics/materials.js` manages decoding, allocation, all mip levels, and upload. HD is selected by default if initialization succeeds. If initialization fails the original textures remain active. F9 toggles HD/classic during play, independent of F8, without rebuilding geometry. Runtime preference is not saved.
- Both shaders use explicit conservative texture LOD estimates. Classic textures still have one mip level, so their LOD clamps to zero. Legacy and experimental geometry share the same material binding revision. HD RGBA8 wall and floor arrays including mips consume approximately 42.7 MiB before driver overhead; original atlases are retained for comparison.
- This is albedo-only, not full PBR. Normal/roughness/metallic shading, improved lighting, anisotropic filtering, and floor/ceiling raster geometry remain pending. Procedural textures are temporary art; final realistic materials may be supplied in Alpha 2.
- Test real GPU: compare F9 twice at close and distant walls, then F8 and F9 in all combinations. Check floors, ceilings, doors, models, posters and several sectors. Report any artifacts and FPS at the same settings. Mock tests cannot validate actual WGSL compilation, rendered pixels, or GPU speed.
