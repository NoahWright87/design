# Menu — Dropdown Menu with Customizable Trigger and Items

## Overview
- Purpose: Create a flexible dropdown menu that opens/closes on trigger click, supports alignment, and includes keyboard navigation.
- Implementation: Stateful component managing open/close; renders trigger wrapper and optional panel with menu items; provides MenuContext for child MenuItem components.
- Design system integration: Uses theme colors via CSS; responsive overlay on mobile; escape/backdrop click to close.

## API
- Props:
  - **trigger**: React node for the clickable element (e.g., Avatar, HamburgerMenu, Button).
  - **items**: Optional array of MenuItemProps or custom React nodes. Rendered as menu items.
  - **align**: Optional alignment: `"left"` (default) or `"right"`. Positions dropdown relative to trigger.
  - **icons**: Optional object with `{ open, close }` nodes for replacing trigger display (if trigger is not a native button).
  - **label**: Optional aria-label for the trigger wrapper.
  - **children**: Optional custom React nodes rendered as menu items (alternative to `items` array).
- DOM:
  - Root element: `<div class="nw-menu">`.
  - Trigger: Clone of trigger element or wrapped `<button>`.
  - Panel: `<div id={panelId} role="menu">` (only rendered when open).
  - Overlay: `<div class="nw-menu__overlay">` (mobile-only via CSS).

## Visuals
- Layout: Dropdown panel below/above trigger; align left or right.
- Background: Theme colors (menu panel and overlay).
- Mobile: Full-width overlay on small screens (<600px).
- Open state: Panel visible; overlay (if mobile) shown.
- Closed state: Panel and overlay hidden.

## Interactions
- Click trigger: Open/close menu.
- Click menu item: Execute item action; auto-close menu.
- Click outside: Close menu (backdrop click).
- Escape key: Close menu.
- Keyboard: MenuItem children are accessible via Tab.

## Accessibility
- Trigger ARIA: `aria-expanded`, `aria-haspopup="menu"`, `aria-controls={panelId}`.
- Panel role: `role="menu"`.
- Items: Rendered as MenuItemProps or custom nodes; should have `role="menuitem"` if MenuItem.
- Label: Trigger has aria-label if provided or generated.

## Constraints & Non-Goals (Current)
- No arrow/chevron indicators (trigger responsibility).
- No nested menus (flat items only).
- No touch-specific close behavior (Escape/outside click only).

## Acceptance Criteria (Source of Truth for Tests)
1. Menu renders closed by default (no panel visible).
2. Clicking trigger opens menu (panel visible).
3. Clicking trigger again closes menu.
4. Open menu displays all items from `items` array or `children`.
5. Clicking menu item closes menu and invokes item's `onClick`.
6. Clicking outside menu (backdrop) closes menu.
7. Pressing Escape closes menu.
8. Menu aligns left or right based on `align` prop.
9. On mobile, overlay div is shown when menu is open.

## Current Example & Test Mapping
- Story: Components/Menu — Four variants:
  - "WithHamburger": HamburgerMenu trigger with nav items, left-aligned.
  - "WithAvatar": Avatar trigger with account items, right-aligned.
  - "LeftAligned": Button trigger, left-aligned.
  - "RightAligned": Button trigger, right-aligned.
- Intent: Verify trigger rendering, menu open/close, item interaction, and alignment.

## Backlog
- See [menu.todo.md](menu.todo.md) for future enhancements.
