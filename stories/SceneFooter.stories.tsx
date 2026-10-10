import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SceneFooter, ToggleIcon, toggleThemeMode, getThemeMode } from "../src";
import type { FooterScene } from "../src";

type StoryArgs = React.ComponentProps<typeof SceneFooter> & {
  sunX: number;
  moonX: number;
  stars: number;
  clouds: number;
};

const meta: Meta<StoryArgs> = {
  title: "Components/Organisms/SceneFooter",
  component: SceneFooter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    scene: { control: false },
    sceneOptions: { control: false },
    sunX: { control: { type: "range", min: 0.05, max: 0.95, step: 0.01 }, description: "Horizon scene: sun position across the footer" },
    moonX: { control: { type: "range", min: 0.05, max: 0.95, step: 0.01 }, description: "Horizon scene: moon position across the footer" },
    stars: { control: { type: "range", min: 0, max: 2, step: 0.05 }, description: "Horizon scene: star density" },
    clouds: { control: { type: "range", min: 0, max: 2, step: 0.05 }, description: "Horizon scene: cloud density" },
  },
  args: { animate: true, sunX: 0.7, moonX: 0.3, stars: 1, clouds: 1 },
};
export default meta;

type Story = StoryObj<StoryArgs>;

const pageStyle: React.CSSProperties = {
  background: "var(--background)",
  color: "var(--foreground)",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

function ThemeSwitch() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => setDark(getThemeMode() === "dark"), []);
  return (
    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 2000 }}>
      <ToggleIcon
        preset="moon-sun"
        isToggled={dark}
        onChange={() => setDark(toggleThemeMode() === "dark")}
        label={dark ? "Switch to light mode" : "Switch to dark mode"}
      />
    </div>
  );
}

/** A page tall enough to scroll, so the scene has somewhere to reveal itself. */
function Page({ children }: { children: React.ReactNode }) {
  return (
    <div style={pageStyle}>
      <ThemeSwitch />
      <main style={{ flex: 1, padding: "var(--spacing-xl)", maxWidth: "40rem", margin: "0 auto" }}>
        <h1>Scroll to the bottom</h1>
        <p>The footer is the sea and its top edge is the horizon. Flip the theme while you are down there.</p>
        <div style={{ height: "220vh" }} />
        <p>Almost there.</p>
      </main>
      {children}
    </div>
  );
}

const footerSlots = {
  left: "© 2026 Noah Wright",
  right: <span>Email · LinkedIn · GitHub</span>,
};

export const Horizon: Story = {
  render: ({ sunX, moonX, stars, clouds, ...args }) => (
    <Page>
      <SceneFooter {...args} {...footerSlots} scene="horizon" sceneOptions={{ sunX, moonX, stars, clouds }} />
    </Page>
  ),
};

/** `animate={false}`: the CSS version only. No scene code is requested. */
export const CssOnly: Story = {
  render: ({ sunX, moonX, stars, clouds, ...args }) => (
    <Page>
      <SceneFooter {...args} {...footerSlots} animate={false} scene="horizon" sceneOptions={{ sunX, moonX }} />
    </Page>
  ),
};

export const WithBottomStrip: Story = {
  render: ({ sunX, moonX, stars, clouds, ...args }) => (
    <Page>
      <SceneFooter
        {...args}
        {...footerSlots}
        bottom="All rights reserved. Privacy Policy · Terms of Service"
        hasBottomSeparator
        scene="horizon"
        sceneOptions={{ sunX, moonX, stars, clouds }}
      />
    </Page>
  ),
};

/** `scene={null}`: just the taller footer panel. */
export const NoScene: Story = {
  render: (args) => (
    <Page>
      <SceneFooter {...args} {...footerSlots} scene={null} />
    </Page>
  ),
};

// A scene is a module with `create()`. This one is a single glowing line that breathes.
const pulseScene: FooterScene = {
  create(ctx) {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%";
    ctx.host.append(canvas);
    const g = canvas.getContext("2d")!;
    const color = ctx.readColor(["--primary"], [255, 122, 26]);
    let layout = ctx.layout;
    const size = (next = layout) => {
      layout = next;
      canvas.width = Math.round(layout.width);
      canvas.height = Math.round(layout.height);
    };
    size();
    return {
      resize: (next) => size(next),
      setTheme: () => {},
      render(time, progress) {
        g.clearRect(0, 0, layout.width, layout.height);
        const a = (0.4 + 0.3 * Math.sin(time * 2)) * progress;
        g.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${a})`;
        g.fillRect(0, layout.horizon - 1, layout.width, 3);
      },
      destroy: () => canvas.remove(),
    };
  },
};
const loadPulse = () => Promise.resolve(pulseScene);

/** Your own scene: pass a loader. Real scenes use `() => import("./my-scene")` so they stay out of the main bundle. */
export const CustomScene: Story = {
  render: (args) => (
    <Page>
      <SceneFooter {...args} {...footerSlots} scene={loadPulse} />
    </Page>
  ),
};
