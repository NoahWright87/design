import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pill } from "../src";

const meta: Meta<typeof Pill> = {
  title: "Components/Molecules/Pill",
  component: Pill,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "secondary", "confirm", "danger"] },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
};
export default meta;

type Story = StoryObj<typeof Pill>;

export const Default: Story = {
  args: { children: "Label" },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Pill variant="default">Default</Pill>
      <Pill variant="primary">Primary</Pill>
      <Pill variant="secondary">Secondary</Pill>
      <Pill variant="confirm">Confirm</Pill>
      <Pill variant="danger">Danger</Pill>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Pill size="small">Small</Pill>
      <Pill size="medium">Medium</Pill>
      <Pill size="large">Large</Pill>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Pill variant="confirm" icon="✓">Verified</Pill>
      <Pill variant="danger" icon="✕">Rejected</Pill>
      <Pill variant="primary" icon="★">Featured</Pill>
      <Pill variant="secondary" icon="⚡">New</Pill>
    </div>
  ),
};
