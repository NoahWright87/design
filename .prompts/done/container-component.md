# Container Component Specification

## Overview

`Container` is a **highly-opinionated, minimal, flex-based layout component** designed as the foundation of the design system. It focuses on ease‑of‑use, predictable behavior, and a mental model closer to “writing in Google Docs” than working with raw CSS. It intentionally exposes only a small set of carefully chosen props.

`Container` is *not* intended to be a universal layout primitive. It is a simple building block for creating common content layouts such as page columns, pull‑quotes, sections, and early card‑style elements.

The component will evolve iteratively; additional complexity will be introduced only when needed.

---

## File / Folder Structure

```
components/
  Container/
    Container.tsx
    Container.css
```

---

# Container API

```tsx
interface ContainerProps {
  direction?: 'vertical' | 'horizontal';

  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?:  'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  itemSpacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  backgroundColor?: string;   // accepts any CSS color (hex, var(), rgb, named, etc.)
  foregroundColor?: string;   // same behavior; defaults to var(--foreground)

  width?:  string | number;   // 100 or "100%" both treated as width: 100%
  height?: string | number;   // 100 or "100%" acceptable; default auto

  wrap?: 'always'; // MVP: always wrap; reserved for future flexibility

  children?: React.ReactNode;
}
```

---

# Defaults

* **direction:** `vertical`
* **padding:** `md`
* **margin:** `none`
* **itemSpacing:** `sm`
* **backgroundColor:** `transparent`
* **foregroundColor:** `var(--foreground)`
* **width:** `100%`
* **height:** `auto`
* **wrap:** `always`

---

# Behavior

### Flex Layout

`Container` always uses:

```
display: flex;
flex-wrap: wrap;
```

### Direction

* `vertical` → `flex-direction: column;`
* `horizontal` → `flex-direction: row;`

### Spacing System

Spacing enums map to fixed values:

```
xs = 0.125rem
sm = 0.25rem
md = 0.5rem
lg = 1rem
xl = 2rem
```

Applies to:

* `padding` → internal padding of the container
* `margin` → external padding around the container
* `itemSpacing` → space between children (`gap`)

### Width & Height Parsing

* Numeric values (e.g., `100`) are treated as `%`.
* String values are passed directly (e.g., `'50%'`, `'20rem'`).
* Defaults: width `100%`, height `auto`.

### Colors

`backgroundColor` and `foregroundColor` accept any valid CSS color string.
Defaults:

* background: `transparent`
* foreground: `var(--foreground)`

---

# CSS Implementation Notes

`Container.css` contains:

* Class for base flex layout
* Classes for each `direction`
* Classes for each spacing preset
* A small utility to handle width/height patterns if needed

No visual styling (borders, shadows, radii, etc.).

---

# Example Usage

### Basic Page Layout

```tsx
<Container>
  <Article />
</Container>
```

### Horizontal Toolbar

```tsx
<Container direction="horizontal" itemSpacing="md">
  <Button>Save</Button>
  <Button>Cancel</Button>
</Container>
```

### Pull Quote Section

```tsx
<Container padding="lg" backgroundColor="var(--background)">
  <Quote text="..." />
</Container>
```

### Custom Width

```tsx
<Container width="50%" padding="sm">
  <Card />
</Container>
```

---

# Storybook Requirements

* **One freeform story**: text inputs for all props
* **All other stories**: dropdowns for every prop to encourage exploration
* Stories should visually demonstrate each preset without requiring manual input

---

# Notes

This specification is intentionally minimal. Additional layout components (e.g., Hero, Card, Surface) will be built on top of `Container` as the design system matures.
