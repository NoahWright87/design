import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToggleIcon } from "../src";

const meta: Meta<typeof ToggleIcon> = {
  title: "Components/Molecules/ToggleIcon",
  component: ToggleIcon,
  tags: ["autodocs"],
  argTypes: {
    preset: {
      control: "select",
      options: [
        "hamburger", "moon-sun", "circle", "arrow",
        "plus-minus", "eye", "play-pause", "mute",
        "thumbs", "heart", "bookmark", "lock",
      ],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isToggled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof ToggleIcon>;

export const Default: Story = {
  args: { preset: "hamburger" },
};

export const Presets: Story = {
  name: "All presets",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
      {(["hamburger", "moon-sun", "circle", "arrow", "plus-minus", "eye",
         "play-pause", "mute", "thumbs", "heart", "bookmark", "lock"] as const).map(preset => (
        <div key={preset} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
          <ToggleIcon preset={preset} />
          <span style={{ fontSize: "0.65rem", opacity: 0.6 }}>{preset}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <ToggleIcon preset="heart" size="sm" />
      <ToggleIcon preset="heart" size="md" />
      <ToggleIcon preset="heart" size="lg" />
    </div>
  ),
};

export const Controlled: Story = {
  name: "Controlled (moon-sun)",
  render: () => {
    const [dark, setDark] = React.useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-start" }}>
        <ToggleIcon
          preset="moon-sun"
          isToggled={dark}
          onChange={setDark}
        />
        <span style={{ fontSize: "var(--text-sm)", opacity: 0.7 }}>
          {dark ? "Dark mode active" : "Light mode active"}
        </span>
      </div>
    );
  },
};

export const InteractiveGrid: Story = {
  name: "Interactive — all presets",
  render: () => {
    const presets = [
      "hamburger", "moon-sun", "circle", "arrow", "plus-minus", "eye",
      "play-pause", "mute", "thumbs", "heart", "bookmark", "lock",
    ] as const;
    const [states, setStates] = React.useState<Record<string, boolean>>({});
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {presets.map(preset => (
          <div key={preset} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
            <ToggleIcon
              preset={preset}
              isToggled={states[preset] ?? false}
              onChange={val => setStates(s => ({ ...s, [preset]: val }))}
              size="lg"
            />
            <span style={{ fontSize: "0.65rem", opacity: 0.6 }}>{preset}</span>
          </div>
        ))}
      </div>
    );
  },
};
