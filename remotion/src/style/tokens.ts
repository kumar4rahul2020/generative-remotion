export const colors = {
  background: '#000000',
  foreground: '#ffffff',
  dim: '#5a5a5a',
  // Only "discovery" ever gets this accent - this video's scope. The other
  // three series phases (capabilityReliability, security, production) stay
  // dim always; they belong to parts 2-4. One color, one meaning,
  // everywhere it appears - the 3Blue1Brown-style "color is a language"
  // principle (architecture.md).
  accent: '#4fd1c5',
} as const;

export const fonts = {
  family: 'Helvetica, Arial, sans-serif',
};
