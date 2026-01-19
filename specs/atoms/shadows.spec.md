# Shadow Tokens — Spec

## Overview
Shadow tokens are atomic design primitives that add depth and hierarchy to UI elements. Shadows vary between light and dark themes to maintain appropriate contrast and visual weight.

## Token Definitions

### Light Mode (default)
- `--shadow-sm`: `0 2px 8px rgba(0, 0, 0, 0.15)` — Subtle elevation
- `--shadow-md`: `0 4px 16px rgba(0, 0, 0, 0.25)` — Moderate elevation
- `--shadow-lg`: `0 10px 30px rgba(0, 0, 0, 0.35)` — High elevation

### Dark Mode
Shadows are slightly more prominent in dark mode for better definition:
- `--shadow-sm`: `0 2px 8px rgba(0, 0, 0, 0.4)`
- `--shadow-md`: `0 4px 16px rgba(0, 0, 0, 0.5)`
- `--shadow-lg`: `0 10px 30px rgba(0, 0, 0, 0.6)`

## Usage Guidelines
1. Use `--shadow-sm` for cards, dropdowns, and subtle hover states.
2. Use `--shadow-md` for modals, popovers, and floating elements.
3. Use `--shadow-lg` for prominent interactive elements like buttons or hero sections.
4. Shadows should enhance depth, not overwhelm content.

## Design Philosophy
Shadows contribute to the design system's **polished, not sterile** aesthetic. They add dimension without feeling heavy or overdone. In dark mode, slightly stronger shadows maintain visual hierarchy against darker backgrounds.

## Constraints
- Shadow tokens are immutable atoms. They do not accept props or vary.
- Components choose which shadow token to use but cannot modify shadow values.
- New shadow scales can be added, but existing ones should remain stable.

## Acceptance Criteria
1. All shadow tokens are defined as CSS custom properties in `theme.css`.
2. Shadows vary appropriately between light and dark themes.
3. Shadow values follow a clear hierarchy (sm < md < lg).
4. Documentation explains appropriate use cases for each shadow scale.
