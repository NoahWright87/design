import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../src";

const meta: Meta<typeof Select> = {
  title: "Components/Molecules/Select",
  component: Select,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Country",
    children: (
      <>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
      </>
    ),
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Country",
    placeholder: "Choose one\u2026",
    children: (
      <>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    label: "Country",
    placeholder: "Choose one\u2026",
    error: "Please select a country",
    children: (
      <>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: "Country",
    defaultValue: "us",
    disabled: true,
    children: (
      <>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </>
    ),
  },
};

export const Required: Story = {
  args: {
    label: "Country",
    placeholder: "Choose one\u2026",
    required: true,
    children: (
      <>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
      </>
    ),
  },
};

export const ErrorWaggle: Story = {
  render: () => {
    const [error, setError] = React.useState<string | undefined>(undefined);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 280 }}>
        <Select label="Country" placeholder="Choose one…" error={error}>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </Select>
        <button
          type="button"
          onClick={() => setError(e => e ? undefined : "Please select a country")}
          style={{ alignSelf: "flex-start" }}
        >
          {error ? "Clear error" : "Trigger error"}
        </button>
      </div>
    );
  },
};

export const ManyOptions: Story = {
  args: {
    label: "State",
    placeholder: "Select a state\u2026",
    children: (
      <>
        <option value="al">Alabama</option>
        <option value="ak">Alaska</option>
        <option value="az">Arizona</option>
        <option value="ca">California</option>
        <option value="co">Colorado</option>
        <option value="ct">Connecticut</option>
        <option value="fl">Florida</option>
        <option value="ny">New York</option>
        <option value="tx">Texas</option>
        <option value="wa">Washington</option>
      </>
    ),
  },
};
