import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Chunk1} from './Chunk1';
import {Chunk2} from './Chunk2';
import {Chunk3} from './Chunk3';
import {Chunk4} from './Chunk4';

// The full fde-part1 video: all four chunks stitched into one continuous
// timeline, played against one continuous audio track.
//
// IMPORTANT: chunk start positions below are each chunk's REAL anchor in
// the narration (resolved against timestamps.json, divided by TEMPO=1.3),
// NOT the sum of each chunk's own CHUNK_DURATION export. Those two differ:
// every chunk ends with a deliberate hold (e.g. sitting on the map a
// moment before cutting) that has nothing spoken during it - the audio
// keeps moving through the *next* chunk's content while that hold plays.
// Summing self-reported durations compounds that hold time chunk after
// chunk, so by Chunk 4 the visuals would run ~9-10s behind the audio.
// Anchoring each chunk to where it actually starts in the audio - and
// letting each Sequence's durationInFrames run only until the *next*
// chunk's real start - fixes this: a chunk's own trailing hold simply
// gets truncated by the next chunk's arrival, which is correct (the next
// chunk should start exactly when its content starts being spoken, not
// after an arbitrary pause).
const FPS = 30;
const TEMPO = 1.3;
const frames = (realSeconds: number) => Math.round((realSeconds / TEMPO) * FPS);

const CHUNK1_START = frames(0.05); // title
const CHUNK2_START = frames(95.86); // Stop 1: "the interview begins..."
const CHUNK3_START = frames(309.04); // Stop 5: "the conceptual solution is..."
const CHUNK4_START = frames(496.18); // Stop 6: "to conclude the initial consultation..."
const TOTAL_END = frames(582.82); // end of narration

export const FDE_PART1_DURATION = TOTAL_END;

export const FdePart1: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/fde-part1-narration-1.3x.wav')} trimAfter={FDE_PART1_DURATION} />

      <Sequence from={CHUNK1_START} durationInFrames={CHUNK2_START - CHUNK1_START}>
        <Chunk1 />
      </Sequence>
      <Sequence from={CHUNK2_START} durationInFrames={CHUNK3_START - CHUNK2_START}>
        <Chunk2 />
      </Sequence>
      <Sequence from={CHUNK3_START} durationInFrames={CHUNK4_START - CHUNK3_START}>
        <Chunk3 />
      </Sequence>
      <Sequence from={CHUNK4_START} durationInFrames={TOTAL_END - CHUNK4_START}>
        <Chunk4 />
      </Sequence>
    </AbsoluteFill>
  );
};
