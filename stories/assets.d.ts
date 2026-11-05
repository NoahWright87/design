// Storybook's Vite build resolves imported font files to their served URL.
declare module "*.woff2" {
  const src: string;
  export default src;
}

// Vite's `?raw` suffix imports a file's text, e.g. a Mermaid `.mmd` diagram.
declare module "*?raw" {
  const text: string;
  export default text;
}
