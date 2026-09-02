# Storyboard — fde-part1

**Review required before Remotion code is written** — per architecture.md, this is a human checkpoint, not a rubber stamp.

Rebuilt against the updated script.md and narration.wav (Sep 2 versions — the framework, content order, and closing section all changed from the previous draft). Timestamps below are re-resolved against the new `timestamps.json`.

## Visual philosophy: map-first, guided, one final takeaway

Two things this storyboard is now built around, per discussion:

1. **Takeaway over engagement.** The measure of success isn't "did they keep watching," it's "did they get something worth screenshotting." Continuous-canvas/camera-zoom (validated in `PhaseZoomPrototype.tsx`) is still the *mechanism*, but it now serves a **map-first, guided-return** structure rather than a pure one-way forward chain:
   - Show the **complete map** of what this video covers, empty, before diving into any of it.
   - Walk through it in guided order, returning to the map at a **few major joints** (not after every stop) so the viewer always knows where they are.
   - End on the **one complete, filled-in map** — the payoff, the thing worth screenshotting. Sub-parts (Capability & Reliability, Security, Production) get their own videos and their own payoffs later — this video doesn't try to also deliver those.
2. **Color as a language** and **every scene boundary is a transform, not a cut** — unchanged from before.

## The map (confirmed)

Scope = **this video's content** (the Discovery phase specifically), not the whole 4-part series. Six stops, walked in order:

1. The CTO's Question (cost, latency, accuracy, data)
2. The Framework (Jobs to be Done: goal, forces, fear)
3. The Example (sales rep scenario → the CTO's own doubt → the reps' fears)
4. Business Metrics & Constraints
5. The Conceptual Solution (RAG → latency & adoption, accuracy, cost, security)
6. Proving the Value

**Joints** (map returned to, "a few," not per-stop): after stops 1–3 as one group, after stop 4, after stop 5, and the final complete map after stop 6. Four returns total.

## The series framework (context only, not the payoff)

Renamed/restructured from the old script: **Discovery → Capability & Reliability → Security → Production.** This video covers Discovery only. It appears briefly at the very start (establishing shot) and very briefly again after the Discovery map's payoff (naming what's next), but it does **not** compete with the Discovery map as the thing to screenshot — it's on screen for seconds, not held.

---

## Scene 1: Title

- **Time**: 00:00.050 → 00:09.220
- **Cue**: "Hi guys, welcome to this"
- **Visual**: Series title fades in, centered, alone on black.
- **Transform into next**: Title dissolves as the 4-phase series row fades in at the same point.

## Scene 2: The series framework (establishing shot)

- **Time**: 00:09.220 → 01:28.900
- **Cue**: "In hindsight I was able"
- **Labels**: Discovery, Capability & Reliability, Security, Production
- **Visual**: Four boxes draw in left to right, connected by a line — same mechanic as the validated prototype, updated labels.
- **Transform into next**: Camera zooms into "Discovery" specifically (not "Capability" — framework changed). Other three fade as focus leaves them.

## Scene 3: "This is part one" → the Discovery map reveals, empty

- **Time**: 01:28.900 → 01:35.860
- **Cue**: "This is part one"
- **Visual**: The zoomed-in "Discovery" box **expands into the full 6-stop map** — the box doesn't just hold a new label this time, it becomes the frame for the entire outline: six empty/outline nodes in sequence (question → framework → example → metrics → solution → proof), connected by a path, all unfilled. Held briefly, giving the viewer the whole shape before anything is explained.
- **Transform into next**: Camera pushes into stop 1 (the first node brightens and fills the frame).

## Stop 1: The CTO's Question

- **Time**: 01:35.860 → 02:17.940
- **Cue**: "the interview begins with a quick introduction"
- **Labels**: Cost, Latency, Accuracy, Data
- **Visual**: The interviewer's setup, then the CTO's question itself appears as a quoted callout, with the four factors (Cost, Latency, Accuracy, Data) as small tags beneath it — these four recur as a throughline across the whole video (each gets addressed later in Stop 5).
- **Transform into next**: The quote card shrinks into node 1's position on the (currently off-screen) map, and a lens/frame opens for stop 2 in its place.

## Stop 2: The Framework (JTBD)

- **Time**: 02:17.940 → 02:50.560
- **Cue**: "Now to the answer"
- **Labels**: Goal, Forces, Fear
- **Visual**: The canonical JTBD triad reveals inside the frame, one at a time: **Goal** (what they're trying to achieve), **Forces** (what's pushing for the change), **Fear** (what's holding them back). This is the lens the example is about to be run through.
- **Transform into next**: The frame pushes forward (same "walk through the doorway" push used before) into a concrete instance of Goal/Forces/Fear — the example.

## Stop 3: The Example

- **Time**: 02:50.560 → 04:17.120
- **Cue**: "Let's take an example"
- **Visual**: Three beats, camera holding roughly in place, objects accumulating rather than cutting:
  - **02:50.560** — icon scene: call/hold icon, PDF stack with a scanning magnifying glass, a ticking clock (the rep's problem, dramatized physically, no labels).
  - **03:20.580** ("Your fear is why you should invest...") — the CTO's own doubt appears as a small callout beside the icons: zero-cost-today vs. would-they-even-use-it.
  - **03:31.380** ("step into the shoes of the sales rep...") — question-mark nodes pop up one at a time, each tethered to the icon it worries about: *wrong price / lose street cred*, *how long on hold*, *sensitive data*, *switch screens*.
- **Transform into next (Joint 1)**: Everything from stops 1–3 contracts back into their three map-node positions, which snap into view as the camera pulls all the way back — **first return to the map**, three of six nodes now filled, three still outline.

## Joint 1: Map, 3/6 filled

- **Time**: ~04:17.120 (brief, a few seconds)
- **Visual**: The map from Scene 3's reveal, now with nodes 1–3 solid/filled and a connecting line drawn up to node 4. No new content — pure orientation beat.
- **Transform into next**: Camera pushes into node 4.

## Stop 4: Business Metrics & Constraints

- **Time**: 04:17.120 → 05:06.340
- **Cue**: "we get two crucial things"
- **Labels**: Handle Time, Close Rate, DAU, Correct Answers, Instant, Data Protection, Seamless Integration, Cost
- **Visual**: Split-panel: left "Business Metrics" fills as a list (Handle Time, Close Rate, DAU), right "Operational Constraints" fills in parallel (Correct Answers, Instant, Data Protection, Seamless Integration, Cost).
- **Transform into next (Joint 2)**: Both columns collapse toward center and snap back into the map — **second return**, node 4 now filled too.

## Joint 2: Map, 4/6 filled

- **Time**: ~05:06.340 (brief)
- **Visual**: Map with nodes 1–4 solid, connecting line drawn to node 5.
- **Transform into next**: Camera pushes into node 5 — the longest stop, so the push-in is slightly more deliberate/slower, signaling "this one has more inside it."

## Stop 5: The Conceptual Solution

- **Time**: 05:06.340 → 08:16.180 (long — four internal beats, same node, camera doesn't leave)
- **Cue**: "the conceptual solution"
- **Labels**: Query, Retrieval, Generation, Citation
- Four sub-beats inside this one map node, each answering one of the four factors from Stop 1's callout (Cost/Latency/Accuracy/Data tags literally fly back in and get checked off as each is addressed — this is the throughline payoff):
  - **05:06.340** — RAG pipeline builds left to right: Query → Retrieval → Generation → Citation. Immediately followed (05:49.860, "adoption") by the embed-into-CRM/browser motion — bundled here since the script bundles latency + adoption in one breath.
  - **06:14.420** ("address concerns about data accuracy") — citations/verification: a source-link tag attaches to the Citation node from the pipeline above (reuses the object, doesn't introduce a new one).
  - **07:03.870** ("concerns on the cost") — the ROI-equation beat (hourly rep rate × calls vs. LLM token cost) — the one we flagged earlier as underused; this is where it belongs now, explicit.
  - **07:31.240** ("concerns on security") — containment rings draw in around the whole pipeline assembly, same as before.
- **Transform into next (Joint 3)**: The whole solution assembly (pipeline + rings) shrinks into node 5's map position — **third return**.

## Joint 3: Map, 5/6 filled

- **Time**: ~08:16.180 (brief)
- **Visual**: Map with nodes 1–5 solid, line drawn to node 6.
- **Transform into next**: Camera pushes into node 6, the last stop.

## Stop 6: Proving the Value

- **Time**: 08:16.180 → 08:47.370
- **Cue**: "To conclude the initial consultation"
- **Labels**: Golden Set, Rapid Prototype
- **Visual**: A short path within the node: golden-set queries → rapid prototype, resolving to a checkmark.
- **Transform into next**: Node 6 fills; camera pulls back for the last time.

## Payoff: The complete map

- **Time**: ~08:47.370 → 08:58s (held, the longest static hold in the video)
- **Visual**: All six nodes filled, full path connected, nothing moving except perhaps a subtle final glow/settle. **This is the screenshot.** Held deliberately longer than any other single frame in the video — the one moment explicitly designed to be paused on.

## Closing: series context (brief, not competing with the payoff)

- **Time**: 08:47.370 → 09:00.340
- **Cue**: "This led to a natural segue" (approx., see note)
- **Visual**: Camera pulls back further, past the Discovery map, to reveal it sitting inside the outer 4-phase series row from Scene 2 — Discovery now solid/complete, "Capability & Reliability" highlighted as next, Security/Production still dim. On screen only a few seconds — a pointer to part 2, not a second payoff.
- **Note**: exact cue timestamp approximated — whisper split "segue" into two sub-word tokens ("se"/"gue"), so the anchor used is the stable phrase immediately before it ("before committing to a full build," 08:47.370).

## Outro

- **Time**: 09:00.340 → 09:42.820 (end)
- **Cue**: "I understand that the answer provided here"
- **Visual**: Reflective/personal closing (framework-over-memorized-details, feedback request, thank-you). Held over the dimmed series-framework shot from the closing beat, or fades to a simple sign-off card — no new diagram content needed here, this is the presenter speaking directly, and the visual shouldn't compete with what was already delivered as the payoff.
