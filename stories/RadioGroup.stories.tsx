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

export const RequiredValidation: Story = {
  name: "Required — inline validation",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <RadioGroup
        label="Shipping speed"
        name="shipping-required"
        options={shippingOptions}
        required
      />
      <p style={{ fontSize: "var(--text-sm)", color: "var(--foreground)", margin: 0 }}>
        Select an option then switch away — or submit without selecting.
      </p>
    </div>
  ),
};

export const EnhancedAnimation: Story = {
  name: "Enhanced selection animation",
  render: () => (
    <RadioGroup
      label="Pick one to see the bounce"
      name="anim-demo"
      options={[
        { label: "Option Alpha", value: "alpha" },
        { label: "Option Beta", value: "beta" },
        { label: "Option Gamma", value: "gamma" },
      ]}
    />
  ),
};

export const ErrorWaggle: Story = {
  render: () => {
    const [error, setError] = React.useState<string | undefined>(undefined);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <RadioGroup
          label="Shipping speed"
          name="shipping-waggle"
          options={shippingOptions}
          error={error}
        />
        <button
          type="button"
          onClick={() => setError(e => e ? undefined : "Please select a shipping option")}
          style={{ alignSelf: "flex-start" }}
        >
          {error ? "Clear error" : "Trigger error"}
        </button>
      </div>
    );
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
