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
  // Emit fonts referenced from theme.css as files next to dist/index.css
  loader: { ".woff2": "file" }
});
