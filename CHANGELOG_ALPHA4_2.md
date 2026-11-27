# Alpha 4.2 – HTTP startup hotfix

Reported error: HTTP 404 for custom-mode.js, then ReferenceError customGameConfig in begin(). The supplied Alpha 4.1 ZIP did contain the source file, so the underlying reason for the user's HTTP 404 (incomplete extraction, old server root or another cause) is not confirmed.

- Online index now loads a generated ordered game.bundle.js and separate boot.js, with release-specific query strings. The bundle includes Custom Game and Boss Rush. Offline and online builds derive from the same tools/script-order.json manifest.
- Custom Game defaults live in core/state.js. Ordinary level starts no longer read the Custom Game stage. All Custom Game functions remain in their own source module.
- Boot rejects missing bundle/readiness flag or missing required mode functions before enabling the menu. Capturing error listener reports missing script URLs at startup.
- Server health endpoint identifies the release; favicon requests return 204. Browser's Windows powerPreference warning is not a fatal error and remains unchanged.
- No gameplay balance, assets, shaders or physics changes.

## Tests
All existing Node regression suites and assets.test.py passed. New startup.test.cjs passed. server_smoke.py started the actual packaged Node server on a fresh loopback port and verified all scripts, CSS, model files, favicon and health endpoint; bundle bytes match the ordered sources. browser_smoke.py ran the full offline HTML in Chromium with mocked WebGPU: cold and saved startup, 13 mode starts, pause, restart, transition cancellation, no page errors. Real Windows WebGPU and browser startup via the user's HTTP server remain unverified.

## Updating
Stop previous server, extract this entire ZIP to a fresh folder, then run START_HOST_WINDOWS.bat or `node server/server.js`. Check http://localhost:8765/health for version `1.6-alpha4.2`. If the port is occupied, stop the old server or set a different PORT. Do not overlay only index.html onto an old project. After editing source scripts, run `python tools/build_standalone.py` to rebuild both online bundle and standalone HTML. Do not edit generated game.bundle.js directly.
