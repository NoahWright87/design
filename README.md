# @noahwright/design

**Hyper-minimal React design system.** Modern browsers only. Learning in public; use at your own risk.  
Focus: SSR-safe, tiny, fast. No styling beyond two tokens for now.

## Install

```bash
npm i @noahwright/design
# or: pnpm add @noahwright/design
```

Peer deps required in your app:
- react
- react-dom

## What’s included

- Components: `Button`, `Link`, `Heading`, `Text` (minimal props only)
- Base CSS: `src/styles/theme.css` with `--foreground`, `--background`
- Typed theme tools: `Theme`, `buildThemeCss(theme)` → returns a CSS string

## Usage (components)

```tsx
import { Button, Link, Heading, Text } from "@noahwright/design";

export function Example() {
  return (
    <>
      <Heading level={1}>Hello</Heading>
      <Text>Welcome to the 90s (but fast).</Text>
      <Button onClick={() => console.log("hey")}>Click</Button>
      <Link href="#nowhere">A link</Link>
    </>
  );
}
```

## Theming (typed, build-time)

In your app repo, create a typed `theme.ts`:

```ts
// theme.ts
import type { Theme } from "@noahwright/design";

export const theme: Theme = {
  foreground: "#111111",
  background: "#ffffff"
};
```

Generate `public/theme.css` at build time (no handwritten CSS):

```ts
// scripts/build-theme.ts
import { writeFileSync } from "node:fs";
import { buildThemeCss } from "@noahwright/design";
import { theme } from "../theme";

writeFileSync("public/theme.css", buildThemeCss(theme), "utf8");
```

Add a script (using `tsx` runner is convenient):

```json
{
  "scripts": {
    "build:theme": "tsx scripts/build-theme.ts"
  },
  "devDependencies": {
    "tsx": "^4.7.0"
  }
}
```

Import your generated CSS (Next.js example):

```tsx
// app/layout.tsx or pages/_app.tsx
import "../public/theme.css";
```

> You can also inject it SSR-only via `<style>` if you prefer (see below).

## Optional SSR inline style

```tsx
// Next.js Server Component layout example
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

## Old browser redirect (optional)

```html
<script>
  if (!("CSS" in window) || !CSS.supports("color", "color-mix(in srgb, white 50%, black)")) {
    location.href = "/fallback.html";
  }
</script>
```

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
