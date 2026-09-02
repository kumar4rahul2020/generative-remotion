# Visual expectation — fde-part1

Freeform visual-intent input for the storyboard stage (per intent.md /
architecture.md). Tunes within the persistent white-on-black minimalist
baseline — doesn't override it.

## Revision history

1. **Original**: diagram-driven, no on-screen text at all (see git history
   for the full original rules). Built and validated as
   `PhaseZoomPrototype.tsx` and the original `storyboard.md`.
2. **Superseded**: after building Chunk 1 in that style, the ~80s framework
   segment felt static and risked losing viewer attention before reaching
   any payoff — a real problem observed in the actual rendered chunk, not a
   preference change in the abstract.
3. **Current (locked for Chunk 1, expected default going forward)**: an
   editorial/Vox-style treatment. Validated first as a standalone HTML
   prototype (`remotion/prototypes/fde-part1-vox-preview/`) before being
   ported to Remotion — see architecture.md's "Visual-design prototyping"
   section for why that order.

## Core visual language (current)

**On-screen text is back, but as designed emphasis, not a transcript.**
The distinction that matters: Vox-style kinetic typography treats one
selected phrase or number as a graphic element (scaled up, annotated,
held) — it never restates the full sentence being spoken. A caption
track that mirrors speech word-for-word is still off-limits; a single
callout phrase ("BUSINESS METRICS & OPERATIONAL CONSTRAINTS") pulled from
the narration and treated typographically is the approved device.

Concretely, per beat:
- **A kinetic headline** (Archivo Black, huge, centered) names what the
  beat is about.
- **One annotated callout** — a short phrase, underlined live with a
  hand-drawn-style sweep timed to when it's actually said.
- **A flat icon** distinct per topic (magnifying glass, gear, shield,
  rocket, etc.) — simple line-art, not photographic.
- **A phase-progress indicator** (dots) shows position among beats —
  orientation only, never previews upcoming content.

**Every beat changes device.** The failure mode of the old approach
wasn't "no text," it was one long static hold — a new visual device
(headline, icon, callout, annotation) should land every few seconds, not
just at the start of a beat.

**Typography** (new, not in the original brand tokens): Archivo Black for
kinetic headlines, IBM Plex Sans for body/callouts, IBM Plex Mono for
technical labels (phase numbers, timecodes). Chosen for the
engineering-interview subject specifically — Plex was designed for
technical documentation.

**Two accent colors, each with one meaning, never mixed**: teal (`#4fd1c5`,
existing) means "the thing we're focused on right now" (e.g. Discovery,
once committed to). A new coral (`#ff6b4a`) means "annotation mark" —
used only for the live-drawn underline sweep, never for anything else.

**Tempo**: narration plays at **1.3x speed** (pitch-corrected), locked in
for Chunk 1 after testing live via the prototype's tempo knob. See
architecture.md and `remotion/scripts/apply-tempo.ts`.

## Implication for the scene-component library

Superseded again: the earlier diagram-component candidates (map node,
containment rings, split-panel, etc.) were designed for the no-text
approach and aren't necessarily wrong, but aren't what Chunk 1 is built
from. Current reusable candidates, from what Chunk 1 actually uses:
kinetic headline, annotated callout (the underline-sweep mechanism),
flat topic icon, phase-progress dots. The map-reveal ending (the 6-stop
Discovery map) is still used, now styled flat/typographic rather than as
bordered diagram nodes.
