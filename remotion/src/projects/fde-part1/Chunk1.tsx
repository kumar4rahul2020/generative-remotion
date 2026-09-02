import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {colors, fonts} from '../../style/tokens';
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  seriesPhases,
  discoveryCenterX,
  discoveryCenterY,
  PHASE_BOX_Y,
  PHASE_BOX_W,
  PHASE_BOX_H,
  MAP_CENTER_X,
  MAP_CENTER_Y,
  mapNodes,
  mapNodeX,
  mapNodeY,
  MAP_NODE_W,
  MAP_NODE_H,
  cameraTransform,
  type Camera,
} from './world';

// Chunk 1 (storyboard.md Scenes 1-3): title -> series framework
// establishing shot, with a highlight walk synced to each phase actually
// being named in the narration -> zoom into Discovery -> expand into the
// empty 6-stop map. Ends on the map fully revealed, empty - the exact
// starting fact Chunk 2 continues from (see build-state.md).

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

// Real timestamps resolved against timestamps.json (see storyboard.md).
const TITLE_START = sec(0.05);
const FRAMEWORK_START = sec(9.22);
const BOXES_DRAWN_BY = FRAMEWORK_START + sec(2);
const DISCOVERY_NAMED = sec(28.9);
const CAP_REL_NAMED = sec(51.4);
const SECURITY_NAMED = sec(67.18);
const PRODUCTION_NAMED = sec(80.88);
const PART_ONE_LINE = sec(88.9);
const MAP_REVEAL_END = sec(95.86);

const ZOOM_END = PART_ONE_LINE + sec(2.1);
const EXPAND_END = ZOOM_END + sec(3);
// MAP_REVEAL_END is the hold after expand - total chunk length.
export const CHUNK1_DURATION = MAP_REVEAL_END;

const highlightWindows: Record<string, [number, number]> = {
  discovery: [DISCOVERY_NAMED, CAP_REL_NAMED],
  capabilityReliability: [CAP_REL_NAMED, SECURITY_NAMED],
  security: [SECURITY_NAMED, PRODUCTION_NAMED],
  production: [PRODUCTION_NAMED, PART_ONE_LINE],
};

export const Chunk1: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // --- Title ---
  const titleOpacity = interpolate(
    frame,
    [TITLE_START, TITLE_START + sec(0.6), FRAMEWORK_START - sec(0.8), FRAMEWORK_START],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // --- Series framework boxes draw in ---
  const boxesDrawT = interpolate(frame, [FRAMEWORK_START, BOXES_DRAWN_BY], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // --- Zoom into Discovery, then expand into the map ---
  const zoomT = interpolate(frame, [PART_ONE_LINE, ZOOM_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const expandT = interpolate(frame, [ZOOM_END, EXPAND_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const camFull: Camera = {x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2, scale: 1};
  const camDiscovery: Camera = {x: discoveryCenterX, y: discoveryCenterY, scale: 3.4};
  const camMap: Camera = {x: MAP_CENTER_X, y: MAP_CENTER_Y, scale: 1.15};

  const camAfterZoom: Camera = {
    x: interpolate(zoomT, [0, 1], [camFull.x, camDiscovery.x]),
    y: interpolate(zoomT, [0, 1], [camFull.y, camDiscovery.y]),
    scale: interpolate(zoomT, [0, 1], [camFull.scale, camDiscovery.scale]),
  };
  const cam: Camera = {
    x: interpolate(expandT, [0, 1], [camAfterZoom.x, camMap.x]),
    y: interpolate(expandT, [0, 1], [camAfterZoom.y, camMap.y]),
    scale: interpolate(expandT, [0, 1], [camAfterZoom.scale, camMap.scale]),
  };

  const worldTransform = cameraTransform(cam, width, height);

  // Non-discovery boxes fade as the camera leaves them behind.
  const otherPhasesOpacity = interpolate(zoomT, [0, 0.6, 1], [1, 0.25, 0]);
  // The discovery box itself fades out as it becomes the map (expand phase).
  const discoveryBoxOpacity = interpolate(expandT, [0, 0.4], [1, 0], {
    extrapolateRight: 'clamp',
  });
  const mapLineOpacity = interpolate(expandT, [0.3, 1], [0, 1], {extrapolateLeft: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      {/* Narration. Chunk 1 starts at absolute 0 in narration.wav, so no
          trimBefore is needed - trimAfter caps it at this chunk's end. */}
      <Audio src={staticFile('audio/fde-part1-narration.wav')} trimAfter={CHUNK1_DURATION} />

      {/* Title */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: titleOpacity,
        }}
      >
        <span
          style={{
            color: colors.foreground,
            fontFamily: fonts.family,
            fontSize: 54,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Google FDE Interview Experience
        </span>
      </AbsoluteFill>

      {/* World */}
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
        {/* Connecting line across the series phases */}
        <svg
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          style={{position: 'absolute', top: 0, left: 0, opacity: otherPhasesOpacity}}
        >
          <line
            x1={seriesPhases[0].x + PHASE_BOX_W}
            y1={PHASE_BOX_Y + PHASE_BOX_H / 2}
            x2={seriesPhases[seriesPhases.length - 1].x}
            y2={PHASE_BOX_Y + PHASE_BOX_H / 2}
            stroke={colors.dim}
            strokeWidth={3}
            strokeDasharray={1200}
            strokeDashoffset={interpolate(boxesDrawT, [0, 1], [1200, 0])}
          />
        </svg>

        {seriesPhases.map((phase, i) => {
          const isDiscovery = phase.id === 'discovery';
          const boxDelay = i * sec(0.15);
          const drawIn = interpolate(
            frame,
            [FRAMEWORK_START + boxDelay, FRAMEWORK_START + boxDelay + sec(0.5)],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))},
          );

          const window = highlightWindows[phase.id];
          const highlightT = window
            ? interpolate(frame, [window[0], window[0] + sec(0.4), window[1] - sec(0.4), window[1]], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 0;

          // Discovery permanently takes the accent once we commit to
          // zooming into it (from PART_ONE_LINE onward) - before that, its
          // highlight beat is the same neutral brighten every phase gets.
          const discoveryCommitted = interpolate(frame, [PART_ONE_LINE, PART_ONE_LINE + sec(0.4)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const borderColor = isDiscovery
            ? lerp3(colors.dim, colors.foreground, colors.accent, Math.max(highlightT, discoveryCommitted))
            : lerp3(colors.dim, colors.foreground, colors.dim, highlightT);

          const opacity = drawIn * (isDiscovery ? discoveryBoxOpacity : otherPhasesOpacity);
          const scale = drawIn * interpolate(highlightT, [0, 1], [1, 1.06]);

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
                border: `3px solid ${borderColor}`,
                borderRadius: 12,
                opacity,
                transform: `scale(${scale})`,
                backgroundColor: colors.background,
              }}
            >
              <span
                style={{
                  color: isDiscovery
                    ? lerp3(colors.foreground, colors.foreground, colors.accent, discoveryCommitted)
                    : colors.foreground,
                  fontFamily: fonts.family,
                  fontSize: 28,
                  fontWeight: 600,
                }}
              >
                {phase.label}
              </span>
            </div>
          );
        })}

        {/* The map: nodes animate OUT from the discovery box's exact
            position to their spread layout, so this reads as the box
            becoming the map, not two separately-positioned things
            cross-fading. */}
        <svg
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          style={{position: 'absolute', top: 0, left: 0, opacity: mapLineOpacity}}
        >
          <line
            x1={mapNodeX(0)}
            y1={mapNodeY}
            x2={mapNodeX(mapNodes.length - 1)}
            y2={mapNodeY}
            stroke={colors.dim}
            strokeWidth={2}
            strokeDasharray={1400}
            strokeDashoffset={interpolate(expandT, [0.3, 1], [1400, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
          />
        </svg>
        {mapNodes.map((node, i) => {
          const nodeT = interpolate(expandT, [0, 1], [0, 1], {easing: Easing.out(Easing.cubic)});
          const nodeX = interpolate(nodeT, [0, 1], [discoveryCenterX, mapNodeX(i)]);
          const nodeY = interpolate(nodeT, [0, 1], [discoveryCenterY, mapNodeY]);
          const nodeScale = interpolate(expandT, [0, 0.3, 1], [0.15, 0.4, 1]);
          const nodeOpacity = interpolate(expandT, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'});

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: nodeX - MAP_NODE_W / 2,
                top: nodeY - MAP_NODE_H / 2,
                width: MAP_NODE_W,
                height: MAP_NODE_H,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 8px',
                border: `2px solid ${colors.dim}`,
                borderRadius: 10,
                backgroundColor: colors.background,
                opacity: nodeOpacity,
                transform: `scale(${nodeScale})`,
              }}
            >
              <span
                style={{
                  color: colors.dim,
                  fontFamily: fonts.family,
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Three-stop color lerp (dim -> foreground -> accent), used for the
// highlight-then-settle pulse each phase box gets.
function lerp2(a: string, b: string, t: number) {
  const pa = a.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, t))));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
function lerp3(a: string, b: string, c: string, t: number) {
  return t <= 0.5 ? lerp2(a, b, t * 2) : lerp2(b, c, (t - 0.5) * 2);
}
