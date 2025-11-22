# Box & BoxBase Specification

## Overview

`BoxBase` is the low-level layout primitive that maps directly to CSS layout and sizing properties with minimal abstraction. `Box` is an opinionated wrapper around `BoxBase` that exposes a simplified API with sensible defaults and presets. These components form the foundational layout system for the design system.

`BoxBase` exists primarily for internal use when implementing future components (e.g., Card, Surface, Sidebar), but it is fully exposed so developers may create custom components using its raw power.

`Box` exists for everyday use and provides a streamlined, developer-friendly interface.

Both components emphasize:

* Minimal dependencies
* Minimal styling
* Predictable behavior
* Forward extensibility

---

## File / Folder Structure

```
components/
│
├── Box/
│   ├── Box.tsx
│   ├── Box.css
│   ├── BoxBase.tsx
│   └── BoxBase.css
│
└── index.ts
```

---

# BoxBase

## Purpose

`BoxBase` is an unopinionated, low-level container component. It is a thin wrapper around a configurable HTML element that applies layout-related CSS properties directly via props.

It is designed to:

* Serve as the internal foundation for more opinionated components
* Provide full layout control without custom CSS
* Allow future extensibility without breaking changes

`BoxBase` should not impose visual design decisions (no borders, shadows, radii, default padding, etc.).

---

## BoxBase API

```tsx
interface BoxBaseProps {
  as?: keyof JSX.IntrinsicElements; // default 'div'

  display?: 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid';
  direction?: 'row' | 'column';

  alignItems?: string;
  justifyContent?: string;

  gap?: string | number;
  padding?: string | number;
  margin?: string | number;

  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;

  background?: string; // default: none
  color?: string;      // default: inherit

  center?: boolean; // shorthand for full flex centering

  children?: React.ReactNode;
}
```

---

## BoxBase Behavior

* Renders the element defined by `as`, defaulting to `<div>`.
* Maps each prop directly to the corresponding CSS property.
* If `center` is true:

  * `display: flex`
  * `align-items: center`
  * `justify-content: center`
* Does **not** apply any default padding, borders, radii, colors, shadows, or animations.
* Accepts all children without modification.
* `BoxBase.css` should be nearly empty.

---

# Box

## Purpose

`Box` is the opinionated, ergonomic layout component used throughout the application. It wraps `BoxBase` and provides layout presets and simplified props.

`Box` is intended to:

* Offer a clean, low-friction API for everyday layouts
* Help developers avoid reinventing layout logic
* Introduce a spacing system (gap and padding enums)
* Support responsive layouts via breakpoint objects

`Box` does **not** introduce visual design elements; it only concerns layout.

---

## Spacing Scale

Fixed spacing scale:

```
sm = 0.25rem
md = 0.5rem
lg = 1rem
```

These map to both `gap` and `padding` enum options.

---

## Breakpoints (for responsive props)

```
sm = 480px
md = 768px
lg = 1024px
```

Used to interpret objects like:

```tsx
layout={{ sm: 'stack', md: 'inline' }}
```

---

## Box API

```tsx
interface BoxProps {
  layout?: 'center' | 'stack' | 'inline';
  // grid intentionally omitted for MVP

  gap?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';

  background?: 'default' | 'inverse' | 'transparent';

  width?: 'auto' | 'full' | string | number;
  height?: 'auto' | 'full' | string | number;

  // Responsive props: object keyed by breakpoints
  layout?: string | { sm?: string; md?: string; lg?: string };
  gap?: string | { sm?: string; md?: string; lg?: string };
  padding?: string | { sm?: string; md?: string; lg?: string };
  width?: string | number | { sm?: string|number; md?: string|number; lg?: string|number };
  height?: string | number | { sm?: string|number; md?: string|number; lg?: string|number };

  children?: React.ReactNode;
}
```

*(Note: although TypeScript doesn't allow duplicate keys, this spec describes the behavior conceptually. Implementation will handle responsive values internally.)*

---

## Box Behavior

### Layout Presets

Each preset affects BoxBase internally.

#### `layout="center"`

```
display: flex;
align-items: center;
justify-content: center;
```

#### `layout="stack"`

```
display: flex;
flex-direction: column;
```

#### `layout="inline"`

```
display: flex;
flex-direction: row;
align-items: center;
```

---

### Gap Behavior

Maps `sm` → `0.25rem`, `md` → `0.5rem`, `lg` → `1rem`.

`none` → `0`.

---

### Padding Behavior

Same scale as gap.

---

### Width / Height

* `auto` → no CSS applied
* `full` → `100%`
* Otherwise: pass through string/number value

Responsive objects apply the appropriate value inside CSS `@media` queries.

---

### Background Behavior

* `default` → `var(--background)`
* `inverse` → `var(--foreground)`
* `transparent` → `transparent`

No borders or other decorations are added.

---

## Box.css

Contains minimal styling:

* Media query generation helpers
* Classnames for each layout preset (optional) but not required

No visual styles.

---

## BoxBase.css

Should be empty or nearly empty.

---

## Integration Examples

### Basic page container

```tsx
<Box padding="md" width="full">
  <Article />
</Box>
```

### Centering content

```tsx
<Box layout="center" height="full">
  <Card />
</Box>
```

### Inline toolbar

```tsx
<Box layout="inline" gap="sm">
  <Button>Save</Button>
  <Button>Cancel</Button>
</Box>
```

### Responsive layout

```tsx
<Box layout={{ sm: 'stack', md: 'inline' }} gap="md">
  <Card />
  <Card />
</Box>
```

---

## Future Enhancements (Out of Scope)

* Grid layout (`columns`, `rows`, auto-fit behavior)
* Surface/Card components with elevation and radius
* Theme-aware spacing tokens
* Additional layout presets
* Margin enums and margin-collapsing utilities

---

This specification defines the complete MVP for `BoxBase` and `Box` components suitable for Copilot-driven implementation.
