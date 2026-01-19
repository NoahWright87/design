import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../src";

const meta: Meta<typeof Button> = {
  title: "Components/Molecules/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost", "text"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    color: {
      control: "text",
    },
    iconPosition: {
      control: "select",
      options: ["left", "right", "center", "top", "bottom"],
    },
    motion: {
      control: "select",
      options: ["none", "subtle", "bouncy"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

// Simple icon component for demo
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0l2.163 5.568L16 6.568l-4.5 4.062.938 6.37L8 13.568 3.562 17l.938-6.37L0 6.568l5.837-1 L8 0z" />
  </svg>
);

export const Basic: Story = {
  args: { children: "Click me" },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="confirm">Confirm</Button>
      <Button color="danger">Danger</Button>
      <Button color="#ff5733">Custom Hex</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button icon={<StarIcon />} iconPosition="left">
        Icon Left
      </Button>
      <Button icon={<StarIcon />} iconPosition="right">
        Icon Right
      </Button>
      <Button icon={<StarIcon />} iconPosition="top">
        Icon Top
      </Button>
      <Button icon={<StarIcon />} iconPosition="bottom">
        Icon Bottom
      </Button>
    </div>
  ),
};

export const IconCenter: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button icon={<StarIcon />} iconPosition="center">
        Hover to see label
      </Button>
      <Button icon={<StarIcon />} iconPosition="center" variant="outline">
        Outline center
      </Button>
      <Button icon={<StarIcon />} iconPosition="center" variant="ghost">
        Ghost center
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button disabled>Solid Disabled</Button>
      <Button variant="outline" disabled>
        Outline Disabled
      </Button>
      <Button variant="ghost" disabled>
        Ghost Disabled
      </Button>
      <Button variant="text" disabled>
        Text Disabled
      </Button>
    </div>
  ),
};

export const MotionPresets: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
      <div>
        <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
          None
        </p>
        <Button motion="none">No Animation</Button>
      </div>
      <div>
        <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
          Subtle
        </p>
        <Button motion="subtle">Gentle Motion</Button>
      </div>
      <div>
        <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
          Bouncy (default)
        </p>
        <Button motion="bouncy">Extra Bouncy!</Button>
      </div>
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h3 style={{ marginBottom: "1rem" }}>Primary Color</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button variant="solid" color="primary">
            Primary Solid
          </Button>
          <Button variant="outline" color="primary">
            Primary Outline
          </Button>
          <Button variant="ghost" color="primary">
            Primary Ghost
          </Button>
          <Button variant="text" color="primary">
            Primary Text
          </Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "1rem" }}>Secondary Color</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button variant="solid" color="secondary">
            Secondary Solid
          </Button>
          <Button variant="outline" color="secondary">
            Secondary Outline
          </Button>
          <Button variant="ghost" color="secondary">
            Secondary Ghost
          </Button>
          <Button variant="text" color="secondary">
            Secondary Text
          </Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "1rem" }}>Confirm & Danger</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button color="confirm">Confirm</Button>
          <Button color="danger">Danger</Button>
        </div>
      </div>
    </div>
  ),
};

