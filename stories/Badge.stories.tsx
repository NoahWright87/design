import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../src";

const meta: Meta<typeof Badge> = {
  title: "Components/Molecules/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "secondary", "confirm", "danger"] },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { count: 5 },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Badge count={3} variant="danger" />
      <Badge count={3} variant="primary" />
      <Badge count={3} variant="confirm" />
      <Badge count={3} variant="secondary" />
      <Badge count={3} variant="default" />
    </div>
  ),
};

export const MaxCap: Story = {
  name: "max cap (99+)",
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Badge count={7} />
      <Badge count={99} />
      <Badge count={100} />
      <Badge count={999} />
      <Badge count={100} max={50} />
    </div>
  ),
};

export const DotIndicator: Story = {
  name: "dot (no count)",
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      <Badge dot variant="danger" />
      <Badge dot variant="primary" />
      <Badge dot variant="confirm" />
    </div>
  ),
};

export const WrappingAnElement: Story = {
  name: "wrapping an element",
  render: () => (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <Badge count={4}>
        <button style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--foreground)", background: "var(--background)", color: "var(--foreground)", cursor: "pointer" }}>
          Notifications
        </button>
      </Badge>
      <Badge count={12}>
        <span style={{ fontSize: "2rem" }}>🔔</span>
      </Badge>
      <Badge dot variant="confirm">
        <span style={{ fontSize: "2rem", display: "inline-flex", width: "40px", height: "40px", borderRadius: "50%", background: "var(--secondary)", alignItems: "center", justifyContent: "center" }}>
          👤
        </span>
      </Badge>
      <Badge count={0}>
        <span style={{ fontSize: "2rem" }}>📬</span>
      </Badge>
    </div>
  ),
};

export const HiddenWhenZero: Story = {
  name: "hidden when count is 0",
  render: () => {
    const [count, setCount] = React.useState(3);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
        <Badge count={count}>
          <button style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--foreground)", background: "var(--background)", color: "var(--foreground)", cursor: "pointer" }}>
            Messages
          </button>
        </Badge>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => setCount(c => Math.max(0, c - 1))} style={{ padding: "4px 10px", cursor: "pointer" }}>−</button>
          <span style={{ lineHeight: "2" }}>{count}</span>
          <button onClick={() => setCount(c => c + 1)} style={{ padding: "4px 10px", cursor: "pointer" }}>+</button>
        </div>
      </div>
    );
  },
};
