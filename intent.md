# Intent: Script + Visual Expectation → Video (Remotion)

## What this is

A personal tool that turns a **narration script** plus a **freeform description of
visual intent** into a finished video, built programmatically with
[Remotion](https://www.remotion.dev/).

This is not a template-filler. The goal is that I describe *what I want* and
*how it should feel*, and the tool (with Claude driving Remotion) figures out
*how to build it* — scenes, timing, layout, motion, typography, color. I stay
at the level of intent; Claude handles implementation.

## Why intent-based, not spec-based

I don't want to have to pre-decide exact layouts, pixel positions, easing
curves, or scene durations before I can start. That's implementation detail,
not intent. If I have to specify things that precisely up front, I've already
done the design work myself and the tool is just typing it in.

Instead:
- I bring a **script** (what's being said/narrated) and a **loose description
  of visual feel** (what it should look/feel like — mood, references, pacing,
  emphasis).
- Claude interprets that intent, proposes a concrete plan, and only writes
  Remotion code once I've signed off on the plan.
- Ambiguity is resolved by Claude asking or making a reasonable, revisable
  choice — not by making me specify everything upfront.

## Inputs

### 1. Script + recorded narration
The script is written first, but before any storyboarding happens, **I record
the narration myself** and hand over the audio file (plus the script text as
a reference transcript). Real delivery — pauses, emphasis, breath, pacing —
can't be reliably guessed from text alone, and I want the video to feel
authentically human, not TTS-paced. Scene timing is derived from the actual
audio (via transcription/alignment), not from estimated reading speed.

Order of operations: write script → record narration → hand off audio +
script → storyboard.

### 2. Visual expectation
Freeform natural language describing the intended look and feel — e.g. tone
("minimal, confident, a bit playful"), references ("like a Stripe product
page, but darker"), pacing ("fast cuts on the intro, slow down for the core
idea"), constraints ("no stock footage, text and shapes only"). This is
impressionistic on purpose — precision comes later, from Claude's plan, not
from me upfront.

## Pipeline (interactive co-creation, with review checkpoints)

1. **Intake** — I provide the recorded narration audio, the script as
   reference text, and a freeform visual expectation.
2. **Storyboard proposal** — Claude aligns the script to the audio (timestamps
   per line/beat) and breaks it into scenes based on natural pauses and topic
   shifts in the *actual recording*, proposing per scene: what's said, what's
   shown, how it's visually treated, and duration taken from the real audio.
   Presented as a reviewable plan, not code.
3. **Review & revise** — I give feedback on the storyboard (reorder, cut,
   change tone, change emphasis). Claude updates the plan. Repeat until the
   plan feels right. No Remotion code is written before this is approved.
4. **Build, in sequential chunks** — Claude implements the approved
   storyboard as a Remotion project, one chunk at a time (chunk boundaries
   are the storyboard's own joints/map-return points, not arbitrary). Each
   chunk is rendered to an actual clip and shown to me before the next chunk
   starts.
5. **Render & review, per chunk** — I watch the actual rendered clip, not
   just a text description — motion and timing read differently on screen
   than on paper, and as the video grows, prose descriptions stop being a
   precise enough way to point at what's off. Feedback can mean adjusting
   the storyboard (back to step 3) or tweaking the chunk just built (stay in
   step 4). Only once a chunk is approved does the next one start, since
   each chunk's starting camera/object state is a direct fact taken from
   how the previous chunk actually ended, not a guess.
6. **Final render** — Once every chunk is approved, render the final output.

Checkpoints exist at the storyboard stage and after every rendered chunk.
For the storyboard, it's because intent and execution are most likely to
have drifted apart there. For per-chunk rendering, it's structural, not
just caution: this tool builds one continuous canvas (objects persist and
transform across scene boundaries, per architecture.md), so a later chunk's
starting state is only known once the previous chunk has actually been seen
rendered — building ahead of that would mean guessing at a handoff instead
of using a fact.

## Visual style / brand

**Default aesthetic: minimalist, Apple-style.** White content on a black
background. Clean typography-led compositions, generous whitespace/negative
space, restrained motion (purposeful, not flashy), high contrast, no clutter.

This is the persistent baseline across projects, not something redefined per
video. Per-video "visual expectation" input should be treated as *tuning*
within this baseline (mood, pacing, emphasis) rather than a full restyle,
unless I explicitly say a project should break from it. As the tool matures,
this baseline should live as a shared style definition (fonts, color tokens,
motion primitives) that all projects import, rather than being restated each
time.

## Scope of video style

Primarily **explainer / motion graphics**: animated text, shapes, diagrams,
code snippets, icons — no live footage or talking-head video. Visual
storytelling is built from typography, motion, layout, and color, not from
filmed material.

## Design principles

- **Intent over specification.** I describe outcomes and feel; Claude figures
  out the mechanics. If I find myself specifying coordinates or frame
  numbers, something's gone wrong with the workflow.
- **Plan before code.** The storyboard is the contract I review — cheap to
  change. Remotion code is the expensive-to-change output — don't generate it
  until the plan is approved.
- **Show, don't just describe.** A rendered preview is part of the review
  loop, not an afterthought — some things (pacing, motion) can only be judged
  by watching.
- **Reusable building blocks.** Over time, favor building a small library of
  Remotion components/scene types (e.g. "title card", "bullet reveal",
  "diagram build-up") that Claude can compose, rather than writing every
  scene from scratch each time.
- **Personal tool, not a product.** Optimize for my own iteration speed and
  taste, not for generality, configurability, or other users.

## Resolved decisions

- **Scene-type library.** Not pre-designed. The first real project (script +
  recorded narration) determines what scene types are actually needed; the
  reusable library gets extracted from what that first build produces, not
  guessed at in advance.
- **Aesthetic fallback.** Revisited after seeing the first video's build in
  practice, as planned. The original no-text/diagram-only treatment
  produced a ~80s stretch that felt static and risked losing viewer
  attention — a concrete problem, not a preference change — so Chunk 1
  moved to an editorial/Vox-style treatment (kinetic typography as
  designed emphasis, annotation marks, flat icons; see
  `projects/fde-part1/visual-notes.md`). Still one baseline, not a
  per-project menu — white-on-black, restrained, typography-led all still
  hold — but "no on-screen text at all" is no longer part of that
  baseline's definition.

## Open questions (to resolve as the tool develops)

- What tooling handles script-to-audio alignment (word/line-level timestamps)
  so scene cuts can be derived from the real recording)? Not decided yet —
  worth investigating when the first recorded narration is ready to hand
  off (candidates to look at then: Whisper-based transcription with
  timestamps, or a dedicated forced-alignment tool).
