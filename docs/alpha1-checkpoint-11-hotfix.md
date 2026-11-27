# Alpha 1 Checkpoint 11 HOTFIX - Light & wall decor

- Shared classic and PBR lighting use a 4x4 fixture candidate window with a smooth 6–8 tile range fade. Fixtures have zero weight when entering/leaving the candidate set. Genuine hard wall/door shadows remain unchanged.
- Safe-room poster UVs follow the broad face of the actual thin box on either wall axis; edge faces render the frame instead of the stretched photo. Box lighting uses the actual ray entry face. Boss Rush posters now have a proper width.
- Flooded Complex benches and pipes (including other modes which reuse them) require adjacent full walls, are aligned to them, and retain existing collision/connectivity checks. Benches have a 0.015 tile gap; pipe backmost vertices touch the wall. No prop is forced into a location without a safe backing wall.
- Existing textures, PBR, HDR, settings and save keys are unchanged. More fixture candidates may increase GPU cost. Soft shadows and exact mesh collision are not included in this hotfix.

Automated tests: see alpha1-checkpoint-11-hotfix-tests.txt. The 4335 lamp continuity cases are CPU mathematical reference tests, not actual GPU shader runs. The map regression tests include 96 scenarios. Real GPU compilation, image quality and FPS still require hardware testing.
