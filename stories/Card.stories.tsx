import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardFooter, Button } from "../src";

const meta: Meta<typeof Card> = {
  title: "Components/Organisms/Card",
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
      description: "Apply more shadow/elevation (on by default)",
    },
    flat: {
      control: "boolean",
      description: "Remove elevation; render with base minimal shadow",
    },
    footer: {
      control: "text",
      description: "Optional footer content",
    },
    interactive: {
      control: "boolean",
      description: "Enable hover lift and shadow transition",
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

export const Flat: Story = {
  args: {
    title: "Flat Card",
    children: "Opt out of elevation with the flat prop.",
    flat: true,
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

export const WithFooter: Story = {
  args: {
    title: "Card with Footer",
    children: "Main content of the card sits here.",
    footer: <CardFooter align="start">Last updated 2 hours ago</CardFooter>,
  },
};

export const FooterWithActions: Story = {
  args: {
    title: "Card with Actions",
    children: "This card has action buttons in the footer.",
    footer: (
      <CardFooter>
        <Button variant="ghost">Cancel</Button>
        <Button variant="solid">Confirm</Button>
      </CardFooter>
    ),
  },
};

export const Interactive: Story = {
  args: {
    title: "Interactive Card",
    children: "Hover over this card to see the lift effect.",
    interactive: true,
  },
};

export const InteractiveElevated: Story = {
  args: {
    title: "Interactive Elevated Card",
    children: "Hover to see the elevated shadow step-up.",
    elevated: true,
    interactive: true,
  },
};

export const FullFeatured: Story = {
  args: {
    title: "Full Featured Card",
    subtitle: "All props enabled",
    children: "This card uses every available prop together.",
    footer: (
      <CardFooter>
        <Button variant="ghost">Cancel</Button>
        <Button variant="solid">Confirm</Button>
      </CardFooter>
    ),
    elevated: true,
    interactive: true,
  },
};
