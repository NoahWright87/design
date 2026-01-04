import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../src/components/Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Optional card title",
    },
    subtitle: {
      control: "text",
      description: "Optional subtitle below title",
    },
    children: {
      control: "text",
      description: "Card content",
    },
    elevated: {
      control: "boolean",
      description: "Apply more shadow/elevation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Card Title",
    children: "This is a card with title and content.",
  },
};

export const WithSubtitle: Story = {
  args: {
    title: "Card with Subtitle",
    subtitle: "This is the subtitle",
    children: "Some meaningful content goes here.",
  },
};

export const Elevated: Story = {
  args: {
    title: "Elevated Card",
    subtitle: "More prominent with extra shadow",
    children: "Elevated cards draw more attention to important content.",
    elevated: true,
  },
};

export const NoTitle: Story = {
  args: {
    children: "A simple card without a title.",
  },
};

export const LongContent: Story = {
  args: {
    title: "Long Form Content",
    children: (
      <div>
        <p>
          Cards are perfect for grouping related information and creating visual hierarchy.
        </p>
        <p>
          They work well in grid layouts and can be used for displaying anything from articles
          to product listings.
        </p>
      </div>
    ),
  },
};
