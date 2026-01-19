import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "../src";

const meta: Meta<typeof Link> = {
  title: "Components/Molecules/Link",
  component: Link,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Basic: Story = {
  args: { href: "#", children: "Go somewhere" }
};
