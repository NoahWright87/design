import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "../src";

const meta: Meta<typeof Link> = {
  title: "Components/Molecules/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    motion: { control: "select", options: ["none", "once", "pulsing"] },
    isExternal: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Basic: Story = {
  args: { href: "#", children: "Go somewhere" },
};

export const External: Story = {
  args: {
    href: "https://example.com",
    children: "Open external link",
    isExternal: true,
  },
};

export const MotionNone: Story = {
  name: "Motion: None",
  args: { href: "#", children: "No animation", motion: "none" },
};

export const MotionOnce: Story = {
  name: "Motion: Once",
  args: { href: "#", children: "Hover me — slingshot plays once", motion: "once" },
};

export const MotionPulsing: Story = {
  name: "Motion: Pulsing (default)",
  args: { href: "#", children: "Hover me — brightness pulses continuously", motion: "pulsing" },
};

export const ExternalPulsing: Story = {
  name: "External + Pulsing",
  args: {
    href: "https://example.com",
    children: "Visit example.com",
    isExternal: true,
    motion: "pulsing",
  },
};

export const AllMotions: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Link href="#" motion="none">None — no animation</Link>
      <Link href="#" motion="once">Once — slingshot on hover-in</Link>
      <Link href="#" motion="pulsing">Pulsing — continuous oscillation (default)</Link>
      <Link href="https://example.com" isExternal motion="once">External once — arrow nudges once</Link>
      <Link href="https://example.com" isExternal motion="pulsing">External pulsing — arrow keeps going</Link>
    </div>
  ),
};
