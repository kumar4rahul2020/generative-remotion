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
| 5. Build | approved storyboard.md | Remotion composition + scene components | Claude Code, directly |
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
│       ├── timestamps.json       # from whisper.cpp alignment (done)
│       ├── visual-notes.md       # per-project visual expectation input (done)
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
