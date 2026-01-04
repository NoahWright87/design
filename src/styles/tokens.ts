// List of CSS custom properties we want to show in the Storybook color page
export const cssTokenNames = [
  '--foreground',
  '--background',
  '--primary',
  '--secondary',
  '--confirm',
  '--danger',
  '--overlay',
] as const;

export type CssTokenName = typeof cssTokenNames[number];
