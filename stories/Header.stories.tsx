import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../src/components/Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Basic: Story = {};
