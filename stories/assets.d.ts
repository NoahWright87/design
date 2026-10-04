// Storybook's Vite build resolves imported font files to their served URL.
declare module "*.woff2" {
  const src: string;
  export default src;
}
