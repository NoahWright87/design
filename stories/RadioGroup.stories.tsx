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
  render: () => {
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState<string | undefined>(undefined);
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!value) setError("Please select a shipping option.");
          else setError(undefined);
        }}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <RadioGroup
          label="Shipping speed"
          name="shipping-required"
          options={shippingOptions}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(undefined); }}
          error={error}
        />
        <button type="submit" style={{ alignSelf: "flex-start" }}>Submit</button>
      </form>
    );
  },
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
