import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "../src";

const meta: Meta<typeof Heading> = {
  title: "Components/Molecules/Heading",
  component: Heading,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "text", description: "CSS color value, e.g. var(--primary)" },
    align: { control: "select", options: ["left", "center", "right"] },
    truncate: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = { args: { level: 1, children: "Heading 1" } };
export const H2: Story = { args: { level: 2, children: "Heading 2" } };
export const H3: Story = { args: { level: 3, children: "Heading 3" } };
export const H4: Story = { args: { level: 4, children: "Heading 4" } };
export const H5: Story = { args: { level: 5, children: "Heading 5" } };
export const H6: Story = { args: { level: 6, children: "Heading 6" } };

export const ColoredHeadings: Story = {
  name: "Color prop",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Heading level={2} color="var(--primary)">Primary color</Heading>
      <Heading level={2} color="var(--secondary)">Secondary color</Heading>
      <Heading level={2} color="var(--danger)">Danger color</Heading>
      <Heading level={2} color="var(--confirm)">Confirm color</Heading>
    </div>
  ),
};

export const Alignment: Story = {
  name: "Align prop",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Heading level={3} align="left">Left aligned</Heading>
      <Heading level={3} align="center">Center aligned</Heading>
      <Heading level={3} align="right">Right aligned</Heading>
    </div>
  ),
};

export const Truncation: Story = {
  name: "Truncate prop",
  render: () => (
    <div style={{ width: 240, border: "1px dashed var(--foreground)", padding: "0.5rem" }}>
      <Heading level={3} truncate>
        This very long heading will be clamped to a single line with an ellipsis
      </Heading>
    </div>
  ),
};

export const GradientText: Story = {
  name: "Gradient prop",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Heading level={1} gradient>Gradient headline</Heading>
      <Heading level={2} gradient align="center">Centered gradient</Heading>
    </div>
  ),
};

export const DecorativeUnderline: Story = {
  name: "Underline prop",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Heading level={2} underline>Section title with underline</Heading>
      <Heading level={3} underline color="var(--primary)">Colored + underlined</Heading>
    </div>
  ),
};

export const EyebrowLabel: Story = {
  name: "Eyebrow prop",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Heading level={2} eyebrow="About us">Our Story</Heading>
      <Heading level={2} eyebrow="Services" color="var(--primary)">What we offer</Heading>
    </div>
  ),
};

export const WithIcons: Story = {
  name: "iconStart / iconEnd props",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Heading level={2} iconStart="🚀">Launch Something New</Heading>
      <Heading level={3} iconEnd="✨">Full of magic</Heading>
      <Heading level={3} iconStart="🎯" iconEnd="🏆">Achieve your goals</Heading>
    </div>
  ),
};

export const AnimateOnReveal: Story = {
  name: "animateIn prop",
  render: () => (
    <div>
      <div style={{ height: "65vh", display: "flex", alignItems: "center", opacity: 0.5 }}>
        <p>↓ Scroll down to see the headings animate in.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "4rem" }}>
        <Heading level={2} animateIn>This heading fades in on scroll</Heading>
        <Heading level={3} animateIn>Another section heading</Heading>
        <Heading level={4} animateIn eyebrow="Details">With an eyebrow label too</Heading>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

export const AnchorLink: Story = {
  name: "anchorLink prop",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p style={{ fontSize: "var(--text-sm)", opacity: 0.7 }}>
        Hover over a heading to reveal the ¶ button. Click to copy its anchor URL.
      </p>
      <Heading level={2} anchorLink>Getting Started</Heading>
      <Heading level={3} anchorLink>Installation</Heading>
      <Heading level={3} anchorLink>Configuration</Heading>
      <Heading level={3} anchorLink eyebrow="Advanced">Custom Themes</Heading>
    </div>
  ),
};
