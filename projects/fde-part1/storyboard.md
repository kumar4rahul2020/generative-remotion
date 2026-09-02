# Storyboard — fde-part1

**Review required before further Remotion code is written** — per architecture.md, this is a human checkpoint, not a rubber stamp.

## Visual philosophy: one continuous canvas

Per the decision in architecture.md (3Blue1Brown-style approach, prototyped
and validated in `PhaseZoomPrototype.tsx`): this is **not** 13 independent
diagrams cut one after another. It's one shared world; a camera pans and
zooms through it; objects don't disappear between scenes, they **transform
into** whatever comes next. A scene "boundary" below is a moment the camera
arrives somewhere or an object becomes something else — not a cut.

Two rules that make this hold together:

- **Color is a language, not decoration.** Once a color is assigned to a
  theme, it means that thing everywhere it reappears. Only "Capability"
  (this phase) gets a live accent color for this video — Reliability,
  Security, Scalability stay dim, since they belong to parts 2–4.
- **Every transition is an answer to "what does this object become?"**
  If a scene doesn't have one, that's a sign that it's actually a hard cut
  masquerading as a scene — and worth reconsidering.

## The world map (how objects carry through the whole video)

```
[4-phase row] --zoom+morph--> [CTO Question hub] --spokes retract, hub becomes frame--> [JTBD lens]
   (built, validated)             (built, validated)

[JTBD lens] --camera pushes through the frame--> [sales-rep icon scene]
[icon scene] --question marks emerge from the icons--> [rep's fears cluster]
[fears cluster] --camera pulls back, cluster resolves into scale--> [juice-vs-squeeze balance]
[balance] --the two pans separate and expand--> [metrics | constraints split-panel]
[split-panel] --panels shrink to a starting node, pipeline extends right--> [RAG pipeline: Query→Retrieval→Generation→Citation]
[pipeline] --same Query node forks into two race paths--> [manual vs RAG timing comparison]
[comparison] --winning path's pipeline gets enclosed--> [security perimeter rings around it]
[secured pipeline] --whole assembly shrinks to an icon--> [slides into CRM/browser window]
[embedded icon] --pulls back onto a path leading forward--> [prototyping path: Golden Set→Prototype→Proof]
[path's end] --camera pulls all the way back--> [4-phase row again, Capability now lit solid, others still dim — sets up parts 2-4]
```

That last beat (returning to the opening framework) is new versus the
previous draft — it bookends the video and makes "this is part 1 of 4" a
visual promise, not just a spoken line.

---

## Scene 1: Title

- **Time**: 00:00.140 → 00:08.080
- **Cue**: "Hi guys, welcome to this four-part"
- **Visual**: Series title fades in, centered, alone on black.
- **Transform into next**: Title dissolves outward/upward as the 4-phase row fades in at the same center point — the row inherits the title's screen position, so it reads as "the title *becomes* the framework," not a cut.

## Scene 2: The 4-phase framework

- **Time**: 00:08.080 → 00:48.630
- **Cue**: "In hindsight, I was able to break the"
- **Labels**: Capability, Reliability, Security, Scalability
- **Visual**: Four boxes draw in left to right, connected by a line. *(Built and validated in the prototype.)*
- **Transform into next**: Camera zooms into "Capability" specifically — the other three fade as the camera's focus leaves them behind, not because they're deleted.

## Scene 3: The CTO's question (hub-and-spoke)

- **Time**: 00:48.630 → 01:14.500
- **Cue**: "The first question is a CTO asks,"
- **Labels**: AI, Initial Conversation, Cost, Latency, Accuracy, Data
- **Visual**: The Capability box **morphs in place** into "CTO Question" (same box, label crossfades, border shifts from accent color to neutral white — it's no longer *the phase*, it's *what happens inside* the phase). Camera eases outward as 6 spokes extend radially. *(Built and validated in the prototype.)*
- **Transform into next**: Spokes retract back into the hub (reverse of how they extended); the hub box itself widens into a frame/rectangle — this becomes the JTBD lens. Nothing new enters; existing objects contract and reshape.

## Scene 4a: The JTBD lens

- **Time**: 01:14.500 → 01:32.590
- **Cue**: "So here goes the answer. Before building"
- **Labels**: Jobs to be Done, What's the problem?, Who's the user?, What does success look like?
- **Visual**: Inside the frame (the former hub), three questions reveal one at a time as a vertical stack, like items coming into focus through a lens.
- **Transform into next**: Camera pushes *forward through* the frame — the lens's border expands past the edges of the screen (a "walking through a doorway" push), which is how we cut to a concrete instance without it feeling like a cut.

## Scene 4b: The sales rep's problem

- **Time**: 01:32.590 → 02:15.760
- **Cue**: "To take an example, I explained with a sales representative scenario"
- **Visual**: Icon scene: call/hold icon, a stack of PDF pages with a magnifying glass scanning down through them, a clock ticking forward. No labels — physical dramatization of the problem.
- **Transform into next**: The icons stay on screen; new elements emerge *from* them (not a new scene wiping the old one).

## Scene 4c: The rep's fears

- **Time**: 02:15.760 → 02:32.240
- **Cue**: "However, they are afraid of some risk. They keep wondering, what if the AI gives me the"
- **Labels**: Wrong price?, How long on hold?, Sensitive data?, Switch screens?
- **Visual**: Question-mark nodes pop up one at a time, each visually tethered to the icon it worries about (the price fear near the PDF stack, the hold-time fear near the clock, etc.) — the one deliberate node-cluster in the video, because the content genuinely is a scattered list of distinct worries.
- **Transform into next**: Camera pulls back; the whole icon+worry cluster contracts into a single small shape that becomes one pan of a balance scale.

## Scene 4d: Is it worth it?

- **Time**: 02:32.240 → 02:47.950
- **Cue**: "That also will be explained in the CTO's concern, naturally, in which the CTO"
- **Labels**: Juice, Squeeze
- **Visual**: A balance scale — the rep's-problem cluster is now one pan ("Squeeze"/cost side), a second pan ("Juice"/payoff) rises into view opposite it. The scale tips as the CTO's doubt is voiced.
- **Transform into next**: The two pans detach from the scale's beam and slide apart, expanding into two full-height columns as they separate.

## Scene 5: Business metrics vs. constraints

- **Time**: 02:47.950 → 03:31.110
- **Cue**: "Deriving from these discovery questions,"
- **Labels**: Business Metrics, Operational Constraints, Handle Time, Close Rate, DAU, Cost-Benefit
- **Visual**: The two ex-scale-pans, now full columns: left "Business Metrics" fills with a list (Handle Time, Close Rate, DAU), right "Operational Constraints" fills in parallel.
- **Transform into next**: Both columns collapse back toward center into a single point — the seed for the pipeline that follows (the metrics/constraints *become* the requirement that the RAG pipeline is the answer to).

## Scene 6: The RAG pipeline

- **Time**: 03:31.110 → 04:40.630
- **Cue**: "Once we have had the product"
- **Labels**: Query, Retrieval, Generation, Citation
- **Visual**: From that collapsed point, a left-to-right pipeline extends: Query → Retrieval → Generation → Citation, each stage appearing in sequence with arrows — mirroring RAG's actual mechanics.
- **Transform into next**: The "Query" node duplicates/forks — one copy stays on the built pipeline, a second copy appears above/below starting a second, manual path. Same origin, two branches.

## Scene 7: Manual search vs. RAG (the race)

- **Time**: 04:40.630 → 05:05.700
- **Cue**: "Regarding wait time, a RAG system"
- **Labels**: Manual Search, RAG System
- **Visual**: Two paths race from the same Query point — the manual branch crawls (a slow-filling progress bar / long timer), the RAG branch (the pipeline just built) completes almost instantly. Direct, visual proof of the speed claim rather than a stated comparison.
- **Transform into next**: The manual branch fades out (it lost the race); the winning RAG pipeline remains, and containment rings begin drawing in around it from the outside edges of the screen.

## Scene 8: The security perimeter

- **Time**: 05:05.700 → 05:31.810
- **Cue**: "To address security, we have to mention"
- **Labels**: Public Internet, VPC / Private Endpoint, Enterprise Data
- **Visual**: Concentric rings draw in around the pipeline: outer "Public Internet" (crossed out), middle "VPC / Private Endpoint", inner ring containing the pipeline itself, now labeled implicitly as "Enterprise Data" — the system we've been building is shown living inside its own secure perimeter, not a separate diagram.
- **Transform into next**: The whole ringed assembly shrinks uniformly into a single small icon.

## Scene 9: Embedding into existing tools

- **Time**: 05:31.810 → 05:55.860
- **Cue**: "A tool would be useless if the"
- **Labels**: CRM, Browser Extension
- **Visual**: The shrunk icon slides toward and merges into a CRM window icon / browser bar that fades in beside it — dramatizing "never switch screens" as a literal merge.
- **Transform into next**: Camera pulls back further; the embedded icon becomes one dot on a path that extends forward.

## Scene 10: The prototyping path

- **Time**: 05:55.860 → 06:28.640
- **Cue**: "And at last, to conclude the"
- **Labels**: Golden Set of Queries, Rapid Prototype, Proof of Concept
- **Visual**: A path extends from the embedded-icon dot through three milestones in sequence.
- **Transform into next (video close)**: Camera pulls all the way back out — the path's endpoint resolves into the original 4-phase row from Scene 2. "Capability" now renders solid/complete in its accent color; Reliability, Security, Scalability remain dim outlines — the literal setup for parts 2–4.
