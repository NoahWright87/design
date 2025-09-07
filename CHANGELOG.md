# CHANGELOG

This file documents planned and completed changes for the repository.

## Agent instructions
- DO NOT add new entries under `## Version history` unless explicitly asked to.
- DO keep a running list of changes under `## WIP`
  - Combine and summarize entries as you go.  Limit yourself to around five (5) entries about work-in-progress
  - Keep each bullet point brief.  One or two brief sentences/fragments, no huge paragraphs
  - Purpose is to SUMMARIZE.  Git history will give plenty of finer detail.

## WIP

### vX.X.X
- Make package ESM-only: added `exports` (import-only) and removed `main` to avoid advertising a CJS entrypoint.
- Stop producing CommonJS: updated `tsup.config.ts` to emit only `esm` (removed `cjs` format).
- Verified build locally: ran `npm run build` — produced `dist/index.mjs`, source map, and typings (`.d.mts`); no CJS artifacts.
- Note: typings are currently emitted as `.d.mts`; can change to `.d.ts` on request.

## Version history

### v1.0.4
- Release: bump package to `v1.0.4` and publish to npm.

### v0.1.0 — Initial scaffold
- Project scaffold created (components, storybook, build).
