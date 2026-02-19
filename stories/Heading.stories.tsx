import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "../src";

const meta: Meta<typeof Heading> = {
  title: "Components/Molecules/Heading",
  component: Heading,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = { args: { level: 1, children: "Heading 1" } };
export const H2: Story = { args: { level: 2, children: "Heading 2" } };
export const H3: Story = { args: { level: 3, children: "Heading 3" } };
export const H4: Story = { args: { level: 4, children: "Heading 4" } };
export const H5: Story = { args: { level: 5, children: "Heading 5" } };
export const H6: Story = { args: { level: 6, children: "Heading 6" } };
