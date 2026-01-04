import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../src";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
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
