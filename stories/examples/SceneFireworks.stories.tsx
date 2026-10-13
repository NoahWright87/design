import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, SceneFooter, useSceneEffects, toggleThemeMode, getFooterStyle, setFooterStyle } from "../../src";
import type { SceneEffects } from "../../src";

function Activity({ effects }: { effects: SceneEffects }) {
  const [status, setStatus] = React.useState("Ready");
  const launch = (size: "small" | "large") => {
    const accepted = effects.trigger({ type: "firework", size, color: "var(--confirm)" });
    setStatus(accepted ? "Accepted" : "Dropped");
  };
  return (
    <section style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
      <Button onClick={() => launch("small")}>Single burst</Button>
      <Button onClick={() => launch("large")}>Larger celebration</Button>
      <output aria-live="polite">{status}</output>
    </section>
  );
}

function FireworksDemo({ animate = true }: { animate?: boolean }) {
  const effects = useSceneEffects();
  const [renderer, setRenderer] = React.useState<"2d" | "webgl">("2d");
  const [mounted, setMounted] = React.useState(true);
  return (
    <div style={{ color: "var(--foreground)", background: "var(--background)", minHeight: "100vh" }}>
      <main style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}>
        <h1>Horizon fireworks</h1>
        <p>The activity and footer share a stable handle. Try repeated clicks; unavailable celebrations are dropped.</p>
        <Activity effects={effects} />
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <label>Water renderer {" "}
            <select value={renderer} onChange={(event) => setRenderer(event.target.value as "2d" | "webgl")}>
              <option value="2d">Flat 2D</option>
              <option value="webgl">WebGL ripple</option>
            </select>
          </label>
          <Button variant="outline" onClick={() => toggleThemeMode()}>Toggle theme</Button>
          <Button variant="outline" onClick={() => setFooterStyle(getFooterStyle() === "static" ? "auto" : "static")}>Toggle Still</Button>
          <Button variant="outline" onClick={() => setMounted((value) => !value)}>{mounted ? "Unmount footer" : "Mount footer"}</Button>
        </div>
      </main>
      {mounted && <SceneFooter effects={effects} animate={animate}
        sceneOptions={{ renderer, variation: 0 }} skyHeight="200px" seaHeight="220px"
        left="Decorative celebrations" right={<a href="#footer-note">Footer link</a>}
        bottom={<span id="footer-note">The consuming app decides when to celebrate.</span>}
      />}
    </div>
  );
}

const meta: Meta<typeof FireworksDemo> = {
  title: "Examples/Scene fireworks",
  component: FireworksDemo,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof FireworksDemo>;
export const SharedTrigger: Story = {};
export const Disabled: Story = { args: { animate: false } };
