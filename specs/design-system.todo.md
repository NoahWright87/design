# Design System — Backlog & Organization

## Component Organization Plan
This backlog captures the intended directory structure and Storybook organization for current and future components, organized by atomic level.

### Atoms (Tokens)
- Location: `src/styles/` (not component directories).
- Storybook: Optional future "Design Tokens" section for visualization.
- Includes: colors, spacing, typography, radii, shadows, motion.

### Molecules — Current & Future
- **Current**: Button, Link, Heading, Text, Avatar, HamburgerMenu, MenuItem.
- **Planned**: 
  - `Box`: Simple content wrapper for use inside organisms.
  - `Badge`: Small label/tag component.
  - `Icon`: SVG-based icon component.
  - Form primitives (Input, Select, Checkbox, Radio).

### Organisms — Current & Future
- **Current**: Header, Footer, Layout, Menu, Modal, Card, Container.
- **Planned**:
  - Form component (multi-field form with validation).
  - Table/DataGrid.
  - Pagination control.
  - Breadcrumbs navigation.
  - Sidebar layout.

## Storybook Organization
- `Components/Molecules/` — All molecule stories.
- `Components/Organisms/` — All organism stories.
- `Examples/` — Multi-component composed pages.
- `Design Tokens/` — Optional visualization of atoms (future).

## Src Directory Structure (Proposed)
```
src/
  styles/
    atoms/
      colors.css
      spacing.css
      typography.css
      radii.css
      shadows.css
  components/
    molecules/
      Button/
      Link/
      Heading/
      Text/
      Avatar/
      HamburgerMenu/
      MenuItem/
    organisms/
      Header/
      Footer/
      Layout/
      Menu/
      Modal/
      Card/
      Container/
```

## Notes
- Current flat structure under `src/components/` should be reorganized into `molecules/` and `organisms/` subdirectories.
- Storybook stories should mirror this structure.
- Naming and grouping should follow atomic levels for clarity.
