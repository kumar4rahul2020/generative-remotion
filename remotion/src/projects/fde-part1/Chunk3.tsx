import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {colors, fonts} from '../../style/tokens';
import {spedSec, fadeInOut, Ruler, Label, Kinetic, Mark, MapRow} from './shared';

// Chunk 3, Vox-style (locked - see build-state.md). Ported from
// remotion/prototypes/fde-part1-vox-chunk3/index.html. Covers Stop 5
// alone (verified as a complete thought before building - it's the
// storyboard's own "throughline payoff", resolving all four factors from
// Chunk 2's opening tags).

const T = {
  pipeline: 0,
  fiveMin: spedSec(21.42),
  threeSec: spedSec(22.8),
  adoption: spedSec(31.03),
  accuracy: spedSec(50.3),
  citations: spedSec(53.58),
  cost: spedSec(90.5),
  hourlyRate: spedSec(93.06),
  roi: spedSec(103.64),
  security: spedSec(109.39),
  publicInternet: spedSec(129.0),
  securePerimeter: spedSec(131.93),
  joint3: spedSec(143.96),
  end: spedSec(149),
};

export const CHUNK3_DURATION = T.end;

export const Chunk3: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Ruler frame={frame} />
      {frame < T.joint3 && <Throughline frame={frame} />}

      {frame < T.fiveMin && <PipelineScene frame={frame} />}
      {frame >= T.fiveMin && frame < T.accuracy && <LatencyScene frame={frame} />}
      {frame >= T.accuracy && frame < T.cost && <AccuracyScene frame={frame} />}
      {frame >= T.cost && frame < T.security && <CostScene frame={frame} />}
      {frame >= T.security && frame < T.joint3 && <SecurityScene frame={frame} />}
      {frame >= T.joint3 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <Label>This Video Covers Discovery</Label>
          <MapRow filledCount={5} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// The same Cost/Latency/Accuracy/Data tags from Chunk 2's Stop 1,
// checked off live as this chunk resolves each one - a callback device
// tying the chunks into one argument instead of feeling independent.
const Throughline: React.FC<{frame: number}> = ({frame}) => {
  const resolved = {
    latency: frame >= T.threeSec,
    accuracy: frame >= T.citations,
    cost: frame >= T.roi,
    data: frame >= T.securePerimeter,
  };
  const tags: {key: keyof typeof resolved; label: string; icon: React.ReactNode}[] = [
    {
      key: 'cost',
      label: 'COST',
      icon: (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          {resolved.cost ? (
            <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path
              d="M12 7v10M9.5 15.5c0 1 1 1.8 2.5 1.8s2.5-.8 2.5-1.8-1-1.5-2.5-1.8-2.5-.8-2.5-1.8 1-1.8 2.5-1.8 2.5.7 2.5 1.6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </>
      ),
    },
    {
      key: 'latency',
      label: 'LATENCY',
      icon: (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          {resolved.latency ? (
            <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M12 7v5l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </>
      ),
    },
    {
      key: 'accuracy',
      label: 'ACCURACY',
      icon: (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          {resolved.accuracy ? (
            <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </>
          )}
        </>
      ),
    },
    {
      key: 'data',
      label: 'DATA',
      icon: (
        <>
          {resolved.data ? (
            <>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            <>
              <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="2" />
              <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" stroke="currentColor" strokeWidth="2" />
              <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" stroke="currentColor" strokeWidth="2" />
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{position: 'absolute', top: 62, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 14, zIndex: 10}}>
      {tags.map((tag) => {
        const isResolved = resolved[tag.key];
        return (
          <div
            key={tag.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: fonts.mono,
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: '0.06em',
              padding: '8px 16px',
              border: `2px solid ${isResolved ? colors.accent : colors.dim}`,
              borderRadius: 999,
              color: isResolved ? colors.accent : colors.dim,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" style={{width: 15, height: 15, flexShrink: 0}}>
              {tag.icon}
            </svg>
            {tag.label}
          </div>
        );
      })}
    </div>
  );
};

const pipeStages = [
  {
    label: 'Query',
    icon: (
      <>
        <circle cx="20" cy="20" r="14" stroke={colors.accent} strokeWidth="3" />
        <path d="M30 30l10 10" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Retrieval',
    icon: (
      <>
        <rect x="8" y="6" width="28" height="34" rx="3" stroke={colors.accent} strokeWidth="3" />
        <path d="M14 16h16M14 24h16M14 32h10" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Generation',
    icon: (
      <>
        <path d="M8 30c0-12 8-22 14-22s14 10 14 22" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
        <circle cx="22" cy="34" r="4" fill={colors.accent} />
      </>
    ),
  },
  {
    label: 'Citation',
    icon: (
      <>
        <path d="M14 12l-6 6 6 6M30 12l6 6-6 6" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 10l-6 24" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
];

const PipelineScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, 0, T.fiveMin);
  const stageStagger = spedSec(3.5);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Stop 05 · The Conceptual Solution</Label>
      <Kinetic size="big">HOW IT WORKS</Kinetic>
      <div style={{display: 'flex', alignItems: 'center', marginTop: 20}}>
        {pipeStages.map((stage, i) => {
          const t = interpolate(frame, [i * stageStagger, i * stageStagger + spedSec(0.35)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const arrowT = interpolate(
            frame,
            [(i + 1) * stageStagger - spedSec(1), (i + 1) * stageStagger],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
          );
          return (
            <div key={stage.label} style={{display: 'flex', alignItems: 'center'}}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  width: 160,
                  opacity: t,
                  transform: `scale(${0.8 + t * 0.2})`,
                }}
              >
                <svg viewBox="0 0 44 44" fill="none" style={{width: 44, height: 44}}>
                  {stage.icon}
                </svg>
                <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 18}}>{stage.label}</div>
              </div>
              {i < pipeStages.length - 1 && (
                <div
                  style={{
                    width: 50,
                    height: 2,
                    background: interpolateArrowColor(arrowT),
                    position: 'relative',
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

function interpolateArrowColor(t: number) {
  return t > 0.5 ? colors.accent : colors.dim;
}

const LatencyScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.fiveMin, T.accuracy);
  const manualT = interpolate(frame, [T.fiveMin, T.fiveMin + spedSec(0.4)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const aiT = interpolate(frame, [T.threeSec, T.threeSec + spedSec(0.4)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const adoptionT = interpolate(frame, [T.adoption, T.adoption + spedSec(0.3)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Addressing Latency</Label>
      <div style={{display: 'flex', alignItems: 'center', gap: 40, marginTop: 30}}>
        <div style={{textAlign: 'center', opacity: manualT}}>
          <div style={{fontFamily: fonts.display, fontSize: 64, color: colors.dim}}>5 MIN</div>
          <div style={{fontFamily: fonts.mono, fontSize: 14, color: colors.dim, marginTop: 6, letterSpacing: '0.06em'}}>MANUAL SEARCH</div>
        </div>
        <div style={{fontFamily: fonts.display, fontSize: 40, color: colors.dim}}>→</div>
        <div style={{textAlign: 'center', opacity: aiT}}>
          <div style={{fontFamily: fonts.display, fontSize: 64, color: colors.accent}}>3 SEC</div>
          <div style={{fontFamily: fonts.mono, fontSize: 14, color: colors.dim, marginTop: 6, letterSpacing: '0.06em'}}>AI RESPONSE</div>
        </div>
      </div>
      <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, fontWeight: 600, fontSize: 22, opacity: adoptionT}}>
        <svg viewBox="0 0 32 32" fill="none" style={{width: 32, height: 32, flexShrink: 0}}>
          <rect x="4" y="6" width="24" height="16" rx="2" stroke={colors.accent} strokeWidth="2.5" />
          <path d="M10 26h12" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        DEPLOYED DIRECTLY INTO THE CRM — NEVER SWITCH SCREENS
      </div>
    </AbsoluteFill>
  );
};

const AccuracyScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.accuracy, T.cost);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Addressing Accuracy</Label>
      <Kinetic size="big">
        <Mark frame={frame} startFrame={T.citations}>
          CITATIONS TO INTERNAL DOCUMENTS
        </Mark>
      </Kinetic>
    </AbsoluteFill>
  );
};

const CostScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.cost, T.security);
  const delays = [0, 0.6, 1.6, 2.2, 3.2, 3.8, 5.0].map(spedSec);
  const items: {text: string; isOp: boolean; isResult?: boolean}[] = [
    {text: 'REP HOURLY RATE', isOp: false},
    {text: '×', isOp: true},
    {text: 'CALLS ON HOLD', isOp: false},
    {text: 'vs.', isOp: true},
    {text: 'LLM TOKEN COST', isOp: false},
    {text: '=', isOp: true},
    {text: 'ROI ✓', isOp: false, isResult: true},
  ];
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Addressing Cost</Label>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 30, flexWrap: 'wrap', justifyContent: 'center'}}>
        {items.map((item, i) => {
          const t = interpolate(frame, [T.cost + delays[i], T.cost + delays[i] + spedSec(0.35)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          if (item.isOp) {
            return (
              <div key={i} style={{fontFamily: fonts.display, fontSize: 28, color: colors.dim, opacity: t}}>
                {item.text}
              </div>
            );
          }
          return (
            <div
              key={i}
              style={{
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 20,
                padding: '14px 22px',
                border: `2px solid ${item.isResult ? colors.accent : colors.dim}`,
                borderRadius: 8,
                color: item.isResult ? colors.accent : colors.foreground,
                opacity: t,
                transform: `translateY(${(1 - t) * 10}px)`,
              }}
            >
              {item.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SecurityScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeInOut(frame, T.security, T.joint3);
  const ringStagger = spedSec(1.8);
  const rings = [
    {label: 'PUBLIC INTERNET', crossed: true, size: 420},
    {label: 'PRIVATE CLOUD', crossed: false, size: 280},
    {label: 'ENTERPRISE DATA', crossed: false, size: 140, inner: true},
  ];
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <Label>Addressing Data Security</Label>
      <div style={{position: 'relative', width: 420, height: 420, marginTop: 10}}>
        {rings.map((ring, i) => {
          const t = interpolate(frame, [T.security + i * ringStagger, T.security + i * ringStagger + spedSec(0.4)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const offset = (420 - ring.size) / 2;
          return (
            <div
              key={ring.label}
              style={{
                position: 'absolute',
                width: ring.size,
                height: ring.size,
                top: offset,
                left: offset,
                borderRadius: '50%',
                border: `2px solid ${ring.inner ? colors.accent : colors.dim}`,
                background: ring.inner ? 'rgba(79,209,197,0.08)' : 'transparent',
                display: 'flex',
                alignItems: ring.inner ? 'center' : 'flex-start',
                justifyContent: 'center',
                opacity: t,
                transform: `scale(${0.85 + t * 0.15})`,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: ring.inner ? 15 : 13,
                  letterSpacing: '0.06em',
                  color: ring.inner ? colors.accent : colors.dim,
                  marginTop: ring.inner ? 0 : 12,
                  fontWeight: ring.inner ? 500 : 400,
                  textAlign: 'center',
                  textDecoration: ring.crossed ? 'line-through' : 'none',
                  ...(ring.crossed ? {color: colors.mark} : {}),
                }}
              >
                {ring.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
