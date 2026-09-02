import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {loadFont as loadArchivoBlack} from '@remotion/google-fonts/ArchivoBlack';
import {loadFont as loadPlexSans} from '@remotion/google-fonts/IBMPlexSans';
import {loadFont as loadPlexMono} from '@remotion/google-fonts/IBMPlexMono';
import {colors, fonts} from '../../style/tokens';
import {seriesPhases, mapNodes} from './world';

// Chunk 1, Vox-style (locked - see build-state.md and visual-notes.md).
// Ported from the validated HTML prototype
// (remotion/prototypes/fde-part1-vox-preview/index.html) - same
// state-as-a-function-of-time logic, translated from `audio.currentTime`
// to `useCurrentFrame()`. Supersedes the earlier diagram/camera-based
// Chunk1 - this version doesn't use world.ts's camera system at all, only
// its seriesPhases/mapNodes label data.

loadArchivoBlack();
loadPlexSans();
loadPlexMono();

const FPS = 30;
const TEMPO = 1.3; // narration plays 30% faster, pitch-corrected - see architecture.md "Tempo"
const sec = (s: number) => Math.round((s / TEMPO) * FPS);

// Real (pre-tempo) timestamps, resolved against timestamps.json - same
// anchors as the prototype and storyboard.md.
const T = {
  framework: sec(9.22),
  phasesOverview: sec(13.2),
  discovery: sec(28.06),
  discoveryMark: sec(33.52),
  goldenMark: sec(44.47),
  capRel: sec(51.4),
  edgeCasesMark: sec(63.11),
  security: sec(65.7),
  perimeterMark: sec(75.14),
  production: sec(80.88),
  prototypeMark: sec(86.3),
  partOne: sec(88.9),
  zoomPunch: sec(90.5),
  mapReveal: sec(92.2),
  end: sec(95.9),
};

export const CHUNK1_DURATION = T.end;

const phaseIcons: Record<string, React.ReactNode> = {
  discovery: (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="27" cy="27" r="16" stroke={colors.accent} strokeWidth="3" />
      <path d="M39 39l14 14" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  capabilityReliability: (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="9" stroke={colors.accent} strokeWidth="3" />
      <path
        d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6"
        stroke={colors.accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  security: (
    <svg viewBox="0 0 64 64" fill="none">
      <path
        d="M32 6l22 8v16c0 16-10 26-22 30C20 56 10 46 10 30V14z"
        stroke={colors.accent}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M24 32l6 6 12-12" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  production: (
    <svg viewBox="0 0 64 64" fill="none">
      <path
        d="M32 6c8 6 12 16 12 26 0 8-4 14-12 20-8-6-12-12-12-20 0-10 4-20 12-26z"
        stroke={colors.accent}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="28" r="5" stroke={colors.accent} strokeWidth="3" />
      <path d="M24 46l-6 12M40 46l6 12" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
};

const phaseCallouts: Record<string, {mark: string; text: string; second?: {mark: string; text: string; at: number}}> = {
  discovery: {
    mark: 'discovery',
    text: 'BUSINESS METRICS & OPERATIONAL CONSTRAINTS',
    second: {mark: 'golden', text: 'GOLDEN QUESTION-ANSWER PAIRS', at: T.goldenMark},
  },
  capabilityReliability: {mark: 'edgecases', text: 'WORKS FOR ALL THE EDGE CASES'},
  security: {mark: 'perimeter', text: 'SECURE PERIMETER'},
  production: {mark: 'prototype', text: 'PROTOTYPE → PRODUCTION'},
};

const phaseWindows: Record<string, [number, number, number]> = {
  // [start, end, markAt]
  discovery: [T.discovery, T.capRel, T.discoveryMark],
  capabilityReliability: [T.capRel, T.security, T.edgeCasesMark],
  security: [T.security, T.production, T.perimeterMark],
  production: [T.production, T.partOne, T.prototypeMark],
};

export const Chunk1: React.FC = () => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Audio src={staticFile('audio/fde-part1-narration-1.3x.wav')} trimAfter={CHUNK1_DURATION} />

      <Ruler frame={frame} />

      {frame < T.framework && <TitleScene frame={frame} />}
      {frame >= T.framework && frame < T.phasesOverview && <HindsightScene frame={frame} />}
      {frame >= T.phasesOverview && frame < T.discovery && <PhasesOverviewScene frame={frame} />}

      {seriesPhases
        .filter((p) => phaseWindows[p.id])
        .map((p) => {
          const [start, end, markAt] = phaseWindows[p.id];
          if (frame < start || frame >= end) return null;
          return (
            <PhaseDetailScene
              key={p.id}
              frame={frame}
              phaseId={p.id}
              phaseIndex={seriesPhases.findIndex((sp) => sp.id === p.id)}
              label={p.label}
              windowStart={start}
              markAt={markAt}
            />
          );
        })}

      {frame >= T.partOne && frame < T.mapReveal && <ZoomScene frame={frame} width={width} />}
      {frame >= T.mapReveal && <MapScene frame={frame} />}
    </AbsoluteFill>
  );
};

const Ruler: React.FC<{frame: number}> = ({frame}) => {
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

const fadeInOut = (frame: number, start: number, end: number, inDur = sec(0.6), outDur = sec(0.8)) =>
  interpolate(frame, [start, start + inDur, end - outDur, end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const TitleScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, 0, T.framework);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <svg viewBox="0 0 64 64" fill="none" style={{width: 64, height: 64, marginBottom: 22}}>
        <rect x="4" y="4" width="56" height="56" rx="4" stroke={colors.accent} strokeWidth="3" />
        <path d="M18 32h28M32 18v28" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <Label>Google Forward Deployed Engineer</Label>
      <Kinetic size="huge">
        INTERVIEW
        <br />
        EXPERIENCE
      </Kinetic>
      <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 22, color: colors.dim, marginTop: 16}}>
        A four-part breakdown
      </div>
    </AbsoluteFill>
  );
};

const HindsightScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.framework, T.phasesOverview);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>In Hindsight</Label>
      <Kinetic size="big">
        <Mark frame={frame} startFrame={T.framework + sec(0.68)}>
          AN EASY-TO-REMEMBER
          <br />
          MENTAL MODEL
        </Mark>
      </Kinetic>
    </AbsoluteFill>
  );
};

const PhasesOverviewScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.phasesOverview, T.discovery);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>The End-to-End Cycle</Label>
      <Kinetic size="big">FOUR PHASES</Kinetic>
      <div style={{display: 'flex', gap: 28, marginTop: 8}}>
        {seriesPhases.map((p, i) => {
          const delay = T.phasesOverview + i * sec(0.35);
          const t = interpolate(frame, [delay, delay + sec(0.4)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={p.id}
              style={{
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: 22,
                padding: '18px 26px',
                border: `2px solid ${colors.dim}`,
                borderRadius: 4,
                color: colors.foreground,
                opacity: t,
                transform: `translateY(${(1 - t) * 14}px)`,
              }}
            >
              {p.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const PhaseDetailScene: React.FC<{
  frame: number;
  phaseId: string;
  phaseIndex: number;
  label: string;
  windowStart: number;
  markAt: number;
}> = ({frame, phaseId, phaseIndex, label, windowStart, markAt}) => {
  const opacity = interpolate(frame, [windowStart, windowStart + sec(0.4)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const callout = phaseCallouts[phaseId];
  const showSecond = callout.second && frame >= callout.second.at;
  const markStart = showSecond ? callout.second!.at : markAt;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <div style={{width: 72, height: 72, marginBottom: 20}}>{phaseIcons[phaseId]}</div>
      <Label>{`Phase ${String(phaseIndex + 1).padStart(2, '0')}`}</Label>
      <Kinetic size="big">{label.toUpperCase()}</Kinetic>
      <div
        style={{
          marginTop: 22,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 30,
          color: colors.foreground,
          textAlign: 'center',
        }}
      >
        <Mark frame={frame} startFrame={markStart}>
          {showSecond ? callout.second!.text : callout.text}
        </Mark>
      </div>
      <PhaseProgress activeIndex={phaseIndex} />
    </AbsoluteFill>
  );
};

const PhaseProgress: React.FC<{activeIndex: number}> = ({activeIndex}) => (
  <div style={{position: 'absolute', top: 64, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10}}>
    {seriesPhases.map((p, i) => (
      <span
        key={p.id}
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

const ZoomScene: React.FC<{frame: number; width: number}> = ({frame}) => {
  const scale = interpolate(frame, [T.zoomPunch, T.zoomPunch + sec(1.4)], [1, 1.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 140,
          color: colors.accent,
          transform: `scale(${scale})`,
        }}
      >
        DISCOVERY
      </div>
    </AbsoluteFill>
  );
};

const MapScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = interpolate(frame, [T.mapReveal, T.mapReveal + sec(0.3)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>This Video Covers Discovery</Label>
      <div style={{display: 'flex', gap: 18, marginTop: 12}}>
        {mapNodes.map((n, i) => {
          const delay = T.mapReveal + i * sec(0.15);
          const t = interpolate(frame, [delay, delay + sec(0.35)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
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
                border: `2px solid ${colors.dim}`,
                borderRadius: 6,
                color: colors.dim,
                width: 120,
                opacity: t,
                transform: `scale(${0.5 + t * 0.5})`,
              }}
            >
              {n.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
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

const Kinetic: React.FC<{size: 'huge' | 'big'; children: React.ReactNode}> = ({size, children}) => (
  <div
    style={{
      fontFamily: fonts.display,
      textAlign: 'center',
      lineHeight: 0.98,
      letterSpacing: '-0.01em',
      color: colors.foreground,
      fontSize: size === 'huge' ? 120 : 72,
    }}
  >
    {children}
  </div>
);

const Mark: React.FC<{frame: number; startFrame: number; children: React.ReactNode}> = ({
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
