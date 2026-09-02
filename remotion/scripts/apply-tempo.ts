import path from 'path';
import fs from 'fs';
import {execSync} from 'child_process';

// Speeds up a project's narration by a uniform rate (pitch-corrected,
// via ffmpeg's atempo filter) and rescales timestamps.json to match -
// since the speed change is uniform, every timestamp just divides by
// the rate. No need to re-run whisper.
//
// Usage: node scripts/apply-tempo.ts <project-name> <rate>
// e.g.:  node scripts/apply-tempo.ts fde-part1 1.3

const projectName = process.argv[2];
const rate = parseFloat(process.argv[3]);

if (!projectName || isNaN(rate)) {
  console.error('Usage: node scripts/apply-tempo.ts <project-name> <rate>');
  process.exit(1);
}
if (rate < 0.5 || rate > 2) {
  // ffmpeg's atempo filter is only well-defined in [0.5, 2.0] per call.
  console.error('rate must be between 0.5 and 2.0 (ffmpeg atempo single-filter range)');
  process.exit(1);
}

const projectDir = path.join(process.cwd(), '..', 'projects', projectName);
const narrationPath = path.join(projectDir, 'narration.wav');
const timestampsPath = path.join(projectDir, 'timestamps.json');
const rateLabel = rate.toFixed(2).replace(/\.?0+$/, '') || '1';

const outAudioPath = path.join(projectDir, `narration-${rateLabel}x.wav`);
const outTimestampsPath = path.join(projectDir, `timestamps-${rateLabel}x.json`);

function main() {
  if (!fs.existsSync(narrationPath)) {
    console.error(`No narration.wav found at ${narrationPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(timestampsPath)) {
    console.error(`No timestamps.json found at ${timestampsPath} - run align.ts first`);
    process.exit(1);
  }

  console.log(`Speeding up narration.wav by ${rate}x (pitch-corrected)...`);
  execSync(
    `ffmpeg -y -i "${narrationPath}" -filter:a "atempo=${rate}" -c:a pcm_s16le "${outAudioPath}"`,
    {stdio: 'inherit'},
  );
  console.log(`Wrote ${outAudioPath}`);

  console.log(`Rescaling timestamps.json by 1/${rate}...`);
  const data = JSON.parse(fs.readFileSync(timestampsPath, 'utf-8'));
  const rescaleCaption = (c: any) => ({
    ...c,
    startMs: Math.round(c.startMs / rate),
    endMs: Math.round(c.endMs / rate),
    ...(c.timestampMs !== undefined ? {timestampMs: Math.round(c.timestampMs / rate)} : {}),
  });
  const rescaled = {...data, captions: data.captions.map(rescaleCaption)};
  fs.writeFileSync(outTimestampsPath, JSON.stringify(rescaled, null, 2));
  console.log(`Wrote ${outTimestampsPath}`);

  // Keep the Remotion public copy in sync too, same convention as align.ts.
  const publicAudioDir = path.join(process.cwd(), 'public', 'audio');
  fs.mkdirSync(publicAudioDir, {recursive: true});
  const publicAudioPath = path.join(publicAudioDir, `${projectName}-narration-${rateLabel}x.wav`);
  fs.copyFileSync(outAudioPath, publicAudioPath);
  console.log(`Synced ${publicAudioPath}`);
}

main();
