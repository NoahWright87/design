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

export const CustomColors: Story = {
  name: "Custom colors (style prop)",
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Pill style={{ backgroundColor: "#7c3aed", color: "#fff" }}>Purple</Pill>
      <Pill style={{ backgroundColor: "#f97316", color: "#fff" }}>Orange</Pill>
      <Pill style={{ backgroundColor: "#0ea5e9", color: "#fff" }}>Sky</Pill>
      <Pill style={{ backgroundColor: "#d1fae5", color: "#065f46" }}>Mint</Pill>
      <Pill style={{ backgroundColor: "transparent", color: "var(--foreground)", border: "1.5px solid currentColor" }}>Outlined</Pill>
    </div>
  ),
};

export const LinkVariant: Story = {
  name: "href (link variant)",
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Pill href="#" variant="primary">Design Systems</Pill>
      <Pill href="#" variant="secondary">React</Pill>
      <Pill href="#" variant="default" icon="→">Read more</Pill>
      <Pill href="#" variant="confirm">Open source</Pill>
    </div>
  ),
};

export const HideLabel: Story = {
  name: "hideLabel (icon-only + tooltip)",
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingTop: "2.5rem" }}>
      <Pill variant="primary" icon="★" hideLabel>Featured post</Pill>
      <Pill variant="confirm" icon="✓" hideLabel>Verified</Pill>
      <Pill variant="danger" icon="!" hideLabel>High priority</Pill>
      <Pill variant="secondary" icon="⚡" hideLabel>New arrival</Pill>
      <Pill variant="default" icon="📌" hideLabel>Pinned</Pill>
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
