export * from "./components/Button/index.js";
export * from "./components/Link/index.js";
export * from "./components/Heading/index.js";
export * from "./components/Text/index.js";
export * from "./components/Header/index.js";
export * from "./components/Footer/index.js";
export * from "./components/Layout/index.js";
export * from "./components/Avatar/index.js";
export * from "./components/HamburgerMenu/index.js";
export * from "./components/Menu/index.js";
export * from "./components/Menu/MenuItem.js";

/** Typed theme input for generating a CSS file at build time. */
export type Theme = {
  foreground: string;
  background: string;
};

/** Produce minimal CSS custom properties (as a string) from a typed Theme. */
export function buildThemeCss(t: Theme): string {
  return `:root{--foreground:${t.foreground};--background:${t.background};}`;
}
