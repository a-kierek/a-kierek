# THE CATROOMS v1.5.2

- Imported the user-provided pixel heart and drumstick icons into the health and stamina bars.
- Reduced safe-room slot machine to 78%, campfire to 68%, Christmas tree to 64%; reduced chair pieces by roughly 40-45%. Updated cabinet collision bounds.
- Completely removed the pause-menu admin console button and its event listener. F2 remains available as a developer shortcut.
- Removed decoy drops from every map, Q input and mobile decoy button, and decoy AI/gameplay handling. Replaced decoy pickups with energy drinks or protective shields.
- Translated UI, menu, pause screen, game messages and level mechanics into English, preserving proper names.
- The single-file HTML embeds assets for offline play; source ZIP is more convenient for GitHub Pages.

Checks: JavaScript syntax verification and 7 map generator checks, including all objectives, safe rooms, 3 poster selections, zero decoy pickups. Graphics rendering must be tested on a real WebGPU adapter.
