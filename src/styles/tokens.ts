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

// Spacing tokens
export const spacingTokens = [
  '--spacing-xs',
  '--spacing-sm',
  '--spacing-md',
  '--spacing-lg',
  '--spacing-xl',
] as const;

// Typography tokens
export const typographyTokens = [
  '--text-xs',
  '--text-sm',
  '--text-md',
  '--text-lg',
  '--text-xl',
] as const;

// Border radius token
export const radiusToken = '--radius' as const;

// Motion tokens - Durations
export const durationTokens = [
  '--duration-fast',
  '--duration-normal',
  '--duration-slow',
] as const;

// Motion tokens - Easing
export const easingTokens = [
  '--ease-in-out',
  '--ease-bounce',
  '--ease-bounce-press',
  '--ease-bounce-release',
] as const;

// Motion tokens - Presets
export const motionPresetTokens = [
  '--motion-none-duration',
  '--motion-none-easing',
  '--motion-subtle-duration',
  '--motion-subtle-easing',
  '--motion-subtle-press-duration',
  '--motion-subtle-press-easing',
  '--motion-bouncy-duration',
  '--motion-bouncy-easing',
  '--motion-bouncy-press-duration',
  '--motion-bouncy-press-easing',
] as const;

// Shadow tokens
export const shadowTokens = [
  '--shadow-sm',
  '--shadow-md',
  '--shadow-lg',
] as const;
