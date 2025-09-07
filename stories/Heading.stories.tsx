import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "../src";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = { args: { level: 1, children: "Heading 1" } };
export const H2: Story = { args: { level: 2, children: "Heading 2" } };
