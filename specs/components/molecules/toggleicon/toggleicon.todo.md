# ToggleIcon — Todo

Standalone atom that animates between two icon states. Used as the trigger for `Menu` and wherever a two-state icon toggle is needed. Replaces the icon responsibility previously held by `HamburgerMenu`.

## Sooner
- [x] Core two-state toggle: Animate between two icon states on click. Support `isToggled` (controlled) and `defaultToggled` (uncontrolled) props.
- [x] Built-in presets:
  - Hamburger → X (default; replaces HamburgerMenu icon)
  - Moon → Sun
  - Outlined circle → Filled circle
  - Arrow right → Arrow down
  - Plus → Minus
  - Eye → Eye-slash (show/hide)
  - Play → Pause
  - Mute → Unmute
  - Thumbs up → Thumbs down
  - Bookmark (empty) → Bookmark (filled)
  - Heart (empty) → Heart (filled)
  - Lock → Unlock

## Later
- [ ] TBD

## Backlog
- Custom icon pair: Accept two arbitrary icon nodes for a fully custom toggle beyond the built-in presets.
