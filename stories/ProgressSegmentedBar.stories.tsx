import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar, ProgressSegmentedBar } from "../src";

const meta: Meta<typeof ProgressSegmentedBar> = {
  title: "Components/Molecules/ProgressSegmentedBar",
  component: ProgressSegmentedBar,
  tags: ["autodocs"],
  args: { value: 65, label: "Completion", segments: 10, gap: 3 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressSegmentedBar>;
export const Default: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const WithoutText: Story = { args: { value: 7, max: 10, segments: 10, text: false } };
export const Interactive: Story = {
  render: function InteractiveSegments() {
    const [value, setValue] = React.useState(50);
    const [vertical, setVertical] = React.useState(false);
    return <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
      <label><input type="checkbox" checked={vertical} onChange={event => setVertical(event.target.checked)} /> Vertical</label>
      <div style={{ display: "flex", flexDirection: vertical ? "row" : "column", gap: "1.5rem" }}>
        <ProgressBar label="Continuous" value={value} orientation={vertical ? "vertical" : "horizontal"} />
        <ProgressSegmentedBar label="Segmented" value={value} orientation={vertical ? "vertical" : "horizontal"} />
      </div>
      <label>Completion <input type="range" min={0} max={100} value={value} onChange={event => setValue(Number(event.target.value))} /></label>
      <div><button onClick={() => setValue(0)}>Empty</button>{" "}<button onClick={() => setValue(100)}>Fill</button></div>
    </div>;
  },
};
