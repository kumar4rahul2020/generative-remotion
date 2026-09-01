import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {colors, fonts} from '../../style/tokens';

// Proof of concept for the "continuous canvas" approach: one shared world
// coordinate space, a camera (center point + zoom) that animates across
// frames, and objects that persist rather than mounting/unmounting per
// scene. Chains TWO linked scenes (storyboard scenes 2 and 3) to test
// whether the technique composes, not just works in isolation - see
// architecture.md.

type Phase = {
  id: string;
  label: string;
  x: number;
  color: string;
};

const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 900;

const phases: Phase[] = [
  {id: 'capability', label: 'Capability', x: 300, color: colors.phase.capability},
  {id: 'reliability', label: 'Reliability', x: 620, color: colors.phase.reliability},
  {id: 'security', label: 'Security', x: 940, color: colors.phase.security},
  {id: 'scalability', label: 'Scalability', x: 1260, color: colors.phase.scalability},
];

const BOX_Y = 450;
const BOX_W = 220;
const BOX_H = 90;

const HUB_X = phases[0].x + BOX_W / 2;
const HUB_Y = BOX_Y + BOX_H / 2;

const spokeLabels = ['AI', 'Initial Conversation', 'Cost', 'Latency', 'Accuracy', 'Data'];
const SPOKE_RADIUS = 280;
const spokes = spokeLabels.map((label, i) => {
  const angle = (i / spokeLabels.length) * Math.PI * 2 - Math.PI / 2;
  return {
    label,
    x: HUB_X + Math.cos(angle) * SPOKE_RADIUS,
    y: HUB_Y + Math.sin(angle) * SPOKE_RADIUS,
  };
});

// Timeline (30fps):
// Scene 2 (4-phase framework):
//   0-40:    boxes + arrows draw in
//   40-100:  camera zooms into "capability" box
//   100-150: hold on zoomed capability
// Scene 3 (CTO question hub-and-spoke), chained onto the same box/camera:
//   150-190: capability box morphs into "CTO Question" hub, camera eases out
//   190-280: spokes extend outward one at a time
//   280-320: hold on full hub-and-spoke
const HOLD_START = 40;
const ZOOM_START = 40;
const ZOOM_END = 100;
const MORPH_START = 150;
const MORPH_END = 190;
const SPOKES_START = 190;
const SPOKE_STAGGER = 14;
const SPOKE_DURATION = 20;

const lerpColor = (a: string, b: string, t: number) => {
  const pa = a.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

export const PhaseZoomPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const drawProgress = interpolate(frame, [0, HOLD_START], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const zoomT = interpolate(frame, [ZOOM_START, ZOOM_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const morphT = interpolate(frame, [MORPH_START, MORPH_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Camera: whole-row -> tight zoom on capability -> eased-out framing of
  // the hub-and-spoke that capability morphs into. Position never moves
  // after the initial zoom (hub sits where the box was) - only scale
  // changes, which is what makes the morph read as "this box became that
  // hub" rather than a cut to a new place.
  const camFullX = WORLD_WIDTH / 2;
  const camFullY = WORLD_HEIGHT / 2;
  const camFullScale = 1;

  const camZoomScale = 3.2;
  const camHubScale = 1.5;

  const camX = interpolate(zoomT, [0, 1], [camFullX, HUB_X]);
  const camY = interpolate(zoomT, [0, 1], [camFullY, HUB_Y]);
  const camScaleAfterZoom = interpolate(zoomT, [0, 1], [camFullScale, camZoomScale]);
  const camScale = interpolate(morphT, [0, 1], [camScaleAfterZoom, camHubScale]);

  const viewportCenterX = width / 2;
  const viewportCenterY = height / 2;

  const worldTransform = `translate(${viewportCenterX - camX * camScale}px, ${
    viewportCenterY - camY * camScale
  }px) scale(${camScale})`;

  const otherPhaseOpacity = interpolate(zoomT, [0, 0.6, 1], [1, 0.3, 0]);

  const hubBorderColor = lerpColor(colors.phase.capability, colors.foreground, morphT);
  const hubTextOpacityOld = interpolate(morphT, [0.3, 0.7], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hubTextOpacityNew = interpolate(morphT, [0.3, 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: WORLD_WIDTH,
          height: WORLD_HEIGHT,
          transform: worldTransform,
          transformOrigin: 'top left',
        }}
      >
        {/* Connecting line through all phases */}
        <svg
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          style={{position: 'absolute', top: 0, left: 0, opacity: otherPhaseOpacity}}
        >
          <line
            x1={phases[0].x + BOX_W}
            y1={BOX_Y + BOX_H / 2}
            x2={phases[phases.length - 1].x}
            y2={BOX_Y + BOX_H / 2}
            stroke={colors.dim}
            strokeWidth={3}
            strokeDasharray={500}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [500, 0])}
          />
        </svg>

        {/* Spokes: connecting lines + labels, radiating from the hub */}
        <svg
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          style={{position: 'absolute', top: 0, left: 0}}
        >
          {spokes.map((spoke, i) => {
            const spokeStart = SPOKES_START + i * SPOKE_STAGGER;
            const spokeT = interpolate(frame, [spokeStart, spokeStart + SPOKE_DURATION], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            const lineLength = Math.hypot(spoke.x - HUB_X, spoke.y - HUB_Y);
            return (
              <line
                key={spoke.label}
                x1={HUB_X}
                y1={HUB_Y}
                x2={spoke.x}
                y2={spoke.y}
                stroke={colors.dim}
                strokeWidth={2}
                strokeDasharray={lineLength}
                strokeDashoffset={interpolate(spokeT, [0, 1], [lineLength, 0])}
              />
            );
          })}
        </svg>

        {spokes.map((spoke, i) => {
          const spokeStart = SPOKES_START + i * SPOKE_STAGGER;
          const spokeT = interpolate(frame, [spokeStart, spokeStart + SPOKE_DURATION], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.back(1.5)),
          });
          return (
            <div
              key={spoke.label}
              style={{
                position: 'absolute',
                left: spoke.x,
                top: spoke.y,
                transform: `translate(-50%, -50%) scale(${spokeT})`,
                opacity: spokeT,
                color: colors.foreground,
                fontFamily: fonts.family,
                fontSize: 26,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                backgroundColor: colors.background,
                padding: '6px 14px',
                border: `2px solid ${colors.dim}`,
                borderRadius: 8,
              }}
            >
              {spoke.label}
            </div>
          );
        })}

        {phases.map((phase, i) => {
          const isCapability = phase.id === 'capability';
          const boxDelay = i * 6;
          const boxProgress = interpolate(frame, [boxDelay, boxDelay + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.back(1.5)),
          });

          return (
            <div
              key={phase.id}
              style={{
                position: 'absolute',
                left: phase.x,
                top: BOX_Y,
                width: BOX_W,
                height: BOX_H,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${isCapability ? hubBorderColor : colors.dim}`,
                borderRadius: 12,
                opacity: isCapability ? boxProgress : boxProgress * otherPhaseOpacity,
                transform: `scale(${boxProgress})`,
                backgroundColor: colors.background,
              }}
            >
              {isCapability ? (
                <>
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      whiteSpace: 'nowrap',
                      opacity: hubTextOpacityOld,
                      color: colors.phase.capability,
                      fontFamily: fonts.family,
                      fontSize: 32,
                      fontWeight: 600,
                    }}
                  >
                    {phase.label}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      whiteSpace: 'nowrap',
                      opacity: hubTextOpacityNew,
                      color: colors.foreground,
                      fontFamily: fonts.family,
                      fontSize: 26,
                      fontWeight: 600,
                    }}
                  >
                    CTO Question
                  </span>
                </>
              ) : (
                <span
                  style={{
                    color: colors.foreground,
                    fontFamily: fonts.family,
                    fontSize: 32,
                    fontWeight: 600,
                  }}
                >
                  {phase.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
