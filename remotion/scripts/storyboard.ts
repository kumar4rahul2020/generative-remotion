import path from 'path';
import fs from 'fs';
import OpenAI from 'openai';

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
};

type SceneDraft = {
  id: string;
  sceneType: string;
  cue: string; // exact opening words of this scene, verbatim from script.md
  visualDescription: string;
  labels: string[];
};

const projectName = process.argv[2];
if (!projectName) {
  console.error('Usage: node scripts/storyboard.ts <project-name>');
  process.exit(1);
}

const projectDir = path.join(process.cwd(), '..', 'projects', projectName);
const scriptPath = path.join(projectDir, 'script.md');
const timestampsPath = path.join(projectDir, 'timestamps.json');
const visualNotesPath = path.join(projectDir, 'visual-notes.md');
const outputPath = path.join(projectDir, 'storyboard.md');

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function callOpenAiForScenes(
  scriptText: string,
  transcriptText: string,
  visualNotes: string,
): Promise<SceneDraft[]> {
  const client = new OpenAI();

  const system = `You are segmenting a spoken narration into scenes for an animated-diagram Remotion video.

You are given two texts:
1. WRITTEN SCRIPT - the original written draft. Use this for structure, concepts, section themes, and framework names.
2. ACTUAL TRANSCRIPT - what was actually said in the recording (auto-transcribed, may contain minor transcription errors). The speaker paraphrased/ad-libbed in places, so wording differs from the written script. USE THIS FOR CUES.

Hard constraints from the project's visual expectation:
${visualNotes}

Rules for your output:
- Break the narration into sequential, non-overlapping scenes covering the ENTIRE transcript from start to end.
- For each scene, "cue" must be an EXACT, VERBATIM substring copied from the ACTUAL TRANSCRIPT (the first 6-10 words of that scene's content, exactly as transcribed, no paraphrasing) - it will be used to locate the scene's start time in the audio. Do NOT copy cues from the written script if the wording differs from the transcript.
- Each scene needs a "sceneType" (e.g. title, phase-diagram, concept-graph, node-reveal, comparison, close) and a "visualDescription" describing the animated diagram: what nodes/shapes/connections appear, how they build over time, what changes.
- "labels" is a list of short structural labels the diagram may show (node names, e.g. "Capability", "RAG") - NOT captions or sentences. Empty array if none needed.
- Do not propose caption text, bullet text, or on-screen paraphrasing of narration - only diagram structure.
- Prefer scene breaks at natural topic shifts (use the written script's structure/headers as a guide for where concepts change, but anchor timing cues to the transcript).

Return strict JSON: {"scenes": [{"id": string, "sceneType": string, "cue": string, "visualDescription": string, "labels": string[]}]}`;

  const user = `=== WRITTEN SCRIPT ===\n${scriptText}\n\n=== ACTUAL TRANSCRIPT ===\n${transcriptText}`;

  return client.chat.completions
    .create({
      model: 'gpt-4o',
      response_format: {type: 'json_object'},
      messages: [
        {role: 'system', content: system},
        {role: 'user', content: user},
      ],
    })
    .then((res) => {
      const content = res.choices[0]?.message?.content;
      if (!content) throw new Error('No content in OpenAI response');
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed.scenes)) {
        throw new Error('OpenAI response missing "scenes" array');
      }
      return parsed.scenes as SceneDraft[];
    });
}

// Find the caption index whose reconstructed running text best matches the
// start of `cueWords` (a normalized word array), via sliding window search.
function findStartMs(captions: Caption[], cueWords: string[]): number | null {
  const normWords = captions.map((c) => normalize(c.text));
  const windowLen = Math.min(cueWords.length, 8);
  const target = cueWords.slice(0, windowLen).join(' ');

  let bestIdx = -1;
  let bestScore = Infinity;

  for (let i = 0; i < normWords.length; i++) {
    const candidateWords: string[] = [];
    let j = i;
    while (candidateWords.join(' ').length < target.length && j < normWords.length) {
      if (normWords[j]) candidateWords.push(normWords[j]);
      j++;
    }
    const candidate = candidateWords.join(' ');
    const score = levenshtein(candidate, target);
    if (score < bestScore) {
      bestScore = score;
      bestIdx = i;
    }
    if (score === 0) break;
  }

  // Reject weak matches (more than ~30% of target length in edit distance).
  if (bestIdx === -1 || bestScore > target.length * 0.3) return null;
  return captions[bestIdx].startMs;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}

function msToTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

async function main() {
  const scriptText = fs.readFileSync(scriptPath, 'utf-8');
  const visualNotes = fs.readFileSync(visualNotesPath, 'utf-8');
  const {captions} = JSON.parse(fs.readFileSync(timestampsPath, 'utf-8')) as {
    captions: Caption[];
  };
  const lastMs = captions[captions.length - 1]?.endMs ?? 0;
  const transcriptText = captions.map((c) => c.text).join('');

  console.log('Asking OpenAI to segment the script into scenes...');
  const scenes = await callOpenAiForScenes(scriptText, transcriptText, visualNotes);
  console.log(`Got ${scenes.length} scenes. Matching each to real audio timestamps...`);

  const resolved: Array<SceneDraft & {startMs: number | null}> = [];
  for (const scene of scenes) {
    const cueWords = normalize(scene.cue).split(' ').filter(Boolean);
    const startMs = findStartMs(captions, cueWords);
    if (startMs === null) {
      console.warn(`  WARNING: could not confidently locate cue for scene "${scene.id}": "${scene.cue}"`);
    } else {
      console.log(`  ${scene.id}: matched at ${msToTimestamp(startMs)}`);
    }
    resolved.push({...scene, startMs});
  }

  // Fill end times from the next scene's start; last scene ends at audio end.
  const lines: string[] = [];
  lines.push(`# Storyboard — ${projectName}`);
  lines.push('');
  lines.push(
    `Draft from OpenAI (scene segmentation + visual description) with start times matched against timestamps.json. **Review required before any Remotion code is written** — per architecture.md, this is a human checkpoint, not a rubber stamp.`,
  );
  lines.push('');

  for (let i = 0; i < resolved.length; i++) {
    const scene = resolved[i];
    const nextStart = resolved[i + 1]?.startMs;
    const start = scene.startMs;
    const end = nextStart ?? lastMs;

    lines.push(`## Scene ${i + 1}: ${scene.id}`);
    lines.push('');
    lines.push(
      `- **Time**: ${start !== null ? msToTimestamp(start) : 'UNRESOLVED'} → ${msToTimestamp(end)}`,
    );
    lines.push(`- **Type**: ${scene.sceneType}`);
    lines.push(`- **Cue (script excerpt)**: "${scene.cue}"`);
    lines.push(`- **Labels**: ${scene.labels.length ? scene.labels.join(', ') : '(none)'}`);
    lines.push(`- **Visual**: ${scene.visualDescription}`);
    lines.push('');
  }

  fs.writeFileSync(outputPath, lines.join('\n'));
  console.log(`Wrote ${outputPath}`);

  const unresolved = resolved.filter((s) => s.startMs === null).length;
  if (unresolved > 0) {
    console.warn(`${unresolved} scene(s) have unresolved timing — needs manual review.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
