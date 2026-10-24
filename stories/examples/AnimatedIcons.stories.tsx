import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, ToggleIcon, getThemeMode, subscribeThemeMode, toggleThemeMode } from "../../src";
import type { ToggleIconPreset } from "../../src";

const presets: { preset: ToggleIconPreset; title: string; detail: string }[] = [
  { preset: "moon-sun", title: "Day & night", detail: "Capsule rays orbit into a soft crescent" },
  { preset: "hamburger", title: "Navigation", detail: "Three strokes become a close control" },
  { preset: "heart", title: "Favorite", detail: "Fills like a game heart, with a little thump" },
  { preset: "bookmark", title: "Save for later", detail: "An outline becomes a keepsake" },
  { preset: "play-pause", title: "Playback", detail: "One shape, two useful states" },
  { preset: "mute", title: "Sound", detail: "Waves return as audio opens up" },
  { preset: "eye", title: "Visibility", detail: "Draw the veil, reveal the content" },
  { preset: "lock", title: "Security", detail: "The shackle settles into place" },
  { preset: "plus-minus", title: "Add & remove", detail: "One stroke folds into the other" },
  { preset: "arrow", title: "Disclosure", detail: "A quarter turn points the way" },
  { preset: "circle", title: "Selection", detail: "From possibility to selected" },
  { preset: "thumbs", title: "Feedback", detail: "A fresh perspective with a half turn" },
];

const meta: Meta = {
  title: "Examples/Animated Icons",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

function IconGallery() {
  const [states, setStates] = React.useState<Partial<Record<ToggleIconPreset, boolean>>>({});
  const [dark, setDark] = React.useState(false);
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("lg");
  React.useEffect(() => {
    setDark(getThemeMode() === "dark");
    return subscribeThemeMode(mode => setDark(mode === "dark"));
  }, []);
  const allOn = presets.every(({ preset }) => states[preset]);

  return (
    <main style={{ background: "var(--background)", color: "var(--foreground)", minHeight: "100vh", padding: "clamp(1.5rem, 5vw, 5rem)", fontFamily: "var(--font-family)" }}>
      <div style={{ maxWidth: "68rem", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={{ color: "var(--primary)", letterSpacing: "0.15em", fontSize: "var(--text-sm)" }}>SMALL DETAILS. FULL OF LIFE.</p>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", margin: "0.25em 0", lineHeight: 1.05 }}>Icons with a little spring.</h1>
            <p style={{ maxWidth: "35rem", lineHeight: 1.6 }}>Twelve familiar controls with the soft shapes and spring of Marshmallow Orbit. Tap again mid-motion to feel the momentum reverse, or switch the whole collection together.</p>
          </div>
          <div style={{ display: "grid", justifyItems: "center", gap: "0.5rem" }}>
            <ToggleIcon preset="moon-sun" size="lg" isToggled={dark} onChange={() => setDark(toggleThemeMode() === "dark")} />
            <span style={{ fontSize: "var(--text-sm)" }}>Try the theme</span>
          </div>
        </header>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1rem", margin: "2rem 0" }}>
          <Button variant="outline" onClick={() => setStates(Object.fromEntries(presets.map(({ preset }) => [preset, !allOn])))}>{allOn ? "Reset all icons" : "Toggle all icons"}</Button>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            Size
            <select value={size} onChange={event => setSize(event.target.value as typeof size)} style={{ color: "var(--foreground)", background: "var(--background)", border: "1px solid var(--primary)", borderRadius: "var(--radius)", padding: "0.5rem" }}>
              <option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option>
            </select>
          </label>
        </div>
        <section aria-label="Animated icon collection" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 15rem), 1fr))", gap: "1rem" }}>
          {presets.map(({ preset, title, detail }) => (
            <article key={preset} style={{ border: "1px solid color-mix(in srgb, var(--foreground) 14%, transparent)", borderRadius: "var(--radius)", padding: "1.5rem", background: "color-mix(in srgb, var(--primary) 3%, var(--background))" }}>
              <div style={{ color: states[preset] ? "var(--primary)" : "var(--foreground)", minHeight: "4.5rem", display: "flex", alignItems: "center" }}>
                <ToggleIcon preset={preset} size={size} isToggled={states[preset] ?? false} onChange={next => setStates(previous => ({ ...previous, [preset]: next }))} />
              </div>
              <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "0.4rem" }}>{title}</h2>
              <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.5 }}>{detail}</p>
              <code style={{ fontSize: "var(--text-xs)", color: "var(--primary)" }}>{preset}</code>
            </article>
          ))}
        </section>
        <p style={{ marginTop: "2rem", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>Keyboard friendly. Theme aware. Your reduced-motion preference is respected automatically.</p>
      </div>
    </main>
  );
}

export const Collection: Story = { render: () => <IconGallery /> };
