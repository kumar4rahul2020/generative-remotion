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

## LLM allocation: Gemini (scripted) vs Claude Code (interactive)

Claude Code tokens are a metered, limited resource; the Gemini API is
available and comparatively cheap. So the two aren't interchangeable
options — they're split by role:

- **Gemini API — bulk/mechanical first-draft generation, run as a script,
  outside this conversation.** No judgment required to produce a draft, so
  no reason to spend Claude Code tokens on it.
- **Claude Code (interactive) — review, refinement, and debugging.** Reserved
  for the parts of the pipeline that already require human-in-the-loop
  judgment per intent.md — i.e. it does less *volume* of work, but the parts
  that actually need taste.

Mapped onto the pipeline stages:

| Stage | Who does the first pass | Who reviews |
|---|---|---|
| 3. Storyboard proposal | **Gemini** (scripted call: script + timestamps + visual notes → draft storyboard.md) | Claude Code, with me |
| 4. Review & revise | — (this stage *is* the review) | Claude Code + me, conversational |
| 5. Build (storyboard → Remotion code) | **Gemini** (scripted call: approved storyboard → first-draft scene components) | Claude Code fixes/debugs what doesn't render right |
| 6/7. Render & review | mechanical (Remotion CLI) | me, watching the actual video |

Net effect: Gemini produces volume, Claude Code spends its budget on
judgment calls and fixing what Gemini gets wrong — not on generating first
drafts from scratch.

## SDK, not an agent framework

The pipeline above is **linear with explicit human checkpoints** — script →
timestamps → storyboard → code → render, each stage consuming the previous
stage's artifact. It isn't a dynamic agent that needs to branch, loop, or
choose which tool to call next; the "next step" is always already known from
architecture.md's stage table.

That makes an orchestration framework like LangGraph the wrong shape here —
it solves for cyclic, dynamically-routed multi-agent control flow, none of
which this pipeline needs. Reaching for it would be exactly the premature
abstraction intent.md warns against.

**Chosen: `@google/genai`** — Google's official Node/TS SDK. Plain scripted
calls, one per pipeline stage, matching the stage table above. Stays inside
the existing Node/Remotion toolchain (no new runtime, consistent with the
whisper.cpp-over-Python decision already made). Revisit only if a real need
for branching/dynamic tool-choice shows up — not before.

## Pipeline stages → artifacts

Each stage in intent.md's pipeline produces a concrete artifact. Nothing
becomes Remotion code until the storyboard artifact is reviewed and approved.

| Stage | Input | Output artifact | Tool |
|---|---|---|---|
| 1. Intake | recorded narration + script.md + freeform visual notes | raw project folder | — |
| 2. Alignment | narration audio | `timestamps.json` (word/segment-level) | `@remotion/whisper-cpp` |
| 3. Storyboard proposal | script + timestamps + visual notes | `storyboard.md` (human-readable plan, per scene: text, visual treatment, start/end time) | Gemini (draft) → Claude Code (review) |
| 4. Review & revise | storyboard.md + my feedback | updated `storyboard.md` | Claude Code |
| 5. Build | approved storyboard.md | Remotion composition + scene components | Gemini (draft) → Claude Code (fix/debug) |
| 6. Render & review | Remotion composition | preview `.mp4` | Remotion render |
| 7. Final render | approved preview | final `.mp4` | Remotion render |

The storyboard is deliberately a plain document (not code) so step 4 stays
cheap — reordering or rewording a scene in a markdown/JSON file costs nothing
compared to reworking Remotion components.

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
what's actually needed. From the script analysis so far, `fde-part1` is
already expected to need:

- **Title/intro card**
- **Phase-breakdown diagram** (Capability → Reliability → Security →
  Scalability progression)
- **Quote/callout card** (the CTO's question)
- **Bullet reveal** (business metrics, constraints, latency/cost/security/
  adoption points)

These get built as project-specific scenes first; only get promoted into the
shared component library once they're proven and reused (this is a 4-part
series, so reuse across parts 2–4 is the expected forcing function, not
speculative).

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
│       ├── narration.wav
│       ├── timestamps.json       # from whisper.cpp alignment (pending)
│       └── storyboard.md         # reviewable plan — the step-4 artifact (pending)
└── remotion/                     # single Remotion project (npm create-video scaffold)
    ├── package.json
    └── src/
        ├── Root.tsx              # registers compositions
        ├── style/                # shared brand: tokens + motion primitives
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

Matches intent.md: **after the storyboard** (step 3→4) and **after the
rendered preview** (step 6). Everything else — running whisper.cpp,
scaffolding Remotion components from an approved storyboard — is mechanical
and doesn't need a checkpoint of its own.

## Open / to validate with fde-part1

- Whether `storyboard.md` as plain markdown is expressive enough, or whether
  it needs light structure (e.g. YAML frontmatter per scene for start/end
  time) to stay unambiguous when it's handed off to the build step.
- Whether one Remotion project is the right shape once there are 4 parts, or
  whether each part deserves more isolation.
