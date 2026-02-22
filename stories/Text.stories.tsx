import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../src";

const meta: Meta<typeof Text> = {
  title: "Components/Molecules/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    align: { control: "select", options: ["left", "center", "right", "justify"] },
    tone: { control: "select", options: ["muted", "subtle", "error", "success"] },
    truncate: { control: "boolean" },
    balance: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Basic: Story = { args: { children: "Hello world" } };

export const Truncated: Story = {
  args: {
    children: "This is a very long line of text that will be truncated with an ellipsis when it overflows the container.",
    truncate: true,
  },
  decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>],
};

export const MaxLines: Story = {
  args: {
    children: "This paragraph has more content than will fit in two lines. It demonstrates the multi-line ellipsis clamp behavior, cutting off gracefully with an ellipsis at the end of the second line.",
    maxLines: 2,
  },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const Aligned: Story = {
  args: { children: "Center-aligned text.", align: "center" },
};

export const Balanced: Story = {
  args: {
    children: "A short headline that wraps more naturally with text-wrap balance applied.",
    balance: true,
  },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const AsElement: Story = {
  render: () => (
    <div>
      <Text as="figcaption" tone="muted">figcaption via as="figcaption"</Text>
      <Text as="blockquote">Blockquote styled as Text</Text>
      <Text inline>Inline span — </Text>
      <Text inline tone="subtle">continues on the same line</Text>
    </div>
  ),
};

export const Copyable: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingRight: "2rem" }}>
      <Text isCopyable>Hover to reveal the copy button — click it to copy this text.</Text>
      <Text isCopyable tone="muted">Muted copyable text with clipboard button.</Text>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Text>Default — inherits foreground color</Text>
      <Text tone="subtle">Subtle — slightly muted</Text>
      <Text tone="muted">Muted — significantly muted</Text>
      <Text tone="error">Error — danger color</Text>
      <Text tone="success">Success — confirm color</Text>
    </div>
  ),
};
