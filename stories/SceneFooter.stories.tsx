import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SceneFooter, ToggleIcon, toggleThemeMode, getThemeMode, getFooterStyle, setFooterStyle, FOOTER_STYLES } from "../src";
import type { FooterStyle } from "../src";
import type { FooterScene } from "../src";

type StoryArgs = React.ComponentProps<typeof SceneFooter> & {
  sunX: number;
  moonX: number;
  stars: number;
  clouds: number;
  variation: number;
  starDrift: number;
  waveX: number;
  waveY: number;
  waveSpeed: number;
  waveLength: number;
  renderer: "auto" | "webgl" | "2d";
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
    variation: { control: { type: "range", min: 0, max: 0.5, step: 0.05 }, description: "Horizon scene: how far each visit may stray from the settings above (0.2 = 20% either way, rolled once per page load). Stories start at 0 so the sliders are exact" },
    starDrift: { control: { type: "range", min: 0, max: 6, step: 0.1 }, description: "Horizon scene: star rotation speed about a point far below the horizon (0 holds them still; 1 is the gentle default)" },
    waveX: { control: { type: "range", min: 0, max: 2, step: 0.05 }, description: "Horizon scene, WebGL water: ripple that shifts the reflection sideways" },
    waveY: { control: { type: "range", min: 0, max: 2, step: 0.05 }, description: "Horizon scene, WebGL water: ripple that shifts the reflection up and down" },
    waveSpeed: { control: { type: "range", min: 0, max: 3, step: 0.05 }, description: "Horizon scene, WebGL water: ripple speed" },
    waveLength: { control: { type: "range", min: 0.4, max: 3, step: 0.05 }, description: "Horizon scene, WebGL water: ripple wavelength (larger = broader, slower swells)" },
    renderer: {
      control: { type: "inline-radio" },
      options: ["auto", "webgl", "2d"],
      description: "Horizon scene: water renderer. auto = WebGL ripple on capable devices, flat 2D mirror elsewhere",
    },
  },
  args: {
    animate: true,
    sunX: 0.7,
    moonX: 0.3,
    stars: 1,
    clouds: 1.5,
    starDrift: 2,
    waveX: 1.5,
    waveY: 0.75,
    waveSpeed: 1,
    waveLength: 0.75,
    variation: 0,
    renderer: "auto",
  },
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

function StoryControls() {
  const [dark, setDark] = React.useState(false);
  const [style, setStyle] = React.useState<FooterStyle>("auto");
  React.useEffect(() => {
    setDark(getThemeMode() === "dark");
    setStyle(getFooterStyle());
  }, []);
  return (
    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 2000, display: "flex", gap: 8, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 6, alignItems: "center", color: "var(--foreground)" }}>
        Footer style
        <select
          value={style}
          onChange={(e) => {
            const next = e.target.value as FooterStyle;
            setFooterStyle(next);
            setStyle(next);
          }}
        >
          {FOOTER_STYLES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
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
      <StoryControls />
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
  render: ({ sunX, moonX, stars, clouds, starDrift, waveX, waveY, waveSpeed, waveLength, variation, renderer, ...args }) => (
    <Page>
      <SceneFooter {...args} {...footerSlots} scene="horizon" sceneOptions={{ sunX, moonX, stars, clouds, starDrift, waveX, waveY, waveSpeed, waveLength, variation, renderer }} />
    </Page>
  ),
};

/** Forces the flat 2D mirror: the sky flipped into the sea with no ripple, and no WebGL code is ever loaded. */
export const HorizonFlatMirror: Story = {
  args: { renderer: "2d" },
  render: (args) => Horizon.render!(args, {} as never),
};

/** Forces the WebGL ripple even where it would be software-rendered (for testing). */
export const HorizonWebgl: Story = {
  args: { renderer: "webgl" },
  render: (args) => Horizon.render!(args, {} as never),
};

/** The sun and moon close together, as on the portfolio site: one mirror, so one reflection even mid-handoff. */
export const SunAndMoonClose: Story = {
  args: { sunX: 0.62, moonX: 0.38 },
  render: (args) => Horizon.render!(args, {} as never),
};

/** `animate={false}`: the CSS version only. No scene code is requested. */
export const CssOnly: Story = {
  render: ({ sunX, moonX, stars, clouds, starDrift, waveX, waveY, waveSpeed, waveLength, variation, renderer, ...args }) => (
    <Page>
      <SceneFooter {...args} {...footerSlots} animate={false} scene="horizon" sceneOptions={{ sunX, moonX }} />
    </Page>
  ),
};

export const WithBottomStrip: Story = {
  render: ({ sunX, moonX, stars, clouds, starDrift, waveX, waveY, waveSpeed, waveLength, variation, renderer, ...args }) => (
    <Page>
      <SceneFooter
        {...args}
        {...footerSlots}
        bottom="All rights reserved. Privacy Policy · Terms of Service"
        hasBottomSeparator
        scene="horizon"
        sceneOptions={{ sunX, moonX, stars, clouds, starDrift, waveX, waveY, waveSpeed, waveLength, variation, renderer }}
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
