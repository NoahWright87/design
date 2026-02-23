import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs } from "../src";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Organisms/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Wavelength" },
    ],
  },
};

export const SingleLevel: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "About" },
    ],
  },
};

export const DeepNested: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: "Case Studies", href: "/work/case-studies" },
      { label: "Brand Harmonization", href: "/work/case-studies/brand" },
      { label: "Final Report" },
    ],
  },
};

export const CustomSeparator: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Cascade" }]}
        separator="›"
      />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Cascade" }]}
        separator="→"
      />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Cascade" }]}
        separator="·"
      />
    </div>
  ),
};
