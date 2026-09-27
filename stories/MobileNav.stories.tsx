import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Header, MobileNav } from "../src";

const meta: Meta<typeof MobileNav> = {
  title: "Components/Organisms/MobileNav",
  component: MobileNav,
  tags: ["autodocs"],
  argTypes: {
    label:           { control: "text", description: "Accessible label for the hamburger toggle" },
    closeOnNavigate: { control: "boolean", description: "Close the phone dropdown when a link inside it is clicked" },
  },
};
export default meta;

type Story = StoryObj<typeof MobileNav>;

const links = (
  <>
    <a href="#home" aria-current="page">Home</a>
    <a href="#projects">Projects</a>
    <a href="#writing">Writing</a>
    <a href="#about">About</a>
  </>
);

/** Links sit inline on wide screens and collapse into a hamburger dropdown on phones. "Home" is marked as the current page. */
export const Basic: Story = {
  args: { label: "Menu", children: links },
};

/** In a Header slot, the phone dropdown spans the full header width. Narrow the viewport to see it. */
export const InHeaderSlot: Story = {
  render: (args) => (
    <Header left={<strong>Site name</strong>} right={<MobileNav {...args} />} />
  ),
  args: { label: "Menu", children: links },
};
