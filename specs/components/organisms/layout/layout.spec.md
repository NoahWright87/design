# Layout — Page Structure Wrapper

## Purpose
Layout provides a page-level structural scaffold that arranges a header, main content area, and footer in the correct visual order. It handles the spacing needed to prevent fixed header and footer elements from overlapping the content.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Header component](../header/header.spec.md)
- [Footer component](../footer/footer.spec.md)

## Contract

### Inputs
- Optional header content.
- Optional footer content.
- Page content (required).

### Outputs
A structured page with header, content area, and footer in the correct order with appropriate spacing applied.

### Guarantees / Constraints
- Content is always padded to prevent overlap with fixed header and footer elements.
- The structure uses semantic landmark elements.

## Behavior

Layout is a structural component with no interactive behavior. It positions its three regions — header, content, footer — and applies the appropriate spacing to the content area.

## Interface

The page is divided into three sections. The header area sits at the top. The content area fills the middle with top and bottom padding to clear any fixed header and footer. The footer sits at the bottom.

This structure accommodates single-page routing — the header and footer remain mounted while only the content area changes.

## Acceptance
1. Renders header, content, and footer regions in the correct order.
2. The content area includes top and bottom padding to prevent overlap with fixed header/footer.
3. Page content renders correctly within the content area.
