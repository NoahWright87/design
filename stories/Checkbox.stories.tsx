import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../src";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Molecules/Checkbox",
  component: Checkbox,
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
    label: "I agree to the terms",
  },
};

export const Checked: Story = {
  args: {
    label: "Receive notifications",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Unavailable option",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Already accepted",
    defaultChecked: true,
    disabled: true,
  },
};

export const ErrorWaggle: Story = {
  render: () => {
    const [error, setError] = React.useState<string | undefined>(undefined);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Checkbox label="I agree to the terms" error={error} />
        <button
          type="button"
          onClick={() => setError(e => e ? undefined : "You must agree to continue")}
          style={{ alignSelf: "flex-start" }}
        >
          {error ? "Clear error" : "Trigger error"}
        </button>
      </div>
    );
  },
};
