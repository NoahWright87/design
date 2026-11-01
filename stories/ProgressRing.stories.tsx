import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProgressRing, RadialProgress } from "../src";

const meta: Meta<typeof ProgressRing> = {
  title: "Components/Molecules/ProgressRing",
  component: ProgressRing,
  tags: ["autodocs"],
  args: { value: 65, label: "Completion", size: 128, thickness: 16 },
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
};
export default meta;
type Story = StoryObj<typeof ProgressRing>;
export const Default: Story = {};
export const Thicknesses: Story = {
  render: () => <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
    {[8, 16, 28].map(thickness => <ProgressRing key={thickness} value={65} label={`Ring width ${thickness}`} thickness={thickness} />)}
  </div>,
};
export const Interactive: Story = {
  render: function InteractiveRing() {
    const [value, setValue] = React.useState(50);
    return <div style={{ display: "grid", gap: "1rem", justifyItems: "start", padding: "1rem" }}>
      <ProgressRing value={value} label="Interactive completion" />
      <label>Completion <input type="range" min={0} max={100} value={value} onChange={event => setValue(Number(event.target.value))} /></label>
      <div><button onClick={() => setValue(0)}>Empty</button>{" "}<button onClick={() => setValue(100)}>Fill</button></div>
    </div>;
  },
};
export const ApplicationWrapper: Story = {
  render: () => <RadialProgress variant="ring" label="Level experience" value={350} max={1000} size={160} thickness={12} color="var(--secondary)" text={({ value, max }) => `${value} / ${max} XP`}>
    {({ percentage }) => <span><strong>Level 7</strong><br />{Math.round(percentage)}% XP</span>}
  </RadialProgress>,
};
