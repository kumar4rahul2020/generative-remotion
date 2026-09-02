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
  // Annotation-mark color only (the live-drawn underline sweep under a
  // callout phrase) - never used for anything else, per visual-notes.md's
  // "two accent colors, each with one meaning" rule.
  mark: '#ff6b4a',
} as const;

// Vox-style typography (visual-notes.md): Archivo Black for kinetic
// headlines, IBM Plex Sans for body/callouts, IBM Plex Mono for technical
// labels - chosen for the engineering-interview subject specifically.
export const fonts = {
  family: 'Helvetica, Arial, sans-serif',
  display: 'Archivo Black, Helvetica, Arial, sans-serif',
  body: 'IBM Plex Sans, Helvetica, Arial, sans-serif',
  mono: 'IBM Plex Mono, Menlo, monospace',
};
