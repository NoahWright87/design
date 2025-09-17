# Nav Rail Storybook Component — Copilot Build Brief

> Drop this doc into Copilot as a single prompt (or paste section‑by‑section). It specifies the **Storybook-only** implementation for a two‑rail, URL‑driven sidebar navigation. **Do not generate app code**; keep everything inside the design system package and Storybook. No animations.

---

## 0) Context & Goals

* Build a **multi‑rail sidebar navigation** as reusable components for a design system.
* Target: **two rails** (Primary, Secondary). A third rail will be added later without breaking API.
* Use **static data** for items (no fetching). Rails derive active state from a **mocked URL** in Storybook controls.
* **Persist collapsed state** per rail (and optionally per route) via `localStorage` (guard SSR).
* **No animations**. Minimal CSS; focus on semantics, keyboard, and predictable layout.
* Deliver **Storybook stories** that demonstrate behavior and serve as living spec.

**Out of scope:** Next.js integration, real routing, app layouts.

---

## 1) Component Surface (public API)

Create these components, exported from the design system:

1. `NavRail`

   * A single vertical rail rendering a list of navigation items.
   * Props:

     * `ariaLabel: string` (required) — e.g., "Primary" / "Projects".
     * `items: NavItemData[]` (required).
     * `activeHref?: string` — currently active href for `aria-current`.
     * `collapsed?: boolean` — controlled collapsed state (for Storybook).
     * `defaultCollapsed?: boolean` — initial state if uncontrolled.
     * `onCollapsedChange?: (collapsed: boolean) => void` — callback when toggled.
     * `storageKey?: string` — if provided, persist collapsed state to localStorage.
     * `widths?: { expanded: number; collapsed: number }` — pixel widths (defaults: 240 / 64).
     * `renderIcon?: (item: NavItemData) => ReactNode` — optional icon renderer.
   * Behavior:

     * Toggle button at top/bottom to collapse/expand.
     * In collapsed state, show icons only; text is visually hidden but accessible via `title`.
     * Vertical scroll if items overflow.

2. `NavStack`

   * Horizontal container that holds **1–2 `NavRail`** children in order.
   * Props:

     * `rails: Array<{ key: string; rail: ReactNode }>` — explicit composition; order matters.
     * `className?`
   * Behavior:

     * Simple CSS flex row; fixed widths from child rails.

3. Types

   * `type NavItemData = { id: string; label: string; href: string; iconName?: string; disabled?: boolean; external?: boolean }`

**Note:** Avoid coupling to a router. `href` is a string; Storybook controls will manage `activeHref`.

---

## 2) Accessibility Requirements

* Each rail renders as `<nav aria-label="{ariaLabel}">` with an internal `<ul role="list">`.
* Each nav item is a focusable `<a>` (or `<button>` when `disabled`), with:

  * `aria-current="page"` when `item.href === activeHref`.
  * `tabindex` managed via **roving tabindex** within the rail:

    * Arrow Up/Down moves focus between items.
    * Home/End jump to first/last.
    * Enter/Space “activate” (in Storybook, just log an action).
* Collapsed state:

  * Keep items accessible. If label is visually hidden, provide `title={label}`.
  * Toggle has `aria-pressed` or `aria-expanded` (your choice, be consistent) and an accessible label.

---

## 3) Visual / Layout Spec (MVP, no animations)

* Use plain CSS (or Tailwind if available). Keep it minimal.
* `NavRail` is a vertical column with fixed width:

  * Expanded: 240px (default). Collapsed: 64px (default).
  * Full height of the viewport/container with `overflow-y: auto` for the item list.
* Item layout:

  * Leading icon box `24x24`, then label (truncate with ellipsis).
  * Active item uses a left border (e.g., 3px) and bold label.
  * Provide a simple focus ring (outline) for keyboard users.

---

## 4) State & Persistence Rules

* Collapsed state precedence:

  1. Controlled `collapsed` prop (Storybook can force states)
  2. `localStorage` value at `storageKey`
  3. `defaultCollapsed`
  4. Fallback: `false`
* `localStorage` access is **guarded**: only read/write in `useEffect`. On first render, default to expanded to avoid SSR mismatch.
* Suggested keys:

  * Primary rail: `nav:rail:primary:collapsed`
  * Secondary projects rail: `nav:rail:secondary:/projects/:collapsed`

---

## 5) Storybook Deliverables

Create a `NavRail` and `NavStack` story set with controls. Use these fixtures:

### Sample Data

```ts
const PRIMARY_ITEMS: NavItemData[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'projects', label: 'Projects', href: '/projects/' },
  { id: 'blog', label: 'Blog', href: '/blog/' },
  { id: 'about', label: 'About', href: '/about/' },
  { id: 'contact', label: 'Contact', href: '/contact/' },
];

const PROJECTS_ITEMS: NavItemData[] = [
  { id: 'proj-a', label: 'Project A', href: '/projects/a/' },
  { id: 'proj-b', label: 'Project B', href: '/projects/b/' },
  { id: 'proj-c', label: 'Project C', href: '/projects/c/' },
];
```

### Stories to Implement

1. **NavRail/Primary/Expanded** — `items=PRIMARY_ITEMS`, `activeHref='/'`, expanded.
2. **NavRail/Primary/Collapsed** — same as above, collapsed.
3. **NavRail/Projects/Expanded** — `items=PROJECTS_ITEMS`, `activeHref='/projects/a/'`.
4. **NavRail/LongList** — 50 items, scroll behavior.
5. **NavStack/TwoRails** — Primary + Projects side by side; knobs for `activeHref` of each and independent collapsed state (persisted via storageKey).
6. **NavRail/KeyboardNav** — Storybook docs tab explains keys; actions panel logs "activate".
7. **NavStack/Responsive** — viewport presets to show desktop vs mobile; on mobile, render only primary by default.

### Controls / Args

* `activeHref` (string)
* `collapsed` (boolean, optional)
* `storageKey` (string, optional)
* `widths.expanded`, `widths.collapsed`

---

## 6) Keyboard Interaction Details (Roving Tabindex)

* Only the currently focused item has `tabindex=0`; all others `tabindex=-1`.
* On rail mount, set focus to the active item if any; otherwise the first item.
* ArrowUp/ArrowDown move focus to prev/next item (wrap optional; keep it **off** for MVP).
* Home/End set focus to first/last item.
* Enter/Space triggers `onActivate(item)`. In Storybook, use `@storybook/addon-actions` to log.

---

## 7) Edge Cases Copilot Must Handle

* Items may include `disabled` → render with `aria-disabled` and skip in keyboard nav.
* Items may include `external` → add `rel="noreferrer noopener" target="_blank"` (and an icon if provided by host app; skip icon for MVP).
* Long labels → truncate with ellipsis; ensure tooltip via `title`.
* Overflow: vertical scroll inside rail; keep header/toggle pinned.
* Collapsed rails still show icons; if no `renderIcon`, show first letter as a fallback badge.

---

## 8) File Layout (suggested)

* `src/components/nav/NavRail.tsx`
* `src/components/nav/NavStack.tsx`
* `src/components/nav/useRovingTabIndex.ts` (small hook)
* `src/components/nav/navTypes.ts`
* `src/components/nav/nav.css` (or minimal Tailwind classes)
* `src/stories/nav/NavRail.stories.tsx`
* `src/stories/nav/NavStack.stories.tsx`

---

## 9) Definition of Done (acceptance criteria)

* Components compile with **zero TypeScript errors** and no Storybook console warnings.
* All stories listed above are present and functional.
* Toggling collapsed in a rail with a `storageKey` persists across story reloads.
* Keyboard interactions work exactly as specified; actions log on Enter/Space.
* `aria-current="page"` is applied to the active item’s anchor.
* Minimal CSS; no animations; readable in dark and light themes.

---

## 10) Copilot Work Plan (pasteable steps)

**Step 1 — Types & Skeletons**

* Create `navTypes.ts` with `NavItemData` and exported props for `NavRail`/`NavStack`.
* Scaffolding components that render basic structure and props.

**Step 2 — Layout & Styles**

* Implement fixed widths, vertical list, icon+label layout, active styling, focus ring.

**Step 3 — Collapsed State**

* Add toggle button; implement controlled/uncontrolled pattern; persist via `storageKey` using `localStorage` guarded in `useEffect`.

**Step 4 — Keyboard Support**

* Implement `useRovingTabIndex` for Up/Down/Home/End; integrate with items; disabled handling.

**Step 5 — Storybook**

* Add stories and sample data; actions for activation; controls for `activeHref`, widths, collapsed.

**Step 6 — Polish & Edge Cases**

* Long labels, tooltips, external/disabled item flags; scroll behavior.

---

## 11) Nice-to-haves (later)

* Third rail (tertiary) and a `NavBreadcrumb` above content.
* Hover/focus flyout labels for collapsed rails.
* Animation on width/opacity.
* Theming tokens + CSS variables.
* Jest/RTL tests for keyboard behavior.

---

## 12) Notes for Future App Integration (non-blocking)

* In Next.js App Router, mount Primary in root layout, Secondary in `/projects` layout.
* Compute per-route storage keys: e.g., `nav:rail:secondary:/projects/:collapsed`.
* Keep URL as the source of truth for which rails are present; collapse is view preference only.
