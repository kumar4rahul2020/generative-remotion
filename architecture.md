# Architecture

Companion to [intent.md](intent.md). Intent.md says *why* and *what*; this
says *how the pieces fit together* — pipeline stages, tooling, artifacts, and
repo layout — based on the decisions made so far. It should evolve as the
first project (`fde-part1`) proves things out, not be treated as fixed
up front.

## Toolchain: single Node/Remotion stack

Everything lives in one npm-managed toolchain — no Python, no second runtime.
Concretely:

- **Video**: [Remotion](https://www.remotion.dev/) (React + TypeScript).
- **Transcription/alignment**: `@remotion/install-whisper-cpp` +
  `@remotion/whisper-cpp` — Remotion's official wrapper around whisper.cpp,
  chosen specifically so alignment output (word/segment timestamps) comes in
  a shape meant to drive Remotion timing, and so there's no separate Python
  environment to manage for one step.
- Everything downstream (storyboard data, scene components, rendering) is
  TypeScript/React inside the same Remotion project.
- **Audio via Git LFS**: `.wav` files are tracked through Git LFS, not
  plain git. Narration gets re-recorded/updated (already happened once for
  fde-part1), and each version is 50MB+ — plain git would keep every past
  version as a full blob forever. LFS keeps that cost out of normal clones.

## LLM allocation: Claude Code drafts directly (no scripted API in the loop)

Originally the plan (first Gemini, then OpenAI) was to route storyboard and
code generation through a cheap scripted API, with Claude Code reserved for
review/fixes — treating those stages as bulk/mechanical work not worth
Claude Code's metered tokens.

**Revised, after seeing the first storyboard draft in practice**: that
assumption was wrong for this pipeline. The OpenAI-drafted storyboard
defaulted to one generic diagram pattern ("nodes appear and connect") across
most scenes regardless of what the content actually was — because matching
diagram *type* to content shape (a pipeline for RAG's mechanics, containment
rings for a security perimeter, a balance scale for an ROI question, a
split-panel for two parallel categories) is exactly the judgment call, not
mechanical output. Getting a usable result meant Claude Code redoing most of
the creative work anyway during "review."

So: **visual/diagram judgment is the actual hard problem this tool exists to
solve** — not a bulk step to route around. Claude Code now drafts both the
storyboard and the Remotion scene code directly; the OpenAI API is no longer
used in this pipeline.

| Stage | Who does it |
|---|---|
| 3. Storyboard proposal | Claude Code, directly (script + timestamps + visual notes → draft storyboard.md) |
| 4. Review & revise | Claude Code + me, conversational |
| 5. Build (storyboard → Remotion code) | Claude Code, directly |
| 6/7. Render & review | mechanical (Remotion CLI), me watching the actual video |

The `openai` npm package and `remotion/scripts/storyboard.ts` (the scripted
first-draft caller) are removed as dead weight now that this path isn't
used. The mechanical part that script also did — matching a scene's cue
words against `timestamps.json` to get real start/end times — is still
useful and still happens, just as a direct step Claude Code does per scene
rather than a formal reusable script (no reason to maintain an abstraction
for something done by hand each time).

## No agent framework

The pipeline is still **linear with explicit human checkpoints** — script →
timestamps → storyboard → code → render — even with Claude Code doing more
of the direct work. It isn't a dynamic agent that needs to branch, loop, or
choose which tool to call next. An orchestration framework like LangGraph
would still be the wrong shape here — solving for cyclic, dynamically-routed
control flow this pipeline doesn't have. That conclusion doesn't change with
who does the drafting.

## Pipeline stages → artifacts

Each stage in intent.md's pipeline produces a concrete artifact. Nothing
becomes Remotion code until the storyboard artifact is reviewed and approved.

| Stage | Input | Output artifact | Tool |
|---|---|---|---|
| 1. Intake | recorded narration + script.md + freeform visual notes | raw project folder | — |
| 2. Alignment | narration audio | `timestamps.json` (word/segment-level) | `@remotion/whisper-cpp` |
| 3. Storyboard proposal | script + timestamps + visual notes | `storyboard.md` (human-readable plan, per scene: text, visual treatment, start/end time) | Claude Code, directly |
| 4. Review & revise | storyboard.md + my feedback | updated `storyboard.md` | Claude Code |
| 5. Build | approved storyboard.md | Remotion composition + scene components, built in sequential chunks (see below) | Claude Code, directly |
| 6. Render & review | Remotion composition | preview `.mp4` **per chunk** | Remotion render |
| 7. Final render | every chunk approved | final `.mp4` | Remotion render |

The storyboard is deliberately a plain document (not code) so step 4 stays
cheap — reordering or rewording a scene in a markdown/JSON file costs nothing
compared to reworking Remotion components.

## Build stage: sequential chunks, not scene-by-scene or all-at-once

Chunk boundaries start from the storyboard's map-return joints (fde-part1's
storyboard defines: empty-map reveal, stops 1–3→Joint 1, stop 4→Joint 2,
stop 5→Joint 3, stop 6→payoff→outro) — not individual scenes (too granular
to review meaningfully) and not the whole video (loses the ability to catch
a problem before it compounds into later chunks). **But a map joint is a
visual pacing point, not guaranteed to be where an argument resolves** —
Chunk 2 was caught ending mid-argument at Joint 1 (a framework introduced
and applied, but never shown paying off) and had to be extended through
Stop 4/Joint 2 to actually complete a thought. Check each chunk's semantic
completeness explicitly before treating a joint as its boundary — see
`build-state.md`'s chunk plan for the concrete adjustment.

**Why sequential, not parallel**: this only works sequentially. In the
continuous-canvas model, a chunk's starting camera position/scale and which
objects exist is *defined by* the previous chunk's actual ending state.
Building chunks in parallel would mean guessing at that handoff before it's
known — the alternative (freezing an exact handoff contract up front) would
mean making the creative call blind, before anything's been seen rendered,
which defeats the reason Claude Code drafts directly in the first place.

**Per-chunk artifacts**:
- A rendered `.mp4` clip for that chunk, **with the real narration audio
  baked in** (not silent) — a silent preview can't show whether a visual
  beat actually lands with the spoken word it's timed to, which is the
  entire point of aligning to real timestamps. Sent for review, not just
  described in text (see intent.md's per-chunk rendering rationale).
- A short **handoff-state note** appended to `projects/<name>/build-state.md`
  once the chunk is approved: exact camera position/scale, what's on screen,
  what's dim vs. lit. This is what the next chunk's starting state is taken
  from — a documented fact, not memory.

**Audio in chunk renders**: Remotion's `<Audio>` component, `src`d via
`staticFile()`, trimmed per chunk with `trimBefore`/`trimAfter` (frame
numbers matching that chunk's real start/end in the narration — same numbers
already used for scene timing). Remotion's bundler doesn't follow symlinks
into `public/`, so `scripts/align.ts` keeps a **real copy** synced to
`remotion/public/audio/<project>-narration.wav` every time alignment runs —
re-running alignment after a re-recording keeps it current automatically,
rather than relying on remembering a manual copy step.

A chunk is a commit. If a chunk goes the wrong direction, reverting it
doesn't touch anything before or after it.

## Tempo: 1.3x, pitch-corrected

Locked in for Chunk 1 after live-testing via the HTML prototype's tempo
slider (bound to `audio.playbackRate`) — narration plays 30% faster
throughout, pitch-corrected, not just visual pacing tightened. Real
runtime shrinks accordingly (Chunk 1: ~96s → ~74s).

**Why this doesn't require re-running whisper**: `atempo` is a uniform
linear time compression, so every existing timestamp simply divides by the
rate — `remotion/scripts/apply-tempo.ts <project> <rate>` does exactly
that: speeds up `narration.wav` into `narration-<rate>x.wav` via ffmpeg's
`atempo` filter, and writes `timestamps-<rate>x.json` with every
`startMs`/`endMs` divided by the rate. Same public-copy-sync convention as
`align.ts`.

Applied for Chunk 1; the expected default for future chunks unless a
later review decides otherwise (it's a project-wide narration property,
not naturally a per-chunk one — re-litigate at the next chunk's checkpoint
if it stops feeling right, but don't assume it silently carries or
silently doesn't).

## Visual-design prototyping: plain HTML before Remotion

For a new visual *direction* (not a tweak to an approved one) — e.g.
evaluating an editorial/Vox-style treatment against the current
diagram-and-map approach — design it first as a **plain, standalone HTML/CSS/JS
file** under `remotion/prototypes/<name>/`, not as a Remotion component.

Why: Remotion requires state to be a deterministic function of frame number,
which is the right constraint for final rendering but a slower loop for
purely visual iteration — every change needs a render before it can be seen.
A plain HTML file animates live in a browser with zero build/render step,
and can embed a real trimmed clip of the actual narration (a plain audio
file referenced normally, not inlined) so the visual can be checked against
real speech immediately.

The animation logic is still written as `state = f(currentTime)` (reading
`audio.currentTime` each frame) — the same principle Remotion's
`useCurrentFrame()` + `interpolate()` follows — so once a direction is
approved, porting it into a real Remotion component is a mechanical
translation of already-validated logic, not a redesign.

These prototypes are plain files (HTML, CSS, JS, a small audio clip) — no
build step, editable directly in any text editor and previewable by just
opening the file in a browser. Not part of the Remotion build (nothing under
`prototypes/` is imported by `src/`), and never rendered into the final
video themselves.

## Shared style layer (persistent brand)

The white-on-black minimalist baseline from intent.md is implemented once,
shared across all video projects, not restated per project:

- **Design tokens**: color palette (white/black + minimal accents), type
  scale, spacing — one source of truth.
- **Motion primitives**: a small set of restrained, reusable animation
  patterns (fade/rise, reveal, cut) that all scene components draw from,
  keeping motion language consistent instead of ad hoc per scene.

Per-project visual input tunes *within* this layer (pacing, emphasis) rather
than redefining it — consistent with the "no fallback aesthetic yet" decision.

## Reusable scene-component library

Not pre-built — intent.md's decision is that the first project determines
what's actually needed. Superseded twice already (diagram-only, then
map-first) before settling — current candidates, from the **Vox-style
approach locked in for Chunk 1** (see `visual-notes.md`):

- **Kinetic headline** (Archivo Black, huge, centered) — one per beat.
- **Annotated callout** — a short phrase with a live-drawn coral underline
  sweep, timed to when it's actually said. The core new mechanism; almost
  certainly reused every beat of every future chunk.
- **Flat topic icon** — simple line-art SVG, one per topic/phase.
- **Phase-progress dots** — position indicator, content-agnostic, directly
  reusable wherever a chunk has sequential beats.
- **Map node** (outline → filled) — still used for the Discovery-map
  ending, now styled flat/typographic to match rather than as a bordered
  diagram box.

Given the direction changed twice already after being "approved," these
still shouldn't be promoted into `remotion/src/components/` until they've
survived contact with a second real chunk, not just Chunk 1.

## Repository layout

Code and non-code artifacts are split: everything Remotion needs to compile
(shared style, shared/promoted components, per-project compositions) lives
inside the single Remotion project at `remotion/`; non-code project inputs
and pipeline artifacts (script, audio, timestamps, storyboard) live in
`projects/<name>/` at the repo root.

```
ProjectX/
├── intent.md                     # why + what
├── architecture.md               # this file — how it's built
├── projects/
│   └── fde-part1/
│       ├── script.md
│       ├── narration.wav         # LFS-tracked (see Toolchain)
│       ├── timestamps.json       # from whisper.cpp alignment (done, re-run after script/audio update)
│       ├── visual-notes.md       # per-project visual expectation input (done)
│       ├── storyboard.md         # reviewable plan — the step-4 artifact (approved)
│       └── build-state.md        # per-chunk handoff state, appended as each chunk is approved
├── .gitattributes                # Git LFS: *.wav
└── remotion/                     # single Remotion project (npm create-video scaffold)
    ├── package.json
    ├── scripts/
    │   └── align.ts              # whisper.cpp alignment (script + audio → timestamps.json)
    └── src/
        ├── Root.tsx              # registers compositions
        ├── style/                # shared brand: tokens + motion primitives (tokens.ts)
        ├── components/           # shared, promoted scene components (starts empty)
        └── projects/
            └── fde-part1/        # this video's composition + project-specific scenes
```

One Remotion project overall — one `package.json`, one `node_modules`. Each
video is a composition under `remotion/src/projects/<name>/`, importing
shared tokens/components from `remotion/src/style` and
`remotion/src/components`. Project-specific scene components live next to
the project until they've proven reusable (per the "reusable scene-component
library" section above), then move up to `remotion/src/components/`.

## Review checkpoints (where I'm in the loop)

Matches intent.md, revised after the fde-part1 build-planning discussion:
**after the storyboard** (step 3→4) and **after every rendered build chunk**
(step 5→6, repeated per chunk) — not just once at the end. Running
whisper.cpp and matching cues to timestamps stay mechanical, no checkpoint
needed.

Per-chunk review isn't extra caution, it's required by the continuous-canvas
model: a chunk's starting state is only a known fact once the previous
chunk's actual render has been seen, not before (see "Build stage" above).
It also solves a separate problem — past a certain length, text descriptions
stop being precise enough to point at what's wrong in a specific frame.
Feedback anchors to the actual rendered clip (and specific frame numbers,
scrubbable in Remotion Studio) instead of prose.

## Open / to validate with fde-part1

- ~~Whether `storyboard.md` as plain markdown is expressive enough~~ —
  **resolved**: plain markdown with per-scene headers held up fine across
  two full rewrites (diagram-variety pass, map-first restructure). No need
  for YAML frontmatter or added structure.
- Whether one Remotion project is the right shape once there are 4 parts, or
  whether each part deserves more isolation.
- Whether the chunked-build/`build-state.md` approach (new, untested) is the
  right grain — will only really know after the first chunk or two.
