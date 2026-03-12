import type { Meta, StoryObj } from "@storybook/react";
import { MotionLab } from "../../src/labs/motion/MotionLab";
import { buttonMotionAdapter } from "../../src/labs/motion/adapters/button.motion";

const meta: Meta<typeof MotionLab> = {
  title: "Labs/Motion Lab/Button",
  component: MotionLab,
  parameters: {
    docs: { disable: true },
    layout: "fullscreen",
  },
  tags: ["!autodocs"],
};

export default meta;
type Story = StoryObj<typeof MotionLab>;

export const ButtonMotion: Story = {
  args: {
    adapter: buttonMotionAdapter,
  },
};
