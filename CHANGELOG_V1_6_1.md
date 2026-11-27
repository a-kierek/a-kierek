# v1.6.1 REFORGED

## Added
- Real rock mesh and base-color texture converted from the supplied GLB (5,144 triangles); same tile collisions, fixed world yaw and frustum culling.
- Supplied metal crack (reactor emergency and Level 3 system events).
- Release notes once per version, accessible again via lower-right menu button; persistent localStorage acknowledgement.
- One-second rising-edge detection alert with supplied PNG and yellow glow; all modes.

## Modified
- Menu music loops and attempts playback at title startup; retry on user gesture if autoplay blocked.
- Supplied plasm_3.png on all existing hazard decals (natural and champion trails); unchanged damage and footprint.
- Battery HUD icon from supplied SVG; world battery pickup unchanged.
- Pickup and coin pickup volume .33 -> .16; fallback .12 -> .06.
- English names of five levels, BOSS RUSH label, subtle REFORGED! pulse.
- M toggles map detail panel with level and detection status alongside clock; ordinary minimap and hold-to-expand preserved.

## Removed
- Menu blood splatter (handprint retained), renderer/archive footer text, permanent detection/level labels from HUD, 2D rock art.

## Fixed
- Version badge scoped to menu only; conflicting full-width HUD styling removed.
- Audio autoplay failure no longer retried every frame.
- Shared mesh depth test for transparent billboards, so rock and room models can occlude sprites without disturbing their back-to-front blending.

## Limitations
- Visual GPU rendering needs player verification; rock uses base-color and existing lighting, not GLB normal/emissive maps.
- Browser autoplay policy cannot be bypassed.
