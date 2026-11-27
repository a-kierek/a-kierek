# THE CATROOMS v1.6.2a / Interface Overhaul (alpha)

## Added
- Engine-rendered landing corridor, terrain-only WebGPU pass at the existing 24 FPS menu cap, with isolated static map, slow looping camera and light flicker.
- Local profile: time, completed campaign sectors, deaths, collected coins (not remaining balance), wins, best streak, per-sector records, six achievements and unlocked content. New cumulative totals begin in this release; old records/unlock keys are unchanged. Custom runs contribute activity but not campaign records.
- Custom builder groups for generator, rules, enemies, items and modifiers; optional seed, initial drinks, optional loot, flashlight start and HARD emergencies. Save/load/delete up to 20 named local presets. Original enemy fallback (at least one Marmur if all counts are zero) retained.
- Pause restart; victory/death summaries with cause, time, items, coins, explored walkable area and new record.

## Modified
- Landing menu, separate sector selector and other menu panels, minimal HUD, pause and end screens using requested six-color palette. REFORGED! stays tilted and attached to title with existing pulse.
- Continue starts last or next unlocked campaign sector; no saved mid-run snapshot. First visit falls back to Normal 1.
- Short 150 ms UI transitions; terminal sounds, loading phase and subtle start glitch. Existing game music/graphics/audio and gameplay defaults retained. New release notes shown once and reopened via bottom-right button.
- Main menu runs terrain pass only when landing is visible; gameplay renderer unchanged except optional scene source and menu-specific light modulation. No new images or asset downloads.

## Removed
- Old full-screen red UI styling from updated screens, unnecessary HUD boxes, duplicate technical text; no sector preview images in this alpha. The existing blood handprint remains very faintly visible on landing.

## Fixed
- Legacy HARD/pig mode styles no longer override the minimalist HUD.
- Preset input validation; stats checkpointed during play and on round/menu exit, avoiding duplicate accounting across pause/resume.

## Testing and limitations
- Automated syntax, previous regression suites, real HTTP asset smoke, standalone build, full Chromium DOM with mocked WebGPU (13 modes, new menu selection, presets, profile, pause/end UI, mobile scrolling).
- Real GPU shader compilation/appearance and actual performance require player verification. A looping generated corridor is a dedicated preview, not a campaign map; menu render is capped at 24 FPS. Generation screen reports a phase rather than live percentage, because existing map generation is synchronous.
- Browser localStorage persists per origin. New offline filename may use separate storage; use the same HTTP origin to preserve existing browser data. CO-OP remains disabled.
- Existing CSS retained where needed for controls and overlays; new interface stylesheet replaces visual rules by scoped overrides. Full legacy CSS consolidation not performed in this alpha.
