import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProgressPie } from "../src";

const meta: Meta<typeof ProgressPie> = {
  title: "Components/Molecules/ProgressPie",
  component: ProgressPie,
  tags: ["autodocs"],
  args: { value: 50, label: "Completion" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: { type: "range", min: 48, max: 256, step: 8 } },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressPie>;

export const Default: Story = {};
export const WithoutText: Story = { args: { text: false, value: 35 } };
export const SweepStates: Story = {
  render: () => <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", padding: "1rem" }}>
    {[0, 25, 50, 75, 100].map(value => <ProgressPie key={value} value={value} label={`${value}% completion`} />)}
  </div>,
};
export const Sizes: Story = {
  render: () => <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}>
    {[64, 128, 192].map(size => <ProgressPie key={size} value={65} size={size} label={`Completion at diameter ${size}`} />)}
  </div>,
};
export const ColorRanges: Story = {
  render: () => <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
    {[15, 50, 90].map(value => <ProgressPie key={value} value={value} label="Health" colorRanges={[
      { upTo: 25, color: "var(--danger)" },
      { upTo: 65, color: "var(--secondary)" },
      { upTo: 100, color: "var(--confirm)" },
    ]} />)}
  </div>,
};
export const Interactive: Story = {
  render: function InteractivePie() {
    const [value, setValue] = React.useState(50);
    return <div style={{ display: "grid", justifyItems: "start", gap: "1rem", padding: "1rem" }}>
      <ProgressPie value={value} label="Interactive completion" />
      <label>Progress <input aria-label="Pie progress value" type="range" min={0} max={100} value={value} onChange={event => setValue(Number(event.target.value))} /></label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={() => setValue(0)}>Empty</button>
        <button onClick={() => setValue(50)}>Halfway</button>
        <button onClick={() => setValue(100)}>Fill</button>
      </div>
    </div>;
  },
};
