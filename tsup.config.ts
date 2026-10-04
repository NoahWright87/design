import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  target: "es2020",
  external: ["react", "react-dom"],
  // WHY: emit fonts as files next to dist/index.css rather than inlining them,
  // so browsers download only the Wright Sans weights a page actually uses.
  loader: { ".woff2": "file" }
});
