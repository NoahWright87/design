import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "../src";

const meta: Meta<typeof Footer> = {
  title: "Components/Organisms/Footer",
  component: Footer,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Basic: Story = {};
