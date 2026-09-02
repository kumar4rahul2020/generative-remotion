import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {colors, fonts} from '../../style/tokens';
import {spedSec, fadeInOut, Ruler, Label, Kinetic} from './shared';
import {mapNodes} from './world';

// Chunk 4 (final), Vox-style (locked - see build-state.md). Ported from
// remotion/prototypes/fde-part1-vox-chunk4/index.html. This is the video's
// actual end - no next chunk, so no boundary-completeness risk to check
// (unlike Chunks 2 and 3).

const T = {
  proof: 0,
  goldenSet: spedSec(8.77),
  rapidPrototype: spedSec(15.14),
  payoff: spedSec(23.99),
  closing: spedSec(31.25),
  outro1: spedSec(33.97),
  outro2: spedSec(49.76),
  outro3: spedSec(59.17),
  end: spedSec(67),
};

export const CHUNK4_DURATION = T.end;

export const Chunk4: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Ruler frame={frame} />

      {frame < T.payoff && <ProofScene frame={frame} />}
      {frame >= T.payoff && frame < T.closing && <PayoffScene frame={frame} />}
      {frame >= T.closing && frame < T.outro1 && <ClosingScene frame={frame} />}
      {frame >= T.outro1 && frame < T.outro2 && <OutroScene frame={frame} start={T.outro1} end={T.outro2}>
        A FRAMEWORK,
        <br />
        NOT JUST AN ANSWER
      </OutroScene>}
      {frame >= T.outro2 && frame < T.outro3 && <OutroScene frame={frame} start={T.outro2} end={T.outro3}>
        APPLIED UNIVERSALLY
        <br />
        ACROSS ANY AI INTERVIEW
      </OutroScene>}
      {frame >= T.outro3 && <ThankYouScene frame={frame} />}
    </AbsoluteFill>
  );
};

const pathStages = [
  {
    at: T.proof,
    label: 'Golden Set of Queries',
    icon: (
      <>
        <rect x="6" y="6" width="32" height="32" rx="4" stroke={colors.accent} strokeWidth="3" />
        <path d="M14 18h16M14 24h16M14 30h10" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    at: T.goldenSet,
    label: 'Rapid Prototype',
    icon: (
      <>
        <path d="M22 6l14 8v16l-14 8-14-8V14z" stroke={colors.accent} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="22" cy="22" r="5" stroke={colors.accent} strokeWidth="2.5" />
      </>
    ),
  },
  {
    at: T.rapidPrototype,
    label: 'Technically Solvable',
    icon: (
      <>
        <circle cx="22" cy="22" r="16" stroke={colors.accent} strokeWidth="3" />
        <path d="M14 22l6 6 12-12" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

const ProofScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, 0, T.payoff);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Stop 06 · Proving the Value</Label>
      <Kinetic size="big">A LOW-RISK PATH TO PROVE IT</Kinetic>
      <div style={{display: 'flex', alignItems: 'center', marginTop: 26}}>
        {pathStages.map((stage, i) => {
          const t = interpolate(frame, [stage.at, stage.at + spedSec(0.35)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const isResult = i === pathStages.length - 1;
          return (
            <div key={stage.label} style={{display: 'flex', alignItems: 'center'}}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  width: 190,
                  opacity: t,
                  transform: `scale(${0.8 + t * 0.2})`,
                }}
              >
                <svg viewBox="0 0 44 44" fill="none" style={{width: 44, height: 44}}>
                  {stage.icon}
                </svg>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontWeight: 600,
                    fontSize: 18,
                    textAlign: 'center',
                    color: isResult ? colors.accent : colors.foreground,
                  }}
                >
                  {stage.label}
                </div>
              </div>
              {i < pathStages.length - 1 && (
                <div
                  style={{
                    width: 46,
                    height: 2,
                    background:
                      interpolate(
                        frame,
                        [pathStages[i + 1].at - spedSec(0.5), pathStages[i + 1].at],
                        [0, 1],
                        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
                      ) > 0.5
                        ? colors.accent
                        : colors.dim,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// THE screenshot moment - the complete map, held static, longer than
// anything else in the video. All 6 nodes filled, subtly emphasized.
const PayoffScene: React.FC<{frame: number}> = ({frame}) => {
  const settleT = interpolate(frame, [T.payoff, T.payoff + spedSec(0.6)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <Label>This Video Covered Discovery</Label>
      <div style={{display: 'flex', gap: 18, marginTop: 12}}>
        {mapNodes.map((n) => (
          <div
            key={n.id}
            style={{
              fontFamily: fonts.body,
              fontWeight: 500,
              fontSize: 15,
              textAlign: 'center',
              lineHeight: 1.3,
              padding: '16px 14px',
              border: `2px solid ${colors.accent}`,
              borderRadius: 6,
              color: colors.foreground,
              width: 120,
              transform: `scale(${1 + settleT * 0.04})`,
            }}
          >
            {n.label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const seriesPhaseLabels = [
  {label: 'Discovery', state: 'done'},
  {label: 'Capability & Reliability', state: 'next'},
  {label: 'Security', state: 'dim'},
  {label: 'Production', state: 'dim'},
] as const;

const ClosingScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.closing, T.outro1, spedSec(0.4), spedSec(0.4));
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Part 01 Complete</Label>
      <div style={{display: 'flex', gap: 24, marginTop: 8}}>
        {seriesPhaseLabels.map((phase) => (
          <div
            key={phase.label}
            style={{
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 20,
              padding: '16px 22px',
              border: `2px solid ${phase.state === 'done' ? colors.accent : phase.state === 'next' ? colors.foreground : colors.dim}`,
              borderRadius: 4,
              color: phase.state === 'done' ? colors.accent : phase.state === 'next' ? colors.foreground : colors.dim,
              textAlign: 'center',
            }}
          >
            {phase.label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{frame: number; start: number; end: number; children: React.ReactNode}> = ({
  frame,
  start,
  end,
  children,
}) => {
  const opacity = fadeInOut(frame, start, end, spedSec(0.5), spedSec(0.5));
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Kinetic size="big">{children}</Kinetic>
    </AbsoluteFill>
  );
};

const ThankYouScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.outro3, T.end, spedSec(0.5), spedSec(0.3));
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Kinetic size="huge">THANK YOU</Kinetic>
      <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 22, color: colors.dim, marginTop: 18}}>
        Feedback welcome — see you in Part 2
      </div>
    </AbsoluteFill>
  );
};
