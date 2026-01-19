# MenuItem — Individual Menu Item

## Overview
- Purpose: Render an individual menu item (button or link) within a Menu component; auto-closes menu on click via MenuContext.
- Implementation: Renders `<button>` or `<a>` based on presence of `href`; consumes MenuContext to trigger menu close.
- Design system integration: Uses theme colors and token values via CSS; semantic HTML roles.

## API
- Props:
  - **text**: Optional string for item label (primary).
  - **label**: Optional string for item label (deprecated alias for `text`).
  - **icon**: Optional React node for leading icon.
  - **href**: Optional URL string. If provided, renders as `<a>`; otherwise, `<button>`.
  - **onClick**: Optional click handler. Called before menu closes.
- DOM:
  - Element: `<button role="menuitem">` (if no href) or `<a role="menuitem" href={href}>` (if href).
  - Classes: `nw-menu-item`, `nw-menu-item__icon`, `nw-menu-item__text`.
  - Children: Icon span (if icon) and text span.

## Visuals
- Layout: Flex row with optional icon on left, text on right.
- Background: Theme background (or hover state via CSS).
- Icon: Optional; rendered as-is (size/styling is responsibility of parent).
- Text: Item label; uses theme foreground color.
- Focus: Browser default or CSS-styled focus ring.

## Interactions
- Click: Executes `onClick` handler; closes parent Menu via MenuContext.
- Keyboard: Accessible via Tab and Enter/Space (if button) or Enter (if link).
- Focus: Focusable; included in Tab order.

## Accessibility
- Role: `role="menuitem"` (semantic for menu context).
- Name: Derived from `text`/`label` and icon (if any).
- Link: If `href`, renders native `<a>` for proper link semantics.
- Button: If no href, renders native `<button>`.

## Constraints & Non-Goals (Current)
- No icon positioning variants (always leading).
- No disabled/inactive state prop.
- No keyboard arrow navigation (parent Menu responsibility, not yet implemented).

## Acceptance Criteria (Source of Truth for Tests)
1. Renders `<button role="menuitem">` if no `href`.
2. Renders `<a role="menuitem" href={href}>` if `href` provided.
3. Displays icon (if provided) before text.
4. Displays text/label correctly.
5. Clicking item calls `onClick` and closes parent Menu.
6. Item is keyboard-accessible via Tab and Enter/Space.

## Current Example & Test Mapping
- Story: Components/Menu — Used in all menu examples with various labels and click handlers.
- Intent: Verify button vs. link rendering, icon/text display, click handling, and menu closure.

## Backlog
- See [menuitem.todo.md](menuitem.todo.md) for future enhancements.
