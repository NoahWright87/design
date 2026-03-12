import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "../src";

const meta: Meta<typeof Box> = {
  title: "Components/Molecules/Box",
  component: Box,
  tags: ["autodocs"],
  argTypes: {
    padding:    { control: "select", options: ["none", "xs", "sm", "md", "lg", "xl"] },
    paddingX:   { control: "select", options: ["none", "xs", "sm", "md", "lg", "xl"] },
    paddingY:   { control: "select", options: ["none", "xs", "sm", "md", "lg", "xl"] },
    margin:     { control: "select", options: ["none", "xs", "sm", "md", "lg", "xl", "auto"] },
    rounded:    { control: "select", options: ["none", "sm", "md", "lg", "full"] },
    shadow:     { control: "select", options: ["none", "sm", "md", "lg"] },
    background: { control: "select", options: ["transparent", "background", "foreground", "primary", "secondary", "confirm", "danger"] },
  },
};
export default meta;

type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    padding: "md",
    rounded: "md",
    shadow: "sm",
    background: "background",
    children: "Simple content wrapper.",
  },
};

export const Spacing: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map(size => (
        <Box key={size} padding={size} rounded="md" style={{ border: "1px solid var(--primary)", display: "inline-block" }}>
          padding="{size}"
        </Box>
      ))}
    </div>
  ),
};

export const Backgrounds: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {(["background", "foreground", "primary", "secondary", "confirm", "danger"] as const).map(bg => (
        <Box key={bg} padding="md" rounded="md" background={bg}>
          {bg}
        </Box>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      {(["sm", "md", "lg"] as const).map(s => (
        <Box key={s} padding="md" rounded="md" shadow={s}>
          shadow="{s}"
        </Box>
      ))}
    </div>
  ),
};

export const AsSemanticElement: Story = {
  name: "as semantic element",
  render: () => (
    <Box as="section" padding="lg" rounded="lg" shadow="md" background="background">
      <Box as="h2" paddingY="sm" style={{ margin: 0, fontWeight: 700 }}>Section heading</Box>
      <Box as="p" style={{ margin: 0, opacity: 0.7 }}>
        This outer Box renders as a {"<section>"}, the heading as {"<h2>"}, and this paragraph as {"<p>"}.
        Box is a low-level layout primitive — use the <code>as</code> prop to emit the right semantic element.
      </Box>
    </Box>
  ),
};

export const Centered: Story = {
  name: "margin auto centering",
  render: () => (
    <div style={{ width: "100%", background: "color-mix(in srgb, var(--foreground) 5%, transparent)", padding: "2rem" }}>
      <Box padding="md" rounded="md" shadow="md" background="background" margin="auto" style={{ maxWidth: "400px" }}>
        This Box is centered via <code>margin="auto"</code> and <code>maxWidth</code> via style.
      </Box>
    </div>
  ),
};
