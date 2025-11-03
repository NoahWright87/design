import type { Meta, StoryObj } from "@storybook/react";
import { HamburgerMenu } from "../src";

const meta: Meta<typeof HamburgerMenu> = {
  title: "Components/HamburgerMenu",
  component: HamburgerMenu,
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the menu is open (controls animation)"
    }
  }
};
export default meta;

type Story = StoryObj<typeof HamburgerMenu>;

export const Closed: Story = {
  args: {
    isOpen: false
  }
};

export const Open: Story = {
  args: {
    isOpen: true
  }
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <HamburgerMenu 
        isOpen={open} 
        onToggle={() => setOpen(!open)} 
      />
    );
  }
};

import * as React from "react";
