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

export const Dismissable: Story = {
  render: () => {
    const [tags, setTags] = React.useState([
      { id: 1, label: "Design Systems", variant: "primary" as const },
      { id: 2, label: "React", variant: "secondary" as const },
      { id: 3, label: "TypeScript", variant: "secondary" as const },
      { id: 4, label: "CSS", variant: "default" as const },
      { id: 5, label: "Accessible", variant: "confirm" as const },
    ]);

    return (
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {tags.length === 0 && (
          <span style={{ opacity: 0.5 }}>All tags dismissed.</span>
        )}
        {tags.map(tag => (
          <Pill
            key={tag.id}
            variant={tag.variant}
            onDismiss={() => setTags(prev => prev.filter(t => t.id !== tag.id))}
            dismissLabel={`Remove ${tag.label}`}
          >
            {tag.label}
          </Pill>
        ))}
      </div>
    );
  },
};
