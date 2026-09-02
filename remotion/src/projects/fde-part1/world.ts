// Shared world coordinate space for fde-part1's continuous canvas.
// Every chunk imports from here so a later chunk's starting position is
// the exact fact of where an earlier chunk left off, not a guess.
// See architecture.md "Build stage: sequential chunks".

export const WORLD_WIDTH = 1600;
export const WORLD_HEIGHT = 900;

export type SeriesPhase = {
  id: string;
  label: string;
  x: number;
};

export const PHASE_BOX_Y = 450;
export const PHASE_BOX_W = 260;
export const PHASE_BOX_H = 90;

// The 4-part series framework (script.md): Discovery -> Capability &
// Reliability -> Security -> Production. Only "discovery" ever gets a live
// accent color - this video's scope - the other three stay neutral/dim,
// always (they belong to parts 2-4).
export const seriesPhases: SeriesPhase[] = [
  {id: 'discovery', label: 'Discovery', x: 190},
  {id: 'capabilityReliability', label: 'Capability & Reliability', x: 510},
  {id: 'security', label: 'Security', x: 890},
  {id: 'production', label: 'Production', x: 1210},
];

export const discoveryPhase = seriesPhases[0];
export const discoveryCenterX = discoveryPhase.x + PHASE_BOX_W / 2;
export const discoveryCenterY = PHASE_BOX_Y + PHASE_BOX_H / 2;

// The Discovery-phase map: 6 stops, walked in sequence. Centered at world
// center (not at the discovery box position) - the camera moves to here
// as part of the box->map expand transform in Chunk 1.
export type MapNode = {
  id: string;
  label: string;
};

export const MAP_CENTER_X = WORLD_WIDTH / 2;
export const MAP_CENTER_Y = WORLD_HEIGHT / 2;
export const MAP_NODE_SPACING = 230;
export const MAP_NODE_W = 190;
export const MAP_NODE_H = 74;

export const mapNodes: MapNode[] = [
  {id: 'question', label: "The CTO's Question"},
  {id: 'framework', label: 'The Framework'},
  {id: 'example', label: 'The Example'},
  {id: 'metrics', label: 'Metrics & Constraints'},
  {id: 'solution', label: 'The Solution'},
  {id: 'proof', label: 'Proving the Value'},
];

export const mapNodeX = (i: number) =>
  MAP_CENTER_X + (i - (mapNodes.length - 1) / 2) * MAP_NODE_SPACING;
export const mapNodeY = MAP_CENTER_Y;

// A camera state: what the world-transform needs to render a given moment.
export type Camera = {
  x: number;
  y: number;
  scale: number;
};

export const cameraTransform = (
  cam: Camera,
  viewportWidth: number,
  viewportHeight: number,
) =>
  `translate(${viewportWidth / 2 - cam.x * cam.scale}px, ${
    viewportHeight / 2 - cam.y * cam.scale
  }px) scale(${cam.scale})`;
