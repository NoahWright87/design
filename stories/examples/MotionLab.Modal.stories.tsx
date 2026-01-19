import type { Meta, StoryObj } from "@storybook/react";
import { MotionLab } from "../../src/labs/motion/MotionLab";
import { modalMotionAdapter } from "../../src/labs/motion/adapters/modal.motion";

const meta: Meta<typeof MotionLab> = {
  title: "Labs/Motion Lab/Modal",
  component: MotionLab,
  parameters: {
    docs: { disable: true },
    layout: "fullscreen",
  },
  tags: ["!autodocs"],
};

export default meta;
type Story = StoryObj<typeof MotionLab>;

export const ModalMotion: Story = {
  args: {
    adapter: modalMotionAdapter,
  },
};
