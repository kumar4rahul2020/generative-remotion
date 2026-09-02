import {interpolate, Easing} from 'remotion';
import {colors, fonts} from '../../style/tokens';
import {mapNodes} from './world';

// Shared across all fde-part1 chunks - extracted once real reuse showed up
// (4 chunks needing the same Ruler/Label/Kinetic/Mark/map treatment), not
// speculatively. See build-state.md for the per-chunk beat breakdowns this
// supports.

export const FPS = 30;
export const TEMPO = 1.3; // narration plays 30% faster, pitch-corrected - see architecture.md "Tempo"

// For timestamps sourced directly from the ORIGINAL (untempo'd)
// timestamps.json - e.g. Chunk1.tsx's anchors. Converts real seconds to
// frame numbers in the sped timeline.
export const sec = (s: number) => Math.round((s / TEMPO) * FPS);

// For timestamps already measured against the SPED audio - i.e. every
// prototype from Chunk 2 onward, whose T objects were built by dividing
// real timestamps by TEMPO ONCE already (see each prototype's own
// comment: "already relative to clip start... divided by 1.3"). Applying
// `sec()` to these would divide by TEMPO a second time and silently
// compress that chunk to the wrong length - use this instead.
export const spedSec = (s: number) => Math.round(s * FPS);

export const fadeInOut = (
  frame: number,
  start: number,
  end: number,
  inDur = sec(0.6),
  outDur = sec(0.8),
) =>
  interpolate(frame, [start, start + inDur, end - outDur, end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const Ruler: React.FC<{frame: number}> = ({frame}) => {
  const pulse = 0.65 + 0.35 * Math.abs(Math.sin(frame / 21));
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '20px 32px',
        fontFamily: fonts.mono,
        fontSize: 13,
        letterSpacing: '0.08em',
        color: colors.dim,
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: colors.mark,
          display: 'inline-block',
          marginRight: 8,
          opacity: pulse,
        }}
      />
      FDE INTERVIEW SERIES — PART 01
    </div>
  );
};

export const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontSize: 15,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: colors.accent,
      marginBottom: 18,
    }}
  >
    {children}
  </div>
);

type KineticSize = 'huge' | 'big' | 'quote';
const kineticSizes: Record<KineticSize, number> = {huge: 120, big: 72, quote: 48};

export const Kinetic: React.FC<{size: KineticSize; children: React.ReactNode}> = ({size, children}) => (
  <div
    style={{
      fontFamily: fonts.display,
      textAlign: 'center',
      lineHeight: 1.05,
      letterSpacing: '-0.01em',
      color: colors.foreground,
      fontSize: kineticSizes[size],
      maxWidth: size === 'quote' ? 1500 : undefined,
    }}
  >
    {children}
  </div>
);

export const Mark: React.FC<{frame: number; startFrame: number; children: React.ReactNode}> = ({
  frame,
  startFrame,
  children,
}) => {
  const t = interpolate(frame, [startFrame, startFrame + sec(0.5)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      {children}
      <svg
        viewBox="0 0 400 20"
        preserveAspectRatio="none"
        style={{position: 'absolute', left: '-2%', right: '-2%', bottom: '-0.12em', width: '104%', height: '0.22em', overflow: 'visible'}}
      >
        <path
          d="M5 12 Q 200 2 395 12"
          fill="none"
          stroke={colors.mark}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={600}
          strokeDashoffset={600 - t * 600}
        />
      </svg>
    </span>
  );
};

// N-dot progress indicator - position only, never previews content ahead.
export const DotProgress: React.FC<{count: number; activeIndex: number}> = ({count, activeIndex}) => (
  <div style={{position: 'absolute', top: 64, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10}}>
    {Array.from({length: count}).map((_, i) => (
      <span
        key={i}
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: i < activeIndex ? colors.foreground : i === activeIndex ? colors.accent : colors.dim,
          transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
        }}
      />
    ))}
  </div>
);

// The persistent 6-stop Discovery map, reused unchanged across Chunks 1-4 -
// only `filledCount` changes as the video progresses. Chunk 1's initial
// reveal (nodes animating in from nothing) has its own one-time logic in
// Chunk1.tsx; everywhere else the map already exists and just updates.
export const MapRow: React.FC<{filledCount: number}> = ({filledCount}) => (
  <div style={{display: 'flex', gap: 18, marginTop: 12}}>
    {mapNodes.map((n, i) => {
      const filled = i < filledCount;
      return (
        <div
          key={n.id}
          style={{
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 15,
            textAlign: 'center',
            lineHeight: 1.3,
            padding: '16px 14px',
            border: `2px solid ${filled ? colors.accent : colors.dim}`,
            borderRadius: 6,
            color: filled ? colors.foreground : colors.dim,
            width: 120,
          }}
        >
          {n.label}
        </div>
      );
    })}
  </div>
);
