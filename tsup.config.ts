import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // Outputs both CommonJS and ESModules formats
  dts: true, // Generate declaration files
  splitting: false,
  sourcemap: true,
  clean: true, // Clean output directory before build
  treeshake: true,
  outDir: 'dist', // Output directory
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.mjs',
    };
  },
  external: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
});
