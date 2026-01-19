// Molecules
export * from "./components/molecules/Button/index.js";
export * from "./components/molecules/Link/index.js";
export * from "./components/molecules/Heading/index.js";
export * from "./components/molecules/Text/index.js";
export * from "./components/molecules/Avatar/index.js";
export * from "./components/molecules/HamburgerMenu/index.js";
export * from "./components/molecules/MenuItem.js";

// Organisms
export * from "./components/organisms/Header/index.js";
export * from "./components/organisms/Footer/index.js";
export * from "./components/organisms/Layout/index.js";
export * from "./components/organisms/Menu/index.js";
export * from "./components/organisms/Container/Container.js";
export * from "./components/organisms/Card/index.js";
export * from "./components/organisms/Modal/index.js";

// Theme utilities
export * from "./styles/themeToggle.js";

/** Typed theme input for generating a CSS file at build time. */
export type Theme = {
  foreground: string;
  background: string;
  primary: string;
  secondary: string;
  confirm: string;
  danger: string;
  overlay: string;
};

/** Produce minimal CSS custom properties (as a string) from a typed Theme. */
export function buildThemeCss(t: Theme): string {
  return `:root{--foreground:${t.foreground};--background:${t.background};--primary:${t.primary};--secondary:${t.secondary};--confirm:${t.confirm};--danger:${t.danger};--overlay:${t.overlay};}`;
}
