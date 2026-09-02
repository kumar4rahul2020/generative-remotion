# Build state — fde-part1

Appended to after each build chunk is approved (per architecture.md's
"Build stage: sequential chunks"). Each entry is the **documented fact**
the next chunk's starting state is taken from — not memory, not assumption.

Chunk plan (revised — originally cut at every map joint, per
storyboard.md; **Chunk 2 revised** to include Stop 4 after review showed
cutting at Joint 1 left the JTBD framework unresolved — question and
fears shown, but never the framework's actual output. Map joints are a
*visual* pacing structure, not guaranteed to align with where an argument
actually resolves; check this for each remaining chunk too, don't assume
joint = complete thought):
1. Title → series framework → empty map reveal
2. Stops 1–4 → Joint 2 (map, 4/6 filled) — **extended from the original
   Stops 1–3 → Joint 1** so the chunk completes an actual argument
   (question → framework → example → derived metrics/constraints),
   not just setup + unresolved tension
3. Stop 5 → Joint 3 (map, 5/6 filled)
4. Stop 6 → payoff → closing → outro

---

## Chunk 1: title → framework → map reveal — LOCKED, BUILT

**Design**: editorial/Vox-style (kinetic typography, annotated callouts,
flat icons, phase-progress dots) — supersedes the original diagram/map
treatment for this chunk. Validated as a standalone HTML prototype
(`remotion/prototypes/fde-part1-vox-preview/index.html`), then ported to
the real `remotion/src/projects/fde-part1/Chunk1.tsx` — the port held up
cleanly against spot-checked rendered frames, no bugs found beyond what
the prototype already caught.

**Camera/world system**: `Chunk1.tsx` does **not** use `world.ts`'s
camera/coordinate system — the validated Vox design never needed it
(simple opacity-based scene overlays, not a persistent zoomed world).
Only `world.ts`'s `seriesPhases`/`mapNodes` label data is imported.
`world.ts`'s camera machinery (`Camera` type, `cameraTransform`,
`PHASE_BOX_*`/`MAP_NODE_*` layout constants) is currently unused —
left in place, not deleted, in case a later stop returns to a
camera-driven approach.

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

**End state** (what Chunk 2 continues from): full 6-node Discovery map,
centered on screen (flex-row layout, not `world.ts` camera coordinates),
all nodes empty/outline styled as flat bordered blocks (border color
`colors.dim`, `IBM Plex Sans` labels) — none filled yet, filling starts at
Joint 1 after stops 1–3. No persistent camera/zoom state to hand off,
since this design doesn't use one — Chunk 2 starts fresh from a static
map, not from a specific camera position/scale.

**Resolved for Chunk 2**: Vox stays the design language throughout,
including any diagrams/graphs — e.g. the JTBD framework, the RAG
pipeline in later chunks — get built as Vox-style typographic/annotated
treatments, not a reversion to bordered node-graph diagrams. No mixing
of the two languages within the video.
