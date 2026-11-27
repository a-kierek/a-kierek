# Alpha 4.1 - Startup hotfix

Reported symptom: loading screen displays `ReferenceError: bossRushVisible is not defined`.

The original distributed Alpha 4 HTML contains the function and the issue was not reproduced in the managed Chromium DOM harness. The exact client-side cause remains unconfirmed. This release makes the startup path more robust:

- Move the persistent Boss Rush unlock predicate and visibility function to `js/core/state.js`, next to progress storage, independent of the Boss Rush map implementation.
- Apply initial difficulty from `boot.js` only after loading all game scripts.
- Assemble all application definitions in one ordered script for standalone HTML, with boot retained as a separate strict-mode script. Preserve the first startup exception and display its line number; check required Boss Rush and mode registry definitions before initializing.
- Extend browser smoke tests to check the loading error state and the visibility of Boss Rush on clean and saved HARD profiles, using mocked storage for the latter.

Validation: all four Node regression suites, CRM2/sprite asset tests and the Chromium DOM smoke test passed, including all 13 mode IDs, pauses and restart during jumpscare. WebGPU is mocked. Direct file and HTTP navigation are blocked by the managed browser policy, so the reported local-file scenario and actual GPU rendering require user verification. No gameplay, textures, audio, models, save keys or balance changes.
