import {AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {colors, fonts} from '../style/tokens';
import {WORLD_WIDTH, WORLD_HEIGHT, seriesPhases, PHASE_BOX_Y, PHASE_BOX_W, PHASE_BOX_H} from '../projects/fde-part1/world';

// EXPERIMENT - not part of the approved pipeline. Tests animated
// keyword-style captions + tighter tempo against the first ~29s of
// Chunk 1's content, per user request, kept deliberately separate from
// storyboard.md / build-state.md / the real chunk files. Does not
// represent an approved direction change on its own.

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

export const experimentCaptions = [
  {startMs: 50, endMs: 672, text: 'Hi guys,'},
  {startMs: 672, endMs: 1837, text: 'welcome to this'},
  {startMs: 1837, endMs: 3547, text: 'four-part series where'},
  {startMs: 3547, endMs: 4324, text: 'I take you'},
  {startMs: 4324, endMs: 5645, text: 'through my Google'},
  {startMs: 5645, endMs: 7588, text: 'Forward Deployed Engineer'},
  {startMs: 7588, endMs: 9220, text: 'interview experience.'},
  {startMs: 9220, endMs: 10182, text: 'In hindsight,'},
  {startMs: 10182, endMs: 10922, text: 'I was able'},
  {startMs: 10922, endMs: 11883, text: 'to break down'},
  {startMs: 11883, endMs: 13215, text: 'the interview into'},
  {startMs: 13215, endMs: 15139, text: 'an easy-to-remember mental'},
  {startMs: 15139, endMs: 15583, text: 'model.'},
  {startMs: 15583, endMs: 16249, text: 'The way I'},
  {startMs: 16249, endMs: 17062, text: 'think of it'},
  {startMs: 17062, endMs: 17876, text: 'now is that'},
  {startMs: 17876, endMs: 19504, text: 'the interview followed'},
  {startMs: 19504, endMs: 21206, text: 'the natural progression'},
  {startMs: 21206, endMs: 22315, text: 'of questions an'},
  {startMs: 22315, endMs: 23351, text: 'FDE would face'},
  {startMs: 23351, endMs: 24683, text: 'while working with'},
  {startMs: 24683, endMs: 25349, text: 'a client.'},
  {startMs: 25349, endMs: 26828, text: 'The end-to-end cycle'},
  {startMs: 26828, endMs: 28012, text: 'breaks down into'},
  {startMs: 28012, endMs: 28900, text: 'four phases.'},
];

export const EXPERIMENT_DURATION = sec(29.5);

export const CaptionsTempoExperiment: React.FC = () => {
  const frame = useCurrentFrame();

  const activeCaption = experimentCaptions.find(
    (c) => frame >= sec(c.startMs / 1000) && frame < sec(c.endMs / 1000),
  );

  // Camera "punch": a quick zoom-pulse on every caption change, so the
  // whole frame has a fresh moment of motion at the same cadence captions
  // already change at (~every 1-2s) - keeps the diagram from ever sitting
  // fully still for long, without adding more text or content.
  const punchStart = activeCaption ? sec(activeCaption.startMs / 1000) : 0;
  const punchLocal = frame - punchStart;
  const punchScale = interpolate(punchLocal, [0, sec(0.18)], [1.045, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Tighter tempo: boxes draw in faster (0.3s stagger -> 0.1s) and start
  // right after the title, no long static hold before something moves.
  const boxesStart = sec(1);
  const titleOpacity = interpolate(frame, [0, sec(0.25), sec(0.6), sec(0.85)], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Audio
        src={staticFile('audio/fde-part1-narration.wav')}
        trimAfter={EXPERIMENT_DURATION}
      />

      {/* Same diagram content as Chunk 1, tempo tightened */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: titleOpacity}}>
        <span style={{color: colors.foreground, fontFamily: fonts.family, fontSize: 54, fontWeight: 700}}>
          Google FDE Interview Experience
        </span>
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: WORLD_WIDTH,
          height: WORLD_HEIGHT,
          transform: `translate(160px, -20px) scale(${punchScale})`,
          transformOrigin: '50% 50%',
        }}
      >
        {seriesPhases.map((phase, i) => {
          const delay = boxesStart + i * sec(0.1);
          const drawIn = interpolate(frame, [delay, delay + sec(0.25)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.back(1.6)),
          });
          return (
            <div
              key={phase.id}
              style={{
                position: 'absolute',
                left: phase.x,
                top: PHASE_BOX_Y,
                width: PHASE_BOX_W,
                height: PHASE_BOX_H,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 12px',
                border: `3px solid ${colors.dim}`,
                borderRadius: 12,
                opacity: drawIn,
                transform: `scale(${drawIn})`,
                backgroundColor: colors.background,
              }}
            >
              <span style={{color: colors.foreground, fontFamily: fonts.family, fontSize: 28, fontWeight: 600}}>
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Animated keyword captions, TikTok/Shorts-style */}
      {activeCaption && (
        <CaptionPop key={activeCaption.text} caption={activeCaption} frame={frame} />
      )}
    </AbsoluteFill>
  );
};

const CaptionPop: React.FC<{
  caption: {startMs: number; endMs: number; text: string};
  frame: number;
}> = ({caption, frame}) => {
  const startFrame = sec(caption.startMs / 1000);
  const endFrame = sec(caption.endMs / 1000);
  const local = frame - startFrame;
  const pop = interpolate(local, [0, sec(0.12)], [0.7, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(2)),
  });
  const fadeOut = interpolate(frame, [endFrame - sec(0.08), endFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 140}}>
      <div
        style={{
          transform: `scale(${pop})`,
          opacity: fadeOut,
          backgroundColor: 'rgba(0,0,0,0.55)',
          padding: '14px 28px',
          borderRadius: 14,
        }}
      >
        <span
          style={{
            color: colors.foreground,
            fontFamily: fonts.family,
            fontSize: 46,
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          {caption.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
