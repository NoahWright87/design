import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal } from "../src/components/Modal";
import { Button } from "../src/components/Button";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "desktop",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the modal is open",
    },
    title: {
      control: "text",
      description: "Modal title",
    },
    closeOnBackdrop: {
      control: "boolean",
      description: "Whether clicking outside closes the modal",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ModalController({
  title = "Modal Title",
  children = "This is the modal content.",
  actions = undefined,
  closeOnBackdrop = true,
}: Partial<React.ComponentProps<typeof Modal>>) {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<string>("");

  return (
    <div style={{ padding: "20px" }}>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      {result && <p style={{ marginTop: "16px", color: "var(--primary)" }}>{result}</p>}
      <Modal
        open={isOpen}
        onClose={(action: string | undefined) => {
          if (action && action !== "cancel") {
            setResult(`You chose: ${action}`);
          } else {
            setResult("Modal closed");
          }
          setIsOpen(false);
        }}
        title={title}
        actions={actions}
        closeOnBackdrop={closeOnBackdrop}
      >
        {children}
      </Modal>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <ModalController
      title="Basic Modal"
      children="This is a simple modal with a default okay button."
    />
  ),
};

export const WithCustomTitle: Story = {
  render: () => (
    <ModalController
      title="Confirm Delete?"
      children="This action cannot be undone. Are you sure?"
    />
  ),
};

export const CustomActions: Story = {
  render: () => (
    <ModalController
      title="Choose an Option"
      actions={[
        { label: "Yes, Confirm", variant: "confirm" },
        { label: "No, Cancel", variant: "danger" },
      ]}
      children="What would you like to do?"
    />
  ),
};

export const MultipleActions: Story = {
  render: () => (
    <ModalController
      title="Survey"
      actions={[
        { label: "Very Satisfied", variant: "confirm" },
        { label: "Satisfied", variant: "primary" },
        { label: "Neutral", variant: "secondary" },
        { label: "Not Satisfied", variant: "danger" },
      ]}
      children="How satisfied are you with our service?"
    />
  ),
};

export const NoBackdropClose: Story = {
  render: () => (
    <ModalController
      title="Important Notice"
      closeOnBackdrop={false}
      children="You must select an action to continue."
      actions={[
        { label: "I Agree", variant: "confirm" },
      ]}
    />
  ),
};

export const LongContent: Story = {
  render: () => (
    <ModalController
      title="Terms & Conditions"
      children={
        <div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
        </div>
      }
      actions={[
        { label: "I Accept", variant: "confirm" },
        { label: "I Decline", variant: "danger" },
      ]}
    />
  ),
};
