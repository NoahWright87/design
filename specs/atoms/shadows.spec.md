# Shadow Tokens — Spec

## Purpose
Shadow tokens provide a consistent set of depth cues that establish visual hierarchy across components. Rather than each component defining its own shadow, a shared scale ensures that elevation levels relate to each other coherently and on-brand.

## Related
- [Design System Base Spec](../design-system.spec.md)

## Contract

### Inputs
Shadow tokens accept no runtime inputs. They are static, immutable values defined in the theme.

### Outputs
Three named shadow levels — small, medium, and large — each adapted automatically for light and dark themes.

### Guarantees / Constraints
- Token values are stable; existing tokens remain consistent so components that rely on them behave predictably.
- Components choose which shadow level to apply; they may not modify shadow values.
- New shadow scales may be added over time; existing ones remain stable.

## Behavior

Shadows signal elevation — how far above the page surface a particular element appears. A small shadow reads as gently lifted; a large shadow appears prominently raised.

In dark themes, shadows are slightly more pronounced to maintain the same perceived depth against darker backgrounds.

**Usage guidance:**
- Small shadows suit elements that sit just above the page: cards, dropdowns, and subtle hover states.
- Medium shadows suit elements that demand more visual presence: modals, popovers, and floating panels.
- Large shadows suit the most prominent elevated elements where strong depth is appropriate.

## Interface

Three shadow levels form a clear hierarchy from subtle to prominent:
- **Small** — a gentle lift suitable for cards and secondary floating elements.
- **Medium** — a moderate shadow for dialogs, popovers, and floating elements.
- **Large** — a strong shadow for the most visually prominent elevated elements.

Both light and dark themes provide all three levels, with dark-mode shadows slightly stronger to maintain the same perceived depth against darker backgrounds.

## Acceptance
1. All three shadow levels are defined as named tokens in the theme.
2. Both light and dark theme variants are provided for each level.
3. The shadow scale reads as a clear hierarchy from small to large.
4. Each level's appropriate use case is documented.
