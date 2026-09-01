# Storyboard — fde-part1

Draft from OpenAI (scene segmentation + visual description) with start times matched against timestamps.json. **Review required before any Remotion code is written** — per architecture.md, this is a human checkpoint, not a rubber stamp.

## Scene 1: 1

- **Time**: 00:00.140 → 00:08.080
- **Type**: title
- **Cue (script excerpt)**: "Hi guys, welcome to this four-part"
- **Labels**: (none)
- **Visual**: The scene introduces the series. It starts with a simple title animated onto the screen stating the series name and topic: Google Forward Deployed Engineer Interview Experience. The background remains minimalistic, aligning with the series theme.

## Scene 2: 2

- **Time**: 00:08.080 → 00:48.630
- **Type**: phase-diagram
- **Cue (script excerpt)**: "In hindsight, I was able to break the"
- **Labels**: Capability, Reliability, Security, Scalability
- **Visual**: A four-phase framework diagram animates onto the screen. Labelled nodes for each phase: 'Capability', 'Reliability', 'Security', and 'Scalability' appear sequentially. Arrows connect them, showing the progressive relationship.

## Scene 3: 3

- **Time**: 00:48.630 → 01:14.500
- **Type**: hub-and-spoke
- **Cue (script excerpt)**: "The first question is a CTO asks,"
- **Labels**: AI, Initial Conversation, Cost, Latency, Accuracy, Data
- **Visual**: A central 'CTO Question' node pulses in, then spokes extend outward one at a time to 'AI', 'Initial Conversation', 'Cost', 'Latency', 'Accuracy', 'Data' — radial, all tied back to one source node. (Reserve this radial/hub pattern for genuinely single-source-branching-to-many content like this — don't reuse it as a default.)

## Scene 4a: JTBD lens

- **Time**: 01:14.500 → 01:32.590
- **Type**: framework-lens
- **Cue (script excerpt)**: "So here goes the answer. Before building"
- **Labels**: Jobs to be Done, What's the problem?, Who's the user?, What does success look like?
- **Visual**: NOT a node graph. A framing rectangle/lens labeled 'Jobs to be Done' animates onto screen, then the three questions reveal one at a time *inside* the frame as a vertical stack — like looking through a lens at a checklist, not branches on a graph.

## Scene 4b: The sales rep's problem

- **Time**: 01:32.590 → 02:15.760
- **Type**: scenario-icon
- **Cue (script excerpt)**: "To take an example, I explained with a sales representative scenario"
- **Labels**: (none — icon-driven, not label-driven)
- **Visual**: NOT nodes. A small icon scene: a call/hold icon, a stack of PDF pages with a magnifying glass scanning down through them, a clock/timer visibly ticking forward — dramatizing the wasted-time problem physically rather than as a concept map.

## Scene 4c: The rep's fears

- **Time**: 02:15.760 → 02:32.240
- **Type**: concern-cluster
- **Cue (script excerpt)**: "However, they are afraid of some risk. They keep wondering, what if the AI gives me the"
- **Labels**: Wrong price?, How long on hold?, Sensitive data?, Switch screens?
- **Visual**: A radiating cluster of question-mark nodes appearing one at a time around a central rep figure — this IS a genuine node-cluster fit, since the content itself is a literal list of distinct worries, not a forced default.

## Scene 4d: Is it worth it?

- **Time**: 02:32.240 → 02:47.950
- **Type**: balance-comparison
- **Cue (script excerpt)**: "That also will be explained in the CTO's concern, naturally, in which the CTO"
- **Labels**: Juice, Squeeze
- **Visual**: NOT nodes. A balance/scale visual — 'investment' weighed against 'payoff' ("juice vs. squeeze") — the scale tips as the question is posed, setting up the ROI argument that follows.

## Scene 5: 5

- **Time**: 02:47.950 → 03:31.110
- **Type**: split-panel
- **Cue (script excerpt)**: "Deriving from these discovery questions,"
- **Labels**: Business Metrics, Operational Constraints, Handle Time, Close Rate, DAU, Cost-Benefit
- **Visual**: NOT a node graph. Two-column split-screen: left column labeled 'Business Metrics' builds as a list (Handle Time, Close Rate, DAU), right column labeled 'Operational Constraints' builds in parallel — two distinct categories side by side, not a connected web.

## Scene 6: 6

- **Time**: 03:31.110 → 04:40.630
- **Type**: pipeline-flow
- **Cue (script excerpt)**: "Once we have had the product"
- **Labels**: Query, Retrieval, Generation, Citation
- **Visual**: NOT a node graph. A left-to-right pipeline: 'Query' → 'Retrieval' (documents) → 'Generation' (answer) → 'Citation' (source link) — sequential stages with arrows, mirroring how RAG actually works mechanically, not a branching concept map.

## Scene 7: 7

- **Time**: 04:40.630 → 05:05.700
- **Type**: comparison
- **Cue (script excerpt)**: "Regarding wait time, a RAG system"
- **Labels**: Manual Search, RAG System
- **Visual**: A side-by-side comparison animation illustrating 'Manual Search' versus 'RAG System'. Visual elements indicate time differences, from a lengthy manual process to a swift AI response.

## Scene 8: 8

- **Time**: 05:05.700 → 05:31.810
- **Type**: containment-diagram
- **Cue (script excerpt)**: "To address security, we have to mention"
- **Labels**: Public Internet, VPC / Private Endpoint, Enterprise Data
- **Visual**: NOT flat nodes. Concentric perimeter rings: outer ring 'Public Internet' (crossed out / blocked), middle ring 'VPC / Private Endpoint', inner ring 'Enterprise Data' (protected core) — a containment diagram showing data never leaving the perimeter, not a connected node cluster.

## Scene 9: 9

- **Time**: 05:31.810 → 05:55.860
- **Type**: embed-integration
- **Cue (script excerpt)**: "A tool would be useless if the"
- **Labels**: CRM, Browser Extension
- **Visual**: NOT generic nodes. Existing-system icons (a CRM window, a browser bar) appear first, then the tool visually slides/merges directly into them — dramatizing "never switch screens" as an embedding motion, not a labeled node list.

## Scene 10: 10

- **Time**: 05:55.860 → 06:28.640
- **Type**: prototyping-path
- **Cue (script excerpt)**: "And at last, to conclude the"
- **Labels**: Prototyping Path, Golden Set of Queries, Rapid Prototype, Proof of Concept
- **Visual**: A 'Prototyping Path' node appears, branching into steps like 'Golden Set of Queries', 'Rapid Prototype', and 'Proof of Concept'. This culminates in proving the solution's viability.
