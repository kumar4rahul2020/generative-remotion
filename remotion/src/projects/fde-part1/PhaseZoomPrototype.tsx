import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {colors, fonts} from '../../style/tokens';

// Proof of concept for the "continuous canvas" approach: one shared world
// coordinate space, a camera (center point + zoom) that animates across
// frames, and objects that persist rather than mounting/unmounting per
// scene. This validates the technique before the full storyboard commits
// to it - see architecture.md.

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

// Timeline (30fps):
// 0-40:   boxes + arrows draw in, camera holds on full row
// 40-100: camera zooms into "capability" box
// 100-150: hold on zoomed capability label
const HOLD_START = 40;
const ZOOM_START = 40;
const ZOOM_END = 100;

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

  const capability = phases[0];

  // Camera: interpolate between "framing the whole row" and "framing just
  // the capability box". Camera state = (focus x, focus y, scale).
  const camFullX = WORLD_WIDTH / 2;
  const camFullY = WORLD_HEIGHT / 2;
  const camFullScale = 1;

  const camZoomX = capability.x + BOX_W / 2;
  const camZoomY = BOX_Y + BOX_H / 2;
  const camZoomScale = 3.2;

  const camX = interpolate(zoomT, [0, 1], [camFullX, camZoomX]);
  const camY = interpolate(zoomT, [0, 1], [camFullY, camZoomY]);
  const camScale = interpolate(zoomT, [0, 1], [camFullScale, camZoomScale]);

  const viewportCenterX = width / 2;
  const viewportCenterY = height / 2;

  const worldTransform = `translate(${viewportCenterX - camX * camScale}px, ${
    viewportCenterY - camY * camScale
  }px) scale(${camScale})`;

  // Other phases fade out as we zoom past them, so the zoomed frame isn't
  // cluttered by boxes now outside the camera's logical focus.
  const otherPhaseOpacity = interpolate(zoomT, [0, 0.6, 1], [1, 0.3, 0]);

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
                border: `3px solid ${isCapability ? phase.color : colors.dim}`,
                borderRadius: 12,
                opacity: isCapability ? boxProgress : boxProgress * otherPhaseOpacity,
                transform: `scale(${boxProgress})`,
                backgroundColor: colors.background,
              }}
            >
              <span
                style={{
                  color: isCapability ? phase.color : colors.foreground,
                  fontFamily: fonts.family,
                  fontSize: 32,
                  fontWeight: 600,
                }}
              >
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
