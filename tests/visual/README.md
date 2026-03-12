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

## Baselines

Screenshot baselines are stored in `tests/visual/*-snapshots/` and committed to the repository. Update baselines only when visual changes are intentional.
