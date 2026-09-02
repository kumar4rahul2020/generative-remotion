import {AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {colors} from '../style/tokens';
import audioEnvelope from './audio-envelope-fde-part1.json';

// EXPERIMENT - abstract/artistic direction, separate from the approved
// pipeline. A central glowing shape whose pulse is driven by REAL audio
// amplitude (not timed/faked), morphing between simple geometric forms
// (circle -> square -> triangle), 3Blue1Brown-style. See
// architecture.md's experiments convention.

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

export const GLOWMORPH_DURATION = sec(29.5);

const CENTER_X = 960;
const CENTER_Y = 540;
const BASE_RADIUS = 160;
const POINTS = 72;

// A shape is "k sides" for the regular-polygon radius formula (large k
// reads as a circle). rotation orients each shape (square axis-aligned,
// triangle pointing up).
type ShapeDef = {sides: number; rotation: number};
const CIRCLE: ShapeDef = {sides: 64, rotation: 0};
const SQUARE: ShapeDef = {sides: 4, rotation: Math.PI / 4};
const TRIANGLE: ShapeDef = {sides: 3, rotation: -Math.PI / 2};
const sequence: ShapeDef[] = [CIRCLE, SQUARE, TRIANGLE];

// Regular k-gon radius as a function of angle - same formula for every
// shape, so every shape produces a radius array on the SAME angular grid.
// That shared grid is what makes linear interpolation between two shapes'
// radius arrays read as a smooth morph rather than a cross-fade.
function regularPolygonRadius(theta: number, shape: ShapeDef, r: number): number {
  const k = shape.sides;
  const t = theta - shape.rotation;
  const sector = (2 * Math.PI) / k;
  const wrapped = (((t % sector) + sector) % sector) - sector / 2;
  return (r * Math.cos(Math.PI / k)) / Math.cos(wrapped);
}

function shapeRadii(shape: ShapeDef, r: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < POINTS; i++) {
    const theta = (i / POINTS) * Math.PI * 2;
    out.push(regularPolygonRadius(theta, shape, r));
  }
  return out;
}

function pointsToSvg(radii: number[], cx: number, cy: number): string {
  return radii
    .map((r, i) => {
      const theta = (i / POINTS) * Math.PI * 2;
      const x = cx + Math.cos(theta) * r;
      const y = cy + Math.sin(theta) * r;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

const SHAPE_HOLD = sec(2.2);
const MORPH_DUR = sec(0.9);
const CYCLE = SHAPE_HOLD + MORPH_DUR;

export const GlowMorphExperiment: React.FC = () => {
  const frame = useCurrentFrame();

  // Smoothed amplitude (a light trailing average) so the pulse reads as
  // breathing with the voice rather than jittering frame to frame.
  const smoothed = smooth(audioEnvelope as number[], frame, 4);

  const cyclePos = frame % CYCLE;
  const shapeIndex = Math.floor(frame / CYCLE) % sequence.length;
  const nextShapeIndex = (shapeIndex + 1) % sequence.length;

  const morphT =
    cyclePos < SHAPE_HOLD
      ? 0
      : interpolate(cyclePos, [SHAPE_HOLD, CYCLE], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        });

  const pulseRadius = BASE_RADIUS * (1 + smoothed * 0.22);
  const fromRadii = shapeRadii(sequence[shapeIndex], pulseRadius);
  const toRadii = shapeRadii(sequence[nextShapeIndex], pulseRadius);
  const radii = fromRadii.map((r, i) => r + (toRadii[i] - r) * morphT);

  const points = pointsToSvg(radii, CENTER_X, CENTER_Y);

  const glowOpacity = 0.35 + smoothed * 0.45;
  const haloScale = 1.3 + smoothed * 0.35;

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Audio src={staticFile('audio/fde-part1-narration.wav')} trimAfter={GLOWMORPH_DURATION} />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="halo-blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>

        {/* Outer halo - large, soft, reacts most visibly to amplitude */}
        <polygon
          points={points}
          fill={colors.accent}
          opacity={glowOpacity * 0.4}
          filter="url(#halo-blur)"
          transform={`translate(${CENTER_X}, ${CENTER_Y}) scale(${haloScale}) translate(${-CENTER_X}, ${-CENTER_Y})`}
        />

        {/* Core shape with glow filter */}
        <polygon points={points} fill={colors.accent} filter="url(#glow)" opacity={0.95} />
      </svg>
    </AbsoluteFill>
  );
};

function smooth(arr: number[], frame: number, window: number): number {
  let sum = 0;
  let count = 0;
  for (let i = Math.max(0, frame - window); i <= frame; i++) {
    if (arr[i] !== undefined) {
      sum += arr[i];
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}
