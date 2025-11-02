import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../src/components/Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  argTypes: {
    left: {
      control: "text",
      description: "Content for the left slot"
    },
    center: {
      control: "text",
      description: "Content for the center slot"
    },
    right: {
      control: "text",
      description: "Content for the right slot"
    }
  }
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Basic: Story = {
  args: {
    left: "Logo",
    center: "Page title",
    right: "Profile"
  }
};
