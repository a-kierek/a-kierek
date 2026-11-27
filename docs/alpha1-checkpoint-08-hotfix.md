# Alpha 1 Checkpoint 08 Hotfix — light visibility

- Stop grid shadow traversal at the finite segment endpoint. Previously, exact grid-corner lights could cause mixed-quadrant rays to skip floor(source). Parallel axes no longer produce phantom crossings.
- Preserve an opaque flag (bit 8) in the GPU map for closed 3D model doors and exit cells, while terrain samples only the low byte and CPU geometry remains unchanged. Open doors clear the flag on world revision. Both flashlight and environmental lighting share this visibility traversal.
- Door occlusion is conservative whole-cell based on gameplay state, not animated leaf geometry. HDR parameters unchanged. Physical GPU validation remains necessary.
- Regression: 1080 directions toward exact grid-edge/corner sources, randomized visibility, door state upload, existing release checks.
