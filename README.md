# @noahwright/design

This is a ***hyper-minimal React design system*** I'm using as a playground.  That means:

- 💻 Modern browsers only.  Makes things a lot simpler and supports *most* people.
- ⚠️ I'm "learning in public" and may break things along the way.  Use at your own risk.
- 🤖 Agents will do most of the heavy lifting.  Guiding them to build the site is half the project. 

## Install

```bash
npm i @noahwright/design
# or: pnpm add @noahwright/design
```

Peer deps required in your app:
- react
- react-dom

## What’s included

- **Core components**: `Button`, `Link`, `Heading`, `Text`, `Header`, `Footer`, `Layout`, `Container`, `Card`, `Modal`
- **Utility components**: `Avatar`, `HamburgerMenu`, `Menu`, `MenuItem`
- **Base CSS**: `src/styles/theme.css` with semantic color tokens (`--foreground`, `--background`, `--primary`, `--secondary`, `--confirm`, `--danger`, `--overlay`)
- **Theme utilities**: `Theme` type, `buildThemeCss(theme)` function, light/dark toggle (`setThemeMode`, `toggleThemeMode`, `getThemeMode`)

## Usage (components)

```tsx
import {
  Button,
  Link,
  Heading,
  Text,
  Header,
  Card,
  Modal,
  Menu,
  MenuItem,
  setThemeMode,
  toggleThemeMode,
} from "@noahwright/design";
import { useState } from "react";

export function Example() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header
        left={<span>Logo</span>}
        center={<Heading level={2}>My App</Heading>}
        right={<Button onClick={() => toggleThemeMode()}>🌙</Button>}
        mobileMenu={<Menu trigger="≡" items={[]} />}
      />

      <main>
        <Card title="Welcome" subtitle="To the design system">
          <Text>A hyper-minimal, highly opinionated system.</Text>
          <Button onClick={() => setIsModalOpen(true)}>Learn More</Button>
        </Card>

        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="About This System"
          actions={[{ label: "Got it", variant: "primary" }]}
        >
          <Text>Built for learning, built in public, and built by agents.</Text>
        </Modal>
      </main>
    </>
  );
}
```

## Theming (typed, build-time + runtime toggle)

In your app repo, create a typed `theme.ts`:

```ts
// theme.ts
import type { Theme } from "@noahwright/design";

export const theme: Theme = {
  foreground: "#111111",
  background: "#ffffff",
  primary: "#2563eb",
  secondary: "#9333ea",
  confirm: "#16a34a",
  danger: "#dc2626",
  overlay: "rgba(15, 23, 42, 0.6)",
};
```

Generate `public/theme.css` at build time:

```ts
// scripts/build-theme.ts
import { writeFileSync } from "node:fs";
import { buildThemeCss } from "@noahwright/design";
import { theme } from "../theme";

writeFileSync("public/theme.css", buildThemeCss(theme), "utf8");
```

### Light/Dark Theme Toggle

Use `setThemeMode`, `getThemeMode`, or `toggleThemeMode`:

```tsx
import { toggleThemeMode } from "@noahwright/design";

export function ThemeToggle() {
  return (
    <button onClick={() => toggleThemeMode()}>
      {getThemeMode() === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

The system applies a `data-theme="dark"` attribute to `<html>` and provides dark-mode colors via CSS variable overrides. Customize dark colors in your theme or update `src/styles/theme.css`.

## Old browser redirect (optional)

```html
<script>
  if (!("CSS" in window) || !CSS.supports("color", "color-mix(in srgb, white 50%, black)")) {
    location.href = "/fallback.html";
  }
</script>
```

## SSR (build-time theme, optional inline style)

For static/build-time theme injection:

```ts
// scripts/build-theme.ts
import { writeFileSync } from "node:fs";
import { buildThemeCss } from "@noahwright/design";
import { theme } from "../theme";

writeFileSync("public/theme.css", buildThemeCss(theme), "utf8");
```

Or inline via SSR:

```tsx
// Next.js Server Component layout
import { buildThemeCss } from "@noahwright/design";
import { theme } from "../theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <style id="nw-theme" dangerouslySetInnerHTML={{ __html: buildThemeCss(theme) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

No runtime side effects at module level; fully SSR-safe.

## Philosophy & Constraints

- No Tailwind/SCSS/LESS/styled-components/emotion/CSS-in-JS/PostCSS.
- No layout/spacing/animation utilities yet.
- No extra props: the wrappers are intentionally tiny.
- Add capabilities **only when needed** in your apps.

## Dev / Storybook

```bash
npm i
npm run storybook
```

## Build the library

```bash
npm run build
```

This produces ESM + CJS + types in `dist/`. Publish with:

```bash
npm publish --access public
```

---

## Repository notes

- Agent guidance: See `AGENTS.md` for machine-focused instructions and conventions.
- Changelog: Add entries to `CHANGELOG.md` before committing changes or opening a PR.
