import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "../src";

const meta: Meta<typeof Footer> = {
  title: "Components/Organisms/Footer",
  component: Footer,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Basic: Story = {
  args: { center: "© 2026 Noah Wright" },
};

export const WithSlots: Story = {
  args: {
    left: "Logo",
    center: "© 2026 Noah Wright",
    right: "Links here",
  },
};

export const WithBottom: Story = {
  args: {
    left: "Logo",
    center: "© 2026 Noah Wright",
    right: "Links",
    bottom: "All rights reserved. Privacy Policy · Terms of Service",
    hasBottomSeparator: true,
  },
};

export const BottomOnly: Story = {
  args: {
    bottom: "All rights reserved. Privacy Policy · Terms of Service",
  },
};

export const Sticky: Story = {
  render: () => (
    <div style={{ height: "200vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: "24px" }}>
        <p>Scroll down — the footer sticks to the bottom of the viewport.</p>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} style={{ margin: "4px 0" }}>Line {i + 1}</p>
        ))}
      </div>
      <Footer
        isSticky
        left="Logo"
        center="© 2026 Noah Wright"
        right="Links"
        bottom="Privacy Policy · Terms"
        hasBottomSeparator
      />
    </div>
  ),
  parameters: { layout: "fullscreen" },
};

export const Children: Story = {
  args: { children: "Legacy unslotted content" },
};
