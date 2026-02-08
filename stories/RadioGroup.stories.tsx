import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "../src";

const shippingOptions = [
  { label: "Standard", value: "standard" },
  { label: "Express", value: "express" },
  { label: "Overnight", value: "overnight" },
];

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Molecules/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Shipping speed",
    name: "shipping-default",
    options: shippingOptions,
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: "Shipping speed",
    name: "shipping-preselected",
    options: shippingOptions,
    defaultValue: "express",
  },
};

export const Disabled: Story = {
  args: {
    label: "Shipping speed",
    name: "shipping-disabled",
    options: shippingOptions,
    defaultValue: "standard",
    disabled: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    label: "Shipping speed",
    name: "shipping-partial",
    options: [
      { label: "Standard", value: "standard" },
      { label: "Express", value: "express" },
      { label: "Overnight (sold out)", value: "overnight", disabled: true },
    ],
  },
};
