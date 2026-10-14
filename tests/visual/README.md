# Visual Regression Testing

This directory contains Playwright visual regression tests for the design system.

## Structure

- `*.spec.ts` - Test files for components and example pages
- `*-snapshots/` - Baseline screenshots for comparison

## Running Tests

```bash
# Run all visual tests
npm run test:visual

# Update baselines (when intentional changes are made)
npm run test:visual:update

# Run tests in UI mode for debugging
npm run test:visual:ui
```

## Test Strategy

Tests cover:
- **Component variations**: Curated meaningful states (not all permutations)
- **Example pages**: Composed layouts using multiple components

All tests navigate to Storybook iframe URLs and wait for stable rendering before capturing screenshots.

## Scene effects checks

Fireworks behavior tests read rendered sky and water pixels, exercise repeated events,
multicolor explosions, frenzy clicks, live particle-limit/automatic-frequency updates, Still/unmount/offscreen/reduced-motion
behavior, and capture review screenshots in
`test-results/`. They require real Chromium with WebGL and do not create or update
screenshot baselines. Run the new and existing SceneFooter tests from the repository root:

```bash
npm run test:visual -- scene-fireworks.spec.ts scenefooter.spec.ts --workers=1
```

Particle, delivery, and controller lifecycle checks use the existing TypeScript compiler
and Node runner, with no browser dependencies:

```bash
node tests/sceneEffects.test.mjs
node tests/typewriterDiff.test.mjs
npm run typecheck
npm run build
npx tsc --strict --module nodenext --moduleResolution nodenext --target es2020 --skipLibCheck --noEmit tests/sceneEffects.types.mts
```

The final command checks the package's built public exports, including rejected invalid
effect types/options. Build the library before running it. In this cloud environment,
the equivalent browser run uses the ignored `.tmp/fireworks.playwright.config.cjs`
override for system Chromium and a static Storybook server after `npm run build-storybook`.

## Baselines

Screenshot baselines are stored in `tests/visual/*-snapshots/` and committed to the repository. Update baselines only when visual changes are intentional.
