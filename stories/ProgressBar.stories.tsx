import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "../src";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/Molecules/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  args: { value: 50, label: "Completion" },
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};
export const Rounded: Story = { args: { rounded: true, value: 65 } };
export const WithoutText: Story = { args: { text: false, value: 35 } };
export const Endpoints: Story = {
  render: () => <div style={{ display: "grid", gap: "1rem" }}>
    <ProgressBar value={0} label="Empty" />
    <ProgressBar value={50} label="Halfway" />
    <ProgressBar value={100} label="Full" />
  </div>,
};
export const Interactive: Story = {
  render: function InteractiveBar() {
    const [value, setValue] = React.useState(50);
    return <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
      <ProgressBar value={value} label="Interactive completion" />
      <label>Progress <input aria-label="Progress value" type="range" min={0} max={100} value={value} onChange={event => setValue(Number(event.target.value))} /></label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={() => setValue(0)}>Empty</button>
        <button onClick={() => setValue(50)}>Halfway</button>
        <button onClick={() => setValue(100)}>Fill</button>
      </div>
    </div>;
  },
};
