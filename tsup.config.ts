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
  // WHY: inline fonts into dist/index.css so consumers need no asset handling
  // for files referenced from inside node_modules.
  loader: { ".woff2": "dataurl" }
});
