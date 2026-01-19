# Header Responsive — Adaptive Layout & Theme Toggle

## Overview
- Purpose: Demonstrate responsive Header behavior and theme toggling (light/dark mode).
- Implementation: Two story variations showing Header with optional labels that hide on mobile; theme toggle button.
- Design system integration: Uses Header with left/center/right + optional label props; theme tokens for background; `getThemeMode()`/`toggleThemeMode()` for theme switching.

## Page Structure
- Header: Fixed at top; contains icon/element and optional label.
- ThemeToggle button: Custom styled (transparent, emoji-based, no border).
- Main content: Below header with left/center/right layout and 20px padding.
- Responsiveness: Labels hide on mobile (<~600px); only icons/elements visible.

## Story Variants
1. **ResponsiveHeaderWithMenu**:
   - Left: "🏠" icon + "MyApp" label.
   - Center: "📋" icon + "Home" label.
   - Right: ThemeToggle emoji button (☀️ for light, 🌙 for dark).
   - Content: Explanation of responsive behavior.

2. **HeaderWithAvatarMenu**:
   - Left: "🌐" icon + "Logo" label.
   - Center: Menu trigger ("User") with dropdown items (Profile, Settings, Sign Out).
   - Right: ThemeToggle emoji button.
   - Content: Instruction to click center menu for user options.

## Visuals
- Header: Fixed position; uses `var(--background)` for main background.
- Icons: Large emoji (1.5rem, bold).
- Labels: Display next to icons on desktop; hidden on mobile (implementation detail: CSS/viewport-based).
- Theme toggle: Emoji button (☀️/🌙) with transparent background, no border, 1.5rem size, pointer cursor.
- Content area: Centered layout with max-width 600px; padding 20px; top padding 80px to clear header.

## Interactions
- Theme toggle: Click button to switch between light and dark modes; emoji updates immediately.
- Menu (variant 2): Click "User" center trigger to open/close dropdown.
- Responsive: Resize browser to <600px to hide labels; only icons remain visible.
- Scroll: Header remains fixed; main content scrollable.

## Accessibility
- Header role: Navigation/landmark.
- Theme toggle: Should have accessible name/label (e.g., aria-label "Toggle theme").
- Labels: Convey meaning; helpful for context even if hidden on small screens.
- Menu items: Proper accessibility attributes for dropdown behavior.

## Constraints & Non-Goals (Current)
- No explicit mobile menu overlay (header is always visible).
- Theme mode persisted only during the session (no localStorage).
- Menu items are simple list; no complex nesting or actions.

## Acceptance Criteria (Source of Truth for Tests)
1. Header renders fixed at top with left/center/right regions.
2. Labels are present in left/center/right when available.
3. On resize to <600px, labels are hidden; icons/elements remain visible.
4. ThemeToggle button is clickable; emoji changes between ☀️ and 🌙.
5. Background color responds to theme mode (light vs. dark).
6. Menu (variant 2) opens/closes on trigger click; items are visible and styled correctly.
7. No console errors; theme toggle state updates correctly.

## Current Story & Test Mapping
- Story: Examples/Header Responsive — Two stories (ResponsiveHeaderWithMenu, HeaderWithAvatarMenu).
- Intent: Verify responsive label hiding, icon/element display, and theme toggle functionality.

## Backlog
- Persistent theme mode preference (localStorage/session).
- Smooth transitions when switching themes.
- Keyboard shortcuts for theme toggle (e.g., Ctrl+Shift+K).
- Mobile drawer menu alternative to full-width overlay.
