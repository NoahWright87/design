import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../src";

const meta: Meta<typeof Input> = {
  title: "Components/Molecules/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
    },
    placeholder: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Name",
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
  },
};

export const WithError: Story = {
  args: {
    label: "Name",
    error: "Name is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Name",
    defaultValue: "John Doe",
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    label: "Email",
    type: "email",
    required: true,
    placeholder: "you@example.com",
  },
};

export const PasswordType: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
};

export const ErrorWaggle: Story = {
  render: () => {
    const [error, setError] = React.useState<string | undefined>(undefined);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 280 }}>
        <Input label="Email" placeholder="you@example.com" error={error} />
        <button
          type="button"
          onClick={() => setError(e => e ? undefined : "This field is required")}
          style={{ alignSelf: "flex-start" }}
        >
          {error ? "Clear error" : "Trigger error"}
        </button>
      </div>
    );
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Input label="Text" type="text" placeholder="Text input" />
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Number" type="number" placeholder="0" />
      <Input label="Tel" type="tel" placeholder="+1 (555) 000-0000" />
      <Input label="URL" type="url" placeholder="https://example.com" />
      <Input label="Search" type="search" placeholder="Search..." />
    </div>
  ),
};
