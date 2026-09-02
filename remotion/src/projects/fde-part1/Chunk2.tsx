import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {colors, fonts} from '../../style/tokens';
import {spedSec, fadeInOut, Ruler, Label, Kinetic, Mark, DotProgress, MapRow} from './shared';

// Chunk 2, Vox-style (locked - see build-state.md). Ported from
// remotion/prototypes/fde-part1-vox-chunk2/index.html. Extended from the
// original Stops 1-3 -> Joint 1 through Stop 4 -> Joint 2, after review
// showed cutting at Joint 1 left the JTBD framework unresolved.

const T = {
  question: 0,
  factorTags: spedSec(19.96),
  framework: spedSec(32.37),
  goal: spedSec(49.57),
  forces: spedSec(52.45),
  fear: spedSec(55.18),
  example: spedSec(57.46),
  doubt: spedSec(80.55),
  fearsStart: spedSec(88.86),
  joint1: spedSec(124.04),
  metrics: spedSec(128.74),
  handleTime: spedSec(131.18),
  closeRate: spedSec(133.07),
  dau: spedSec(134.89),
  correctAnswers: spedSec(146.45),
  returnsInstantly: spedSec(148.28),
  protectsData: spedSec(149.75),
  seamlessIntegration: spedSec(151.36),
  costNeutral: spedSec(158.46),
  joint2: spedSec(161.91),
  end: spedSec(166.5),
};
const FEAR_STAGGER = spedSec(3.2);

export const CHUNK2_DURATION = T.end;

export const Chunk2: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Ruler frame={frame} />

      {frame < T.framework && <QuestionScene frame={frame} />}
      {frame >= T.framework && frame < T.example && <FrameworkScene frame={frame} />}
      {frame >= T.example && frame < T.joint1 && <ExampleScene frame={frame} />}
      {frame >= T.joint1 && frame < T.metrics && <MapBeat filledCount={3} />}
      {frame >= T.metrics && frame < T.joint2 && <MetricsScene frame={frame} />}
      {frame >= T.joint2 && <MapBeat filledCount={4} />}
      <NodeProgressOverlay frame={frame} />
    </AbsoluteFill>
  );
};

const QuestionScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, 0, T.framework);
  const tags = [
    {
      label: 'COST',
      icon: (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 7v10M9.5 15.5c0 1 1 1.8 2.5 1.8s2.5-.8 2.5-1.8-1-1.5-2.5-1.8-2.5-.8-2.5-1.8 1-1.8 2.5-1.8 2.5.7 2.5 1.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      ),
    },
    {
      label: 'LATENCY',
      icon: (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      ),
    },
    {
      label: 'ACCURACY',
      icon: (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </>
      ),
    },
    {
      label: 'DATA',
      icon: (
        <>
          <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="2" />
          <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" stroke="currentColor" strokeWidth="2" />
          <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" stroke="currentColor" strokeWidth="2" />
        </>
      ),
    },
  ];

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Stop 01 · The CTO's Question</Label>
      <svg viewBox="0 0 64 64" fill="none" style={{width: 48, height: 48, marginBottom: 14, opacity: 0.85}}>
        <path
          d="M14 20c-6 4-9 10-9 17 0 7 5 12 11 12s10-5 10-11c0-5-3-9-8-10 1-4 4-7 9-9z"
          fill={colors.accent}
        />
        <path
          d="M40 20c-6 4-9 10-9 17 0 7 5 12 11 12s10-5 10-11c0-5-3-9-8-10 1-4 4-7 9-9z"
          fill={colors.accent}
        />
      </svg>
      <Kinetic size="quote">&quot;HOW CAN I SOLVE A CURRENT BUSINESS PROBLEM USING AI?&quot;</Kinetic>
      <div style={{display: 'flex', gap: 16, marginTop: 32}}>
        {tags.map((tag, i) => {
          const t = interpolate(frame, [T.factorTags + i * spedSec(0.3), T.factorTags + i * spedSec(0.3) + spedSec(0.35)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={tag.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 16,
                letterSpacing: '0.08em',
                padding: '10px 20px',
                border: `2px solid ${interpolateColor(t)}`,
                borderRadius: 999,
                color: interpolateColor(t),
                opacity: t,
                transform: `translateY(${(1 - t) * 10}px) scale(${0.9 + t * 0.1})`,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" style={{width: 18, height: 18, flexShrink: 0}}>
                {tag.icon}
              </svg>
              {tag.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

function interpolateColor(t: number) {
  return t > 0.5 ? colors.accent : colors.dim;
}

const FrameworkScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.framework, T.example);
  const items = [
    {
      at: T.goal,
      word: 'GOAL',
      def: 'what the user is trying to achieve',
      icon: (
        <>
          <circle cx="16" cy="16" r="12" stroke={colors.accent} strokeWidth="2.5" />
          <circle cx="16" cy="16" r="5" stroke={colors.accent} strokeWidth="2.5" />
          <circle cx="16" cy="16" r="1.4" fill={colors.accent} />
        </>
      ),
    },
    {
      at: T.forces,
      word: 'FORCES',
      def: "what's pushing for the change",
      icon: <path d="M18 3L7 18h7l-2 11 12-16h-8z" fill={colors.accent} />,
    },
    {
      at: T.fear,
      word: 'FEAR',
      def: "what's holding them back",
      icon: (
        <>
          <path d="M16 4L4 27h24z" stroke={colors.accent} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M16 13v6" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="16" cy="23" r="1.4" fill={colors.accent} />
        </>
      ),
    },
  ];
  const lineT = interpolate(frame, [T.goal, T.fear], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Stop 02 · The Framework</Label>
      <Kinetic size="big">JOBS TO BE DONE</Kinetic>
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 26, marginTop: 28, alignItems: 'flex-start'}}>
        <svg
          viewBox="0 0 4 300"
          preserveAspectRatio="none"
          style={{position: 'absolute', left: -32, top: 6, width: 4, height: 'calc(100% - 12px)', overflow: 'visible'}}
        >
          <line x1={2} y1={0} x2={2} y2={300} stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
          <line x1={2} y1={0} x2={2} y2={lineT * 300} stroke={colors.accent} strokeWidth={4} />
        </svg>
        {items.map((item) => {
          const t = interpolate(frame, [item.at, item.at + spedSec(0.4)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={item.word}
              style={{display: 'flex', alignItems: 'center', gap: 18, opacity: t, transform: `translateX(${(1 - t) * -24}px)`}}
            >
              <svg viewBox="0 0 32 32" fill="none" style={{width: 32, height: 32, flexShrink: 0}}>
                {item.icon}
              </svg>
              <div>
                <div style={{fontFamily: fonts.display, fontSize: 42, color: colors.foreground, lineHeight: 1}}>{item.word}</div>
                <div style={{fontFamily: fonts.body, fontSize: 16, color: colors.dim, marginTop: 3}}>{item.def}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ExampleScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.example, T.joint1);
  const fears = ['WRONG PRICE?', 'HOW LONG ON HOLD?', 'SENSITIVE DATA?', 'SWITCH SCREENS?'];
  const doubtT = interpolate(frame, [T.doubt, T.doubt + spedSec(0.3)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Stop 03 · The Example</Label>
      <div style={{display: 'flex', gap: 56, marginBottom: 8}}>
        <svg viewBox="0 0 64 64" fill="none" style={{width: 56, height: 56, opacity: 0.9}}>
          <rect x="14" y="6" width="36" height="52" rx="6" stroke={colors.accent} strokeWidth="3" />
          <circle cx="32" cy="48" r="2.5" fill={colors.accent} />
        </svg>
        <svg viewBox="0 0 64 64" fill="none" style={{width: 56, height: 56, opacity: 0.9}}>
          <rect x="10" y="8" width="34" height="44" rx="3" stroke={colors.accent} strokeWidth="3" />
          <circle cx="42" cy="42" r="12" stroke={colors.accent} strokeWidth="3" />
          <path d="M51 51l8 8" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 64 64" fill="none" style={{width: 56, height: 56, opacity: 0.9}}>
          <circle cx="32" cy="34" r="22" stroke={colors.accent} strokeWidth="3" />
          <path d="M32 22v12l9 6" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <Kinetic size="big">THE SALES REP</Kinetic>
      <div style={{marginTop: 26, fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: colors.foreground, opacity: doubtT}}>
        <Mark frame={frame} startFrame={T.doubt}>
          ZERO COST TODAY. WOULD THEY EVEN USE IT?
        </Mark>
      </div>
      <div style={{display: 'flex', gap: 14, marginTop: 26, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100}}>
        {fears.map((fear, i) => {
          const t = interpolate(frame, [T.fearsStart + i * FEAR_STAGGER, T.fearsStart + i * FEAR_STAGGER + spedSec(0.3)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={fear}
              style={{
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: 18,
                padding: '12px 20px',
                border: `2px solid ${colors.mark}`,
                borderRadius: 8,
                color: colors.foreground,
                opacity: t,
                transform: `scale(${0.85 + t * 0.15})`,
              }}
            >
              {fear}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const leftItems = [
  {at: T.handleTime, label: 'Handle Time'},
  {at: T.closeRate, label: 'Close Rate'},
  {at: T.dau, label: 'Daily Active Usage'},
];
const rightItems = [
  {at: T.correctAnswers, label: 'Correct Answers'},
  {at: T.returnsInstantly, label: 'Returns Instantly'},
  {at: T.protectsData, label: 'Protects Data'},
  {at: T.seamlessIntegration, label: 'Seamless Integration'},
  {at: T.costNeutral, label: 'Cost-Neutral'},
];

const MetricsScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.metrics, T.joint2);
  const renderCol = (items: {at: number; label: string}[], heading: string) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 14, minWidth: 260}}>
      <div style={{fontFamily: fonts.mono, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.accent, marginBottom: 6}}>
        {heading}
      </div>
      {items.map((item) => {
        const t = interpolate(frame, [item.at, item.at + spedSec(0.35)], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={item.label}
            style={{
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 22,
              color: colors.foreground,
              opacity: t,
              transform: `translateX(${(1 - t) * -14}px)`,
              paddingBottom: 10,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Stop 04 · Applying the Framework</Label>
      <Kinetic size="big">TWO CRUCIAL THINGS</Kinetic>
      <div style={{display: 'flex', gap: 60, alignItems: 'flex-start', marginTop: 30}}>
        {renderCol(leftItems, 'Business Metrics')}
        <div style={{width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.1)'}} />
        {renderCol(rightItems, 'Operational Constraints')}
      </div>
    </AbsoluteFill>
  );
};

const MapBeat: React.FC<{filledCount: number}> = ({filledCount}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <Label>This Video Covers Discovery</Label>
    <MapRow filledCount={filledCount} />
  </AbsoluteFill>
);

// Shown during stops 1-4 only, not during the joint/map beats - matches
// the prototype (dots track position within this chunk's stops, tied to
// the same 6-node map, never shown while the map itself is on screen).
const NodeProgressOverlay: React.FC<{frame: number}> = ({frame}) => {
  let activeIndex = -1;
  if (frame < T.framework) activeIndex = 0;
  else if (frame < T.example) activeIndex = 1;
  else if (frame < T.joint1) activeIndex = 2;
  else if (frame >= T.metrics && frame < T.joint2) activeIndex = 3;
  if (activeIndex < 0) return null;
  return <DotProgress count={6} activeIndex={activeIndex} />;
};
