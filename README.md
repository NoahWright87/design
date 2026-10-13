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

## Trigger Horizon fireworks from React

Create a stable handle with `useSceneEffects()` (or `createSceneEffects()` outside React).
Pass it to `SceneFooter` through `effects`, and share it with an activity through props or
your app's React context. Keep spelling, scoring, and quiz decisions in your app:

```tsx
import { SceneFooter, useSceneEffects } from "@noahwright/design";
import type { SceneEffects } from "@noahwright/design";

function Activity({ effects }: { effects: SceneEffects }) {
  // Call these from your app's correct-answer and quiz-completion handlers.
  const onCorrectAnswer = () => effects.trigger({ type: "firework" });
  const onQuizFinished = () => effects.trigger({ type: "firework", size: "large" });
  return <>
    <button onClick={onCorrectAnswer}>Correct answer</button>
    <button onClick={onQuizFinished}>Quiz finished</button>
  </>;
}

export function LearningPage() {
  const effects = useSceneEffects();
  return <>
    <Activity effects={effects} />
    <SceneFooter scene="horizon" effects={effects} bottom="Learning together" />
  </>;
}
```

`effects.trigger({ type: "firework", position: { x: 0.5, y: 0.55 },
color: "var(--confirm)", size: "small" })` returns `true` when at least one attached
footer accepts it. It returns `false` when none can accept it. The default is a single
modest multicolor burst at a fresh random sky position; `"large"` launches a larger
staggered group. Each shell has a different angled launch, speed, fuse, and explosion
size. Rockets rise slowly and decelerate under gravity; longer fuses let them start
falling before bursting. Omitted colors choose a new saturated three-color palette
per shell. An explicit color keeps the explosion in that chosen color.
Positions are normalized: x runs left to right and y runs
from sky top to horizon. Finite values are clamped to 0–1; nonfinite values use defaults.
Colors accept CSS colors or a single `var(--token)` resolved against the footer at
trigger time; invalid explicit colors fall back to the scene's sun-light color. Color alpha is discarded.
Bursts near an edge may be clipped by the sky band.

Triggers use the current scene instance; they never serialize into `sceneOptions`,
reload assets, reset the sky, or restart the scene. Changing the shared handle only
changes its subscription. Separate handles isolate activities; a deliberately shared
handle broadcasts to every attached eligible footer.

For a continuous show, set a requested average launch frequency in shells per second:

```tsx
<SceneFooter fireworksFrequency={1.5} bottom="Learning together" />
```

`fireworksFrequency` defaults to `0` (off), is capped at `8`, and treats negative or
nonfinite values as off. Change it live with React state; updates preserve the scene
and its assets. Automatic shells choose random positions, multicolor palettes, flight
speeds, fuses, and sizes; manual triggers can still overlap them. Launch intervals
vary around the chosen rate for a natural rhythm. The shared particle budget can
reduce the effective frequency at busy settings. Setting the rate to zero stops new
launches while existing effects finish. Still, static fallbacks, reduced motion,
hidden tabs, offscreen footers, and frozen scenes pause the show and clear active
effects. Returning to view starts a fresh interval, with no missed launches replayed.

Effects are **dropped, never queued**, before loading, offscreen, in a hidden tab,
after unmount/destruction, in Still/static or reduced-motion mode, on static-fallback
devices, or after the performance governor freezes the scene. Active bursts are cleared
when the footer leaves view, the tab hides, or the governor freezes it. Returning to the
footer plays only new events. Visibility refers to the footer: an activity higher on
the page can trigger it only while the footer is visible.

Repeated triggers overlap, up to 256/144/64 particles at high/medium/low quality,
including staggered launches. At capacity, new bursts are dropped; large groups may
be shortened to fit. Each accepted group finishes in under six seconds and shares
the existing capped frame loop. Fireworks are drawn into the sky before either water
renderer reflects it. Reflections cover only the sky rows that fit in the sea, like
the existing sun, clouds, and stars. Custom scenes can optionally implement
`SceneInstance.trigger`, `clearEffects`, and `setFireworksFrequency`; unsupported scenes
return `false` for triggers and ignore the automatic rate.

Storybook's **Examples → Scene fireworks → Shared trigger** demo includes both sizes,
water modes, multicolor/explicit-color choices, automatic mode with a frequency input,
theme switching, Still, and mount/unmount controls.

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
