import "./styles/theme.css";

// Atoms
export * from "./atoms/nonsense.js";

// Molecules
export * from "./components/molecules/Button/index.js";
export * from "./components/molecules/Link/index.js";
export * from "./components/molecules/Heading/index.js";
export * from "./components/molecules/Text/index.js";
export * from "./components/molecules/Avatar/index.js";
export * from "./components/molecules/Image/index.js";
export * from "./components/molecules/Pill/index.js";
export * from "./components/molecules/HamburgerMenu/index.js";
export * from "./components/molecules/MenuItem.js";
export * from "./components/molecules/Input/index.js";
export * from "./components/molecules/Select/index.js";
export * from "./components/molecules/Checkbox/index.js";
export * from "./components/molecules/RadioGroup/index.js";
export * from "./components/molecules/ToggleIcon/index.js";
export * from "./components/molecules/Badge/index.js";
export * from "./components/molecules/Box/index.js";

// Organisms
export * from "./components/organisms/Header/index.js";
export * from "./components/organisms/Footer/index.js";
export * from "./components/organisms/Layout/index.js";
export * from "./components/organisms/Menu/index.js";
export * from "./components/organisms/MobileNav/index.js";
export * from "./components/organisms/Container/Container.js";
export * from "./components/organisms/Card/index.js";
export * from "./components/organisms/Modal/index.js";
export * from "./components/organisms/Breadcrumbs/index.js";

// Sites
export * from "./sites/portfolio/index.js";

// Theme utilities
export * from "./styles/themeToggle.js";

/** Typed theme input for generating a CSS file at build time. All fields optional. */
export type Theme = {
  // Colors
  foreground?: string;
  background?: string;
  primary?: string;
  secondary?: string;
  confirm?: string;
  danger?: string;
  overlay?: string;
  
  // Spacing
  spacingXs?: string;
  spacingSm?: string;
  spacingMd?: string;
  spacingLg?: string;
  spacingXl?: string;
  
  // Typography
  textXs?: string;
  textSm?: string;
  textMd?: string;
  textLg?: string;
  textXl?: string;
  
  // Border radius
  radius?: string;
  
  // Motion - Durations
  durationFast?: string;
  durationNormal?: string;
  durationSlow?: string;
  
  // Motion - Easing curves
  easeInOut?: string;
  easeBounce?: string;
  easeBouncePress?: string;
  easeBounceRelease?: string;
  
  // Motion - Preset bundles
  motionNoneDuration?: string;
  motionNoneEasing?: string;
  motionSubtleDuration?: string;
  motionSubtleEasing?: string;
  motionSubtlePressDuration?: string;
  motionSubtlePressEasing?: string;
  motionBouncyDuration?: string;
  motionBouncyEasing?: string;
  motionBouncyPressDuration?: string;
  motionBouncyPressEasing?: string;
  
  // Shadows
  shadowSm?: string;
  shadowMd?: string;
  shadowLg?: string;
};

/** Produce minimal CSS custom properties (as a string) from a typed Theme. */
export function buildThemeCss(t: Theme): string {
  const entries: string[] = [];
  
  // Helper to convert camelCase to kebab-case
  const toKebab = (str: string) => str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
  
  for (const [key, value] of Object.entries(t)) {
    if (value !== undefined) {
      entries.push(`--${toKebab(key)}:${value}`);
    }
  }
  
  return entries.length > 0 ? `:root{${entries.join(';')};}` : '';
}
