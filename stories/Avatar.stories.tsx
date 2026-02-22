import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../src";

const meta: Meta<typeof Avatar> = {
  title: "Components/Molecules/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image URL"
    },
    alt: {
      control: "text",
      description: "Alt text for image"
    },
    label: {
      control: "text",
      description: "Fallback label (displays first letter)"
    },
    size: {
      control: "number",
      description: "Avatar size in pixels"
    }
  }
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=1",
    alt: "User avatar",
    size: 40
  }
};

export const WithInitial: Story = {
  args: {
    label: "Noah Wright",
    size: 40
  }
};

export const Small: Story = {
  args: {
    label: "S",
    size: 24
  }
};

export const Large: Story = {
  args: {
    label: "L",
    size: 64
  }
};

export const Clickable: Story = {
  args: {
    label: "Click Me",
    size: 40,
    onClick: () => alert("Avatar clicked!")
  }
};

export const InteractiveAnimations: Story = {
  name: "Interactive — hover & press animations",
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      <Avatar label="NW" size={48} onClick={() => {}} />
      <Avatar label="AB" size={64} onClick={() => {}} />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="User" size={48} onClick={() => {}} />
    </div>
  ),
};
