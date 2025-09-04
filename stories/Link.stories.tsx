import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "../src/components/Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Basic: Story = {
  args: { href: "#", children: "Go somewhere" }
};
