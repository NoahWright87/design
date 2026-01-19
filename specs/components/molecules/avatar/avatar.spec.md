# Avatar — User Profile Picture

## Overview
- Purpose: Display a user's profile picture or initials in a circular container.
- Implementation: Renders image (`src`) or fallback to first letter of `label`; optionally clickable.
- Design system integration: Uses theme colors for fallback background; size is fully customizable.

## API
- Props:
  - **src**: Optional image URL. If provided, displays image.
  - **alt**: Optional alt text for image (defaults to label if omitted).
  - **label**: Optional text for fallback initial and aria-label (e.g., "Noah Wright" → "N").
  - **size**: Optional pixel size (default 32px).
  - **onClick**: Optional click handler. If provided, avatar renders as button; otherwise, span.
- DOM:
  - Element: `<button>` (if `onClick`) or `<span>`.
  - Classes: `nw-avatar`, `nw-avatar__img` (image), `nw-avatar__fallback` (text).
  - Styles: `width` and `height` set to `size` pixels.

## Visuals
- Shape: Square container (CSS determines roundness via `border-radius`).
- Image: Fills the container; centered.
- Fallback: First uppercase letter of `label` on a theme color background.
- Size: Fully customizable via `size` prop (e.g., 24px, 40px, 64px).
- Border: Optional CSS-driven (not in props).

## Interactions
- Pointer: If `onClick` is provided, avatar is clickable; renders as button with pointer cursor.
- Keyboard: Button variant is keyboard-accessible via Tab and Enter/Space.
- Focus: Uses browser default focus ring if button.

## Accessibility
- Role: Implicit `role="button"` if `onClick`; no role if static.
- Name: `aria-label` is set to `alt` (for image) or `label` (fallback).
- Image alt: Set to `alt` or `label` (for screen readers).
- Fallback span: Marked with `aria-hidden` to prevent single letter from being announced separately.

## Constraints & Non-Goals (Current)
- No status indicators (online/offline badges).
- No image cropping or aspect ratio handling (CSS-driven).
- No name tooltip on hover (application responsibility).

## Acceptance Criteria (Source of Truth for Tests)
1. Renders correctly with `src` image URL.
2. Falls back to first letter initial if no `src`.
3. Size is applied to both width and height via inline styles.
4. If `onClick` is provided, renders as a `<button>`.
5. If no `onClick`, renders as a `<span>`.
6. `aria-label` is set appropriately for both image and fallback variants.
7. Image alt text is set to `alt` prop or falls back to `label`.

## Current Example & Test Mapping
- Story: Components/Avatar — Multiple variants:
  - "WithImage": Image with `src` and `alt`.
  - "WithInitial": Fallback text from `label`.
  - "Small" (24px), "Large" (64px): Size variations.
  - "Clickable": With `onClick` handler.
- Intent: Verify image display, fallback rendering, size customization, and click interaction.

## Backlog
- See [avatar.todo.md](avatar.todo.md) for future enhancements.
