import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../src";

const meta: Meta<typeof Header> = {
  title: "Components/Organisms/Header",
  component: Header,
  tags: ["autodocs"],
  argTypes: {
    left:        { control: "text", description: "Content for the left slot" },
    center:      { control: "text", description: "Content for the center slot" },
    right:       { control: "text", description: "Content for the right slot" },
    leftLabel:   { control: "text", description: "Label for left slot (hidden on mobile)" },
    centerLabel: { control: "text", description: "Label for center slot (hidden on mobile)" },
    rightLabel:  { control: "text", description: "Label for right slot (hidden on mobile)" },
    background:  { control: "text", description: "Custom background (any CSS background value)" },
    shadow:      { control: "boolean", description: "Show bottom shadow/border (on by default)" },
    fixed:       { control: "boolean", description: "Fixed position instead of sticky" },
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Basic: Story = {
  args: { left: "Logo", center: "Page title", right: "Profile" },
};

export const WithLabels: Story = {
  args: {
    left: "🏠", leftLabel: "Home",
    center: "📄", centerLabel: "Documents",
    right: "👤", rightLabel: "Profile",
  },
};

export const CustomBackground: Story = {
  args: {
    left: "Logo",
    center: "Custom background",
    right: "Profile",
    background: "linear-gradient(90deg, var(--primary), var(--secondary))",
  },
};

export const NoShadow: Story = {
  args: { left: "Logo", center: "No shadow", right: "Profile", shadow: false },
};

export const Sticky: Story = {
  render: () => (
    <div>
      <Header left="Logo" center="Sticky Header" right="Profile" />
      <div style={{ height: "200vh", padding: "80px 24px 24px", lineHeight: 2 }}>
        <p>Scroll down to see the header stay pinned to the top of the viewport.</p>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i} style={{ margin: 0 }}>Line {i + 1}</p>
        ))}
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen" },
};
