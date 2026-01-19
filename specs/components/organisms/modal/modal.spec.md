# Modal — Centered Dialog with Backdrop and Actions

## Overview
- Purpose: Render a centered modal dialog with backdrop, title, content, close button, and customizable action buttons.
- Implementation: Controlled component (`open` prop); backdrop click and Escape close modal; optional action buttons with click handlers.
- Design system integration: Uses theme colors and tokens via CSS; semantic dialog role; ARIA attributes for accessibility.

## API
- Props:
  - **open**: Boolean (required). Controls modal visibility.
  - **onClose**: Callback (required). Called when modal should close; receives action id/label or undefined (for backdrop/escape).
  - **title**: Optional React node for modal title (displayed in header).
  - **children**: Optional React node for modal content.
  - **actions**: Optional array of ModalActionProps. Defines action buttons at bottom.
    - ModalActionProps: `{ label: string, variant?: "primary" | "secondary" | "confirm" | "danger", onClick?: () => void, id?: string }`.
  - **closeOnBackdrop**: Boolean (default true). Whether clicking backdrop closes modal.
  - **closeButtonLabel**: String (default "Close"). Aria-label for close button.
- DOM:
  - Backdrop: `<div class="nw-modal__backdrop" role="presentation">`.
  - Container: `<div role="dialog" aria-modal="true">`.
  - Header: Title and close button.
  - Content: `<div class="nw-modal__content">` (if children).
  - Actions: Footer with action buttons.

## Visuals
- Backdrop: Semi-transparent overlay; covers full viewport.
- Modal: Centered white box; rounded corners.
- Header: Title (if provided) and close button (✕).
- Content: Scrollable if long.
- Actions: Row of buttons with variants (primary, secondary, confirm, danger).
- Focus: Default action button is focused on open (CSS/JS responsibility).

## Interactions
- Backdrop click: Closes modal (if `closeOnBackdrop={true}`).
- Close button: Closes modal with action "cancel".
- Action button click: Calls `onClick`; closes modal with action id/label.
- Escape key: Closes modal with action "cancel" (always, regardless of `closeOnBackdrop`).
- Focus trap: Keyboard focus should remain within modal (implicit in accessible dialog).

## Accessibility
- Role: `role="dialog"` with `aria-modal="true"`.
- Title: Associated with dialog via modal structure (not aria-labelledby yet).
- Close button: `aria-label="Close"` (customizable via `closeButtonLabel`).
- Actions: Buttons are easily distinguishable by label and variant styling.
- Escape: Always closes modal (standard dialog behavior).
- Default action: "Okay" button if no custom actions.

## Constraints & Non-Goals (Current)
- No focus trap enforcement (responsibility of application or middleware).
- No animated entrance/exit (CSS-driven).
- No custom footer content (only action buttons).
- Backdrop click always closes (if enabled); no customization.

## Acceptance Criteria (Source of Truth for Tests)
1. Modal is not rendered when `open={false}`.
2. Modal renders when `open={true}`.
3. Modal displays title (if provided).
4. Modal displays content children.
5. Modal displays close button with aria-label.
6. Action buttons display with correct labels and variants.
7. Default action is "Okay" if no custom actions provided.
8. Clicking action button calls its `onClick` and closes modal with action id/label.
9. Clicking backdrop closes modal (if `closeOnBackdrop={true}`).
10. Pressing Escape closes modal with action "cancel".
11. Close button calls `onClose("cancel")`.

## Current Example & Test Mapping
- Story: Components/Modal — Six variants:
  - "Basic": Simple modal with default okay button.
  - "WithCustomTitle": Custom title and content.
  - "CustomActions": Two custom action buttons (confirm/danger variants).
  - "MultipleActions": Four action buttons with different variants.
  - "NoBackdropClose": `closeOnBackdrop={false}`; requires action button click.
  - "LongContent": Multi-paragraph content to test scrolling.
- Intent: Verify modal visibility, title/content/actions display, button interaction, and close behavior.

## Backlog
- See [modal.todo.md](modal.todo.md) for future enhancements.
