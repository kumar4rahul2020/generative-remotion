# Visual expectation — fde-part1

Freeform visual-intent input for the storyboard stage (per intent.md /
architecture.md). Tunes within the persistent white-on-black minimalist
baseline — doesn't override it.

## Core constraint: diagram-driven, not text-driven

No caption-style or bullet-point text on screen restating the narration.
The script is dense, conceptual, and framework-heavy (the four-phase
interview model, JTBD, RAG) — the visual job is to **animate the structure
of these ideas as diagrams**, not to transcribe the audio into on-screen
text.

- **Allowed:** labels *inside* a diagram, where they name a structural
  element the diagram is depicting (e.g. a node labeled "Capability", an
  arrow labeled "RAG"). This is structural labeling, not caption text.
- **Not allowed:** paragraph text, bullet lists, or quote cards that restate
  or summarize what's being said — the narration carries that; the screen
  should not.
- **Not static:** diagrams should build/animate in sync with the narration
  (nodes appearing as concepts are introduced, connections drawing as
  relationships are explained, layouts shifting as the framework
  progresses) — not a single still diagram sitting on screen.

## Implication for the scene-type library

This shifts the earlier candidate scene types (title card, quote/callout
card, bullet reveal) away from text-forward components toward
**diagram/node-graph components**: animated node-and-connector systems,
shape/layout transitions, structural build-ups. The four-phase framework and
the RAG/JTBD concepts are the first real test of this.
