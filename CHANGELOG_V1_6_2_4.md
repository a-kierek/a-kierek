# THE CATROOMS v1.6.2.4 | Environment Update

- ADDED: all 14 supplied GLBs converted to CRM2 with original base-color materials; each sector has its own model pool, Last Encounter mixes all pools, Boss Rush uses the same sector rules.
- MODIFIED: shared 1920x1536 albedo atlas, material shading, subtle contact shadows, frustum/distance culling and pose reuse. Wall fixtures are shallow, floor props have conservative single-cell collisions. No full PBR.
- FIXED: the decoration placement algorithm only occupies redundant floor cells, preserving connectivity of each existing component. Spawn, objectives, pickups, doors, existing hazards and safe rooms excluded. Fewer props are allowed if a layout has no safe locations.
- REMOVED: no gameplay content removed; source GLBs remain outside the playable package.

See `docs/decor-assets.json` for source mapping and geometry counts. Real WebGPU visual performance must be tested on a physical GPU.
