# Build state — fde-part1

Appended to after each build chunk is approved (per architecture.md's
"Build stage: sequential chunks"). Each entry is the **documented fact**
the next chunk's starting state is taken from — not memory, not assumption.

Chunk plan (from storyboard.md's joints):
1. Title → series framework → empty map reveal
2. Stops 1–3 → Joint 1 (map, 3/6 filled)
3. Stop 4 → Joint 2 (map, 4/6 filled)
4. Stop 5 → Joint 3 (map, 5/6 filled)
5. Stop 6 → payoff → closing → outro

---

## Chunk 1: title → framework → map reveal — LOCKED

**Design**: editorial/Vox-style (kinetic typography, annotated callouts,
flat icons, phase-progress dots) — supersedes the original diagram/map
treatment for this chunk. Validated as a standalone HTML prototype
(`remotion/prototypes/fde-part1-vox-preview/index.html`) before porting;
not yet ported to the real Remotion `Chunk1.tsx` as of this entry.

**Audio**: narration plays at **1.3x speed**, pitch-corrected —
`projects/fde-part1/narration-1.3x.wav` /
`projects/fde-part1/timestamps-1.3x.json`, generated via
`remotion/scripts/apply-tempo.ts fde-part1 1.3`. Chunk 1 real timeline is
now ~0s → ~73.8s (was ~0s → ~95.9s at 1x).

**Beats** (rescaled timestamps, 1.3x):
1. Title card — "GOOGLE FDE / INTERVIEW EXPERIENCE" — 0s → ~7.1s
2. "An easy-to-remember mental model" callout — ~7.1s → ~10.2s
3. Four-phase overview (boxes draw in) — ~10.2s → ~21.6s
4. Discovery beat (icon + 2 callouts: business metrics, golden Q&A pairs) — ~21.6s → ~39.5s
5. Capability & Reliability beat (icon + "edge cases" callout) — ~39.5s → ~50.5s
6. Security beat (icon + "secure perimeter" callout) — ~50.5s → ~62.2s
7. Production beat (icon + "prototype → production" callout) — ~62.2s → ~68.4s
8. Zoom into "DISCOVERY" (scale 1.25, not 1.8 — full-scale overflowed frame) — ~68.4s → ~70.9s
9. Map reveal, 6 nodes, flat/typographic style — ~70.9s → ~73.8s

**End state** (what Chunk 2 continues from): full 6-node Discovery map on
screen, all nodes empty/outline (none filled yet — filling starts at
Joint 1, after stops 1–3). Camera/world position: centered map layout,
matching `world.ts`'s `MAP_CENTER_X/Y` — **not yet re-validated against
the Vox visual style**, since the map ending in the prototype is
typographic (flat labeled blocks) rather than the bordered diagram nodes
`world.ts` currently defines. Reconcile `world.ts` during the Remotion
port.

**Not yet done**: port this prototype into `remotion/src/projects/fde-part1/Chunk1.tsx`,
replacing the current diagram-based implementation; reconcile `world.ts`'s
map-node styling with the flat Vox treatment.
