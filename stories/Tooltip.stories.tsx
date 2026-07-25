import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, Button } from "../src";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Molecules/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    placement: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: "3rem" }}>
      <Tooltip content="Saves your changes">
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "3rem", padding: "3rem" }}>
      <Tooltip content="Appears above" placement="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Appears below" placement="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="Appears to the left" placement="left">
        <Button variant="outline">Left</Button>
      </Tooltip>
      <Tooltip content="Appears to the right" placement="right">
        <Button variant="outline">Right</Button>
      </Tooltip>
    </div>
  ),
};

export const KeyboardAccessible: Story = {
  name: "keyboard focus",
  render: () => (
    <div style={{ padding: "3rem" }}>
      <Tooltip content="Tab to me to see the tooltip on focus">
        <Button>Tab to focus</Button>
      </Tooltip>
    </div>
  ),
};

export const CustomDelay: Story = {
  name: "custom show/hide delay",
  render: () => (
    <div style={{ padding: "3rem" }}>
      <Tooltip content="Shows instantly, lingers for a second" delay={0} hideDelay={1000}>
        <Button variant="ghost">No show delay, slow hide</Button>
      </Tooltip>
    </div>
  ),
};

export const RichContent: Story = {
  render: () => (
    <div style={{ padding: "3rem" }}>
      <Tooltip
        content={
          <>
            <strong>Pro tip:</strong> tooltips can hold more than plain text.
          </>
        }
      >
        <Button variant="text">Hover for rich content</Button>
      </Tooltip>
    </div>
  ),
};

export const WrappingNonButtonContent: Story = {
  name: "wrapping arbitrary content",
  render: () => (
    <div style={{ padding: "3rem" }}>
      <Tooltip content="Works on any inline content, not just buttons">
        <span style={{ textDecoration: "underline dotted", cursor: "help" }}>
          Hover this text
        </span>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: "3rem" }}>
      <Tooltip content="You should never see this" disabled>
        <Button variant="outline">Tooltip disabled</Button>
      </Tooltip>
    </div>
  ),
};
