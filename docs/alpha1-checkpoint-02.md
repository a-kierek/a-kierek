# v1.7 Alpha 1 – Checkpoint 02: Camera & Depth Foundation

Checkpoint 01 was confirmed working by the project owner on a Ryzen 5 5600 / RTX 5060 Ti 8 GB / 32 GB RAM. This checkpoint preserves gameplay, assets, legacy raycasting and projection. It does not introduce full terrain geometry or new visual effects.

- `js/graphics/camera.js`: one camera snapshot per rendered gameplay frame (position, yaw, FOV plane, pitch, basis), used for sprite projection and mesh visibility. Plain-position debug callers remain supported.
- `js/graphics/shaders/shared.js`: shared 96-byte frame layout and depth constants; terrain, sprite and mesh shaders use one common WGSL frame declaration.
- Linear forward depth encoded in the terrain distance texture remains distinct from projected hardware depth. Existing near/far limits, wall distance scale, clipping thresholds and occlusion bias are unchanged.
- `tests/camera-depth.test.cjs`: shared ABI, camera snapshot stability and projection/depth math regression tests. Existing renderer and bundle tests updated for the new dependencies.
- Both online bundle and offline HTML regenerated with the canonical script manifest.

Version displayed in game remains v1.6.2.4 for compatibility with existing build and startup tests. The original ZIP and Checkpoint 01 remain unchanged. No real GPU rendering or performance guarantee; hardware validation remains necessary. Next: experimental terrain geometry behind a separate render path.
