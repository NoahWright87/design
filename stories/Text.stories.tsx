import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../src";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Basic: Story = { args: { children: "Hello world" } };
