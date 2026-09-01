import path from 'path';
import fs from 'fs';
import {execSync} from 'child_process';
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from '@remotion/install-whisper-cpp';

const projectName = process.argv[2];
if (!projectName) {
  console.error('Usage: node scripts/align.ts <project-name>');
  process.exit(1);
}

const projectDir = path.join(process.cwd(), '..', 'projects', projectName);
const narrationPath = path.join(projectDir, 'narration.wav');
const whisperFolder = path.join(process.cwd(), '.whisper.cpp');
const model = 'base.en';
const whisperCppVersion = '1.5.5';

async function main() {
  if (!fs.existsSync(narrationPath)) {
    console.error(`No narration.wav found at ${narrationPath}`);
    process.exit(1);
  }

  // whisper.cpp requires 16-bit, 16kHz, mono WAV input.
  const converted16k = path.join(projectDir, '.narration-16k.wav');
  console.log('Converting narration to 16kHz mono WAV for whisper.cpp...');
  execSync(
    `ffmpeg -y -i "${narrationPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${converted16k}"`,
    {stdio: 'inherit'},
  );

  console.log('Installing whisper.cpp (one-time build, may take a couple minutes)...');
  const installResult = await installWhisperCpp({
    to: whisperFolder,
    version: whisperCppVersion,
    printOutput: false,
  });
  console.log(
    installResult.alreadyExisted
      ? 'whisper.cpp already installed.'
      : 'whisper.cpp installed.',
  );

  console.log(`Downloading model "${model}"...`);
  let lastPct = -10;
  const downloadResult = await downloadWhisperModel({
    folder: whisperFolder,
    model,
    printOutput: false,
    onProgress: (downloaded, total) => {
      const pct = Math.floor((downloaded / total) * 100);
      if (pct - lastPct >= 10) {
        console.log(`  model download: ${pct}%`);
        lastPct = pct;
      }
    },
  });
  console.log(
    downloadResult.alreadyExisted ? 'Model already present.' : 'Model downloaded.',
  );

  console.log('Transcribing (this is the long step, ~real-time or slower on CPU)...');
  let lastTranscribePct = -10;
  const result = await transcribe({
    inputPath: converted16k,
    whisperPath: whisperFolder,
    whisperCppVersion,
    model,
    tokenLevelTimestamps: true,
    onProgress: (progress) => {
      const pct = Math.floor(progress * 100);
      if (pct - lastTranscribePct >= 5) {
        console.log(`  transcribe: ${pct}%`);
        lastTranscribePct = pct;
      }
    },
  });
  console.log('Transcription complete.');

  const captions = toCaptions({whisperCppOutput: result});

  const outputPath = path.join(projectDir, 'timestamps.json');
  fs.writeFileSync(outputPath, JSON.stringify(captions, null, 2));
  console.log(`Wrote ${outputPath}`);

  fs.unlinkSync(converted16k);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
