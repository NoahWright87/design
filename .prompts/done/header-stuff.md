# Header System Specification

## Overview

A minimal, dependency-free React header framework composed of simple, reusable components. The header arranges **three content areas** (left, center, right) and supports avatar and hamburger menus that open dropdown popovers (expanding to full-width stacked lists on mobile). Focus on function over styling; use only existing tokens `--foreground` and `--background`.

---

## File / Folder Structure

```
components/
│
├── Header/
│   ├── Header.tsx
│   └── Header.css
│
├── Avatar/
│   ├── Avatar.tsx
│   └── Avatar.css
│
├── Menu/
│   ├── Menu.tsx
│   ├── Menu.css
│   ├── MenuItem.tsx
│   └── MenuItem.css
│
├── HamburgerMenu/
│   ├── HamburgerMenu.tsx
│   └── HamburgerMenu.css
│
└── index.ts
```

---

## Components

### Header

**File:** `Header/Header.tsx`

Accepts three regions: left, center, and right.

```tsx
interface HeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export function Header({ left, center, right }: HeaderProps) {}
```

**Responsibilities**

* Horizontal flex layout with space-between alignment.
* Uses CSS variables `--foreground` and `--background` only.
* Minimal styling (no fancy spacing or fonts).
* Does not handle scrolling or stickiness.

---

### Avatar

**File:** `Avatar/Avatar.tsx`

Displays an image or initial inside a circle.

```tsx
interface AvatarProps {
  src?: string;
  alt?: string;
  label?: string; // fallback initial
  size?: number;  // default 32px
  onClick?: () => void;
}
```

**Behavior**

* Uses `border-radius: 50%`.
* Displays image if available; otherwise the first letter of `label`.
* Exposes click handler (for menus).

---

### Menu

**File:** `Menu/Menu.tsx`

Generic dropdown/popover menu component.

```tsx
interface MenuProps {
  trigger: React.ReactNode;       // usually <Avatar /> or <HamburgerMenu />
  items: React.ReactNode[];       // <MenuItem> elements
  align?: 'left' | 'right';       // alignment of dropdown
}
```

**Behavior**

* Opens on click; closes on outside click or `Escape`.
* Internal open/close state (not externally controlled).
* Positions dropdown below trigger.
* Left-hand menus align left; right-hand menus align right automatically.
* On mobile (`max-width: 600px`):

  * Expands to full screen width.
  * Vertically stacks large, tappable items.
  * Includes backdrop overlay.
* Multiple menus can be open at once (no global coordination).

---

### MenuItem

**File:** `Menu/MenuItem.tsx`

Simple clickable list item.

```tsx
interface MenuItemProps {
  label: string;
  onClick?: () => void;
}
```

**Behavior**

* Renders as `<button>` or `<a>`.
* Closes parent menu on click.
* Minimal styling; no icons or keyboard shortcuts (MVP).

---

### HamburgerMenu

**File:** `HamburgerMenu/HamburgerMenu.tsx`

Button that toggles a menu and animates between hamburger and X. Reused for both nav and account triggers.

```tsx
interface HamburgerMenuProps {
  isOpen?: boolean; // controlled internally by Menu
  onToggle?: () => void;
}
```

**Structure**

```html
<button class="hamburger" aria-label="Menu" aria-expanded="false">
  <span></span>
  <span></span>
  <span></span>
</button>
```

**Animation (CSS)**

```css
.hamburger {
  width: 24px;
  height: 18px;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  background: none;
  border: 0;
  cursor: pointer;
}

.hamburger span {
  height: 3px;
  background: var(--foreground);
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

@media (prefers-reduced-motion: reduce) {
  .hamburger span { transition: none; }
}
```

**Behavior**

* Toggles `open` class when the menu is open.
* Delegates menu opening to `<Menu>` logic.

---

## Integration Examples

### Standard App Header

```tsx
<Header
  left={<Menu trigger={<HamburgerMenu />} items={navItems} align="left" />}
  center={<Breadcrumb />}
  right={<Menu trigger={<Avatar label="N" />} items={accountItems} align="right" />}
/>
```

### Minimal Portfolio Header

```tsx
<Header
  left={<HamburgerMenu />}
  center={<Logo />}
  right={<Avatar src="/me.jpg" />}
/>
```

---

## Accessibility

* Interactive elements are `<button>` or `<a>` with appropriate roles.
* Use `aria-expanded`, `aria-controls`, and `role="menu"` / `role="menuitem"` where applicable.
* Close on `Escape` or outside click.
* Natural tab order.
* Respect `prefers-reduced-motion` for animation.

---

## Tokens

* `--foreground`
* `--background`

No other colors, fonts, or sizes beyond essentials.

---

## Future Enhancements (Out of Scope for MVP)

* Breadcrumb component with auto page title.
* Dark mode support.
* Notification badges.
* Menu item icons and keyboard shortcuts.
* Global menu manager to close other menus automatically.
