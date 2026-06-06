# Card — Backlog

## Sooner
- [x] Elevated by default: Change default visual treatment to slightly elevated (subtle shadow). Add a `flat` prop to opt out.

## Later
- [x] Grid layout support: Make Cards easy to arrange in grids — consider a `size` prop for smaller variants that flow horizontally and wrap. On small screens they should stack vertically.
  - Evaluate whether a `CardGroup` wrapper component is warranted for complex grid arrangements.
- [x] Scrollable card body: Add a `maxHeight` prop (and/or `scrollable` boolean) that constrains the card body height and enables `overflow-y: auto` so long content scrolls within the card.

## Backlog
- Variants: Different card types (feature, testimonial, product listing).
- Loading state: Skeleton or placeholder while loading.
