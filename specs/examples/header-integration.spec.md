# Header Integration — Multi-Layout Variants

## Overview
- Purpose: Demonstrate how Header, Avatar, Menu, MenuItem, and HamburgerMenu compose to create real application headers.
- Implementation: Four story variations showing different header configurations (standard app, minimal portfolio, left-only, right-only).
- Design system integration: Uses Header with left/center/right region props; Menu with align; HamburgerMenu and Avatar as triggers.

## Page Structure
- Header: Fixed at top of viewport (~60px height, sticky behavior).
- Content: Below header with top padding to prevent overlap; filler content for scroll testing.
- Menus: Expandable on click; full-width overlay on mobile (<600px).

## Story Variants
1. **StandardAppHeader**: 
   - Left: HamburgerMenu triggering nav items (Home, About, Services, Contact).
   - Center: Application title ("My Application").
   - Right: Avatar triggering account menu (Profile, Settings, Log out).
   - Use case: Typical app header layout.

2. **MinimalPortfolio**:
   - Left: HamburgerMenu triggering nav items.
   - Center: Bold text "Noah Wright".
   - Right: Avatar with image (`src`).
   - Use case: Portfolio or personal site.

3. **LeftMenuOnly**:
   - Left: HamburgerMenu + nav items.
   - Center: "Centered Title".
   - Right: Empty.
   - Use case: Navigation-focused layout.

4. **RightMenuOnly**:
   - Left: Empty.
   - Center: "My App".
   - Right: Avatar + account menu.
   - Use case: Account/settings-focused layout.

## Visuals
- Header background: Uses theme foreground/background tokens.
- Menu items: Listed vertically; clickable with console logging.
- Avatar: Rendered as text label ("Noah Wright") or image (src-based).
- Fixed positioning: Header stays visible while scrolling content.

## Interactions
- Menu open/close: Triggered by clicking HamburgerMenu or Avatar.
- Menu items: Console log indicates which item was clicked.
- Scroll: Header remains fixed; content scrolls beneath.
- Responsive: On resize to <600px, menus expand full-width with overlay.

## Accessibility
- Header role: Navigation/landmark region.
- Menu items: Proper labels and click handlers.
- Avatar: Accessible label ("Noah Wright") or alt text if image.
- Keyboard: Menu interaction should follow keyboard navigation conventions.

## Constraints & Non-Goals (Current)
- No actual routing; menu clicks log to console only.
- No submenu nesting (MenuItem is simple list).
- Mobile menu overlay behavior is implicit; not explicitly tested here.

## Acceptance Criteria (Source of Truth for Tests)
1. Header renders fixed at top with ~60px height.
2. Each variant (Standard, Minimal, LeftOnly, RightOnly) displays correct regions (left/center/right).
3. HamburgerMenu and Avatar render appropriately as menu triggers.
4. Clicking menu triggers opens/closes the menu.
5. Menu items display correctly and are clickable.
6. Content below header is scrollable; header remains visible.
7. No console errors; menu callbacks execute when items are clicked.

## Current Story & Test Mapping
- Story: Examples/Header Integration — Four stories (StandardAppHeader, MinimalPortfolio, LeftMenuOnly, RightMenuOnly).
- Intent: Verify header layout variants, menu interactivity, and responsive positioning.

## Backlog
- Actual navigation/routing integration.
- Submenu/nested menu support.
- Accessible keyboard shortcuts for menu activation.
- Animation transitions for menu open/close.
