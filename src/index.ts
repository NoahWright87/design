export * from "./components/Button.js";
export * from "./components/Link.js";
export * from "./components/Heading.js";
export * from "./components/Text.js";

/** Typed theme input for generating a CSS file at build time. */
export type Theme = {
  foreground: string;
  background: string;
};

/** Produce minimal CSS custom properties (as a string) from a typed Theme. */
export function buildThemeCss(t: Theme): string {
  return `:root{--foreground:${t.foreground};--background:${t.background};}`;
}
