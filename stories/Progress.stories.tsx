import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "../src";
import type { ProgressShape } from "../src";

const meta: Meta<typeof Progress> = {
  title: "Components/Molecules/Progress", component: Progress, tags: ["autodocs"],
  args: { label: "Completion", value: 65, shape: "BarHorizontal", segments: 0, labelPosition: "center" },
  argTypes: {
    shape: { control: "select", options: ["BarHorizontal", "BarVertical", "Pie", "Ring"] },
    labelPosition: { control: "select", options: ["center", "top", "bottom", "left", "right", "none"] },
    value: { control: { type: "range", min: 0, max: 100 } },
  },
};
export default meta;
type Story = StoryObj<typeof Progress>;
export const Default: Story = {};
export const Interactive: Story = {
  render: function Playground(args) {
    const [value, setValue] = React.useState(65);
    return <div style={{ display: "grid", gap: "1rem", padding: "1.5rem" }}>
      <Progress {...args} value={value} />
      <label>Progress <input type="range" min={0} max={100} value={value} onChange={event => setValue(Number(event.target.value))} /></label>
      <div><button onClick={() => setValue(0)}>Empty</button>{" "}<button onClick={() => setValue(100)}>Fill</button></div>
    </div>;
  },
};
export const ValueColors: Story = {
  render: () => <div style={{ display: "grid", gap: "1rem" }}>
    {[5, 10, 30, 50, 75].map(value => <Progress key={value} label={`Value ${value}`} value={value} colorRanges={[
      { upTo: 10, color: "var(--danger)" },
      { upTo: 50, color: "var(--warning)", textColor: "var(--foreground)" },
      { upTo: 100, color: "var(--confirm)" },
    ]} />)}
  </div>,
};
export const ShapesAndSegments: Story = {
  render: () => <div style={{ display: "grid", gap: "2rem" }}>
    {(["BarHorizontal", "BarVertical", "Pie", "Ring"] as ProgressShape[]).map(shape => <div key={shape} style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <Progress label={`${shape} continuous`} value={65} shape={shape} segments={null} />
      <Progress label={`${shape} segmented`} value={65} shape={shape} segments={10} />
    </div>)}
  </div>,
};
