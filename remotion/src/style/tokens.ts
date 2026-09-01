export const colors = {
  background: '#000000',
  foreground: '#ffffff',
  dim: '#5a5a5a',
  // One accent per framework phase - used consistently wherever that
  // phase is referenced, per the 3Blue1Brown-style "color is a language"
  // principle (architecture.md).
  phase: {
    capability: '#4fd1c5',
    reliability: '#5a5a5a',
    security: '#5a5a5a',
    scalability: '#5a5a5a',
  },
} as const;

export const fonts = {
  family: 'Helvetica, Arial, sans-serif',
};
