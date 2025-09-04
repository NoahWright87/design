# @noahwright/design — One-Shot Scaffold Instructions

> **Role (for Copilot):** You are my code generator. Follow this file **exactly**.  
> **Do not** ask questions. **Do not** add technologies, files, props, styles, or dependencies beyond what is specified here.  
> If anything is genuinely impossible, stop and state the exact line that blocks you.

---

## Goal

Create a **public** npm package: a **minimal React design system** with **Storybook**.  
Priorities: **speed**, **SSR safety**, **tiny bundle**, **no styling bloat**.

- **Modern browsers only.** No legacy support needed.
- **Absolutely minimal CSS:** only two tokens now (`--foreground`, `--background`) in `theme.css`.
- **Typed theming pipeline:** consumer apps define a typed `theme.ts`, then generate their own `theme.css` at build time (no hand-written CSS).
- **Components:** tiny wrappers around native elements with **minimal props**.
- **Storybook:** Vite-based demo site; it’s the only app that consumes source directly. All other sites install from npm.

---

## Non-Negotiable Guardrails

- **No** Tailwind, SCSS, LESS, styled-components, emotion, runtime CSS-in-JS, PostCSS, resets, or utility class soup.
- **No** layout/spacing/animation utilities of any kind.
- **No** extra props beyond those listed.
- **No** auto-importing CSS from the library entry (consumers import their own generated `theme.css`).
- **SSR safe:** no `window`, no browser-only APIs, no side effects at import.
- **Peer deps only:** `react`, `react-dom`. The library has **no runtime deps**.

---

## Repository Layout (create exactly)

```
design/
  .gitignore
  package.json
  tsconfig.json
  tsup.config.ts
  README.md
  src/
    index.ts
    styles/
      theme.css
    components/
      Button.tsx
      Link.tsx
      Heading.tsx
      Text.tsx
  .storybook/
    main.ts
    preview.ts
  stories/
    Button.stories.tsx
    Link.stories.tsx
    Heading.stories.tsx
    Text.stories.tsx
```

---

## Create Files With **Exact** Contents

### `.gitignore`
```
node_modules
dist
storybook-static
.DS_Store
.vscode
.idea
```

### `package.json`
```json
{
  "name": "@noahwright/design",
  "version": "0.1.0",
  "description": "Noah Wright's hyper-minimal React design system. Learning in public; use at your own risk.",
  "license": "MIT",
  "private": false,
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src/styles/theme.css",
    "README.md"
  ],
  "scripts": {
    "build": "tsup",
    "typecheck": "tsc --noEmit",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@storybook/addon-essentials": "^8.1.0",
    "@storybook/react-vite": "^8.1.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "storybook": "^8.1.0",
    "tsup": "^8.0.0",
    "typescript": "^5.5.0",
    "vite": "^5.0.0"
  },
  "engines": {
    "node": ">=18"
  },
  "sideEffects": false
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "types": ["react", "react-dom"],
    "resolveJsonModule": true
  },
  "include": ["src/**/*", ".storybook/**/*", "stories/**/*"]
}
```

### `tsup.config.ts`
```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  target: "es2020",
  external: ["react", "react-dom"]
});
```

### `src/styles/theme.css`
```css
:root {
  --foreground: #111111;
  --background: #ffffff;
}
```

### `src/components/Button.tsx`
```tsx
import * as React from "react";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

### `src/components/Link.tsx`
```tsx
import * as React from "react";

export type LinkProps = {
  children: React.ReactNode;
  href: string;
};

export function Link({ children, href }: LinkProps) {
  return <a href={href}>{children}</a>;
}
```

### `src/components/Heading.tsx`
```tsx
import * as React from "react";

export type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
};

export function Heading({ level, children }: HeadingProps) {
  const Tag = ("h" + level) as keyof JSX.IntrinsicElements;
  return <Tag>{children}</Tag>;
}
```

### `src/components/Text.tsx`
```tsx
import * as React from "react";

export type TextProps = {
  children: React.ReactNode;
};

export function Text({ children }: TextProps) {
  return <p>{children}</p>;
}
```

### `src/index.ts`
```ts
export * from "./components/Button";
export * from "./components/Link";
export * from "./components/Heading";
export * from "./components/Text";

/** Typed theme input for generating a CSS file at build time. */
export type Theme = {
  foreground: string;
  background: string;
};

/** Produce minimal CSS custom properties (as a string) from a typed Theme. */
export function buildThemeCss(t: Theme): string {
  return `:root{--foreground:${t.foreground};--background:${t.background};}`;
}
```

### `.storybook/main.ts`
```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../stories/**/*.stories.@(tsx|mdx)"],
  addons: ["@storybook/addon-essentials"]
};

export default config;
```

### `.storybook/preview.ts`
```ts
import "../src/styles/theme.css";

import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: { expanded: true }
  }
};

export default preview;
```

### `stories/Button.stories.tsx`
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../src/components/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  args: { children: "Click me" }
};
```

### `stories/Link.stories.tsx`
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "../src/components/Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Basic: Story = {
  args: { href: "#", children: "Go somewhere" }
};
```

### `stories/Heading.stories.tsx`
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "../src/components/Heading";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = { args: { level: 1, children: "Heading 1" } };
export const H2: Story = { args: { level: 2, children: "Heading 2" } };
```

### `stories/Text.stories.tsx`
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../src/components/Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Basic: Story = { args: { children: "Hello world" } };
```

### `README.md`
```markdown
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
```
---

## HOW TO RUN (for this repo)

1) Install deps  
```bash
npm i
```

2) Launch Storybook (demo)  
```bash
npm run storybook
```

3) Build the library  
```bash
npm run build
```

4) Publish (public)  
```bash
npm publish --access public
```

---

## Done

After the files are created, **stop**. Do not add any additional code, examples, or dependencies.
```

