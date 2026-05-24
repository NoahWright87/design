import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardFooter, CardGrid, Button } from "../src";
import { getNonsense } from "../src/atoms/nonsense";

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

export const WithImage: Story = {
  args: {
    image: <img src={getNonsense("abstractImage") as string} alt="Abstract card visual" />,
    title: "Card with Image",
    subtitle: "Top media section",
    children: "The image sits above the title and content.",
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

export const Scrollable: Story = {
  name: "Scrollable card body",
  render: () => (
    <div style={{ width: 300 }}>
      <Card title="Scrollable Card" scrollable maxHeight={180}>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} style={{ margin: "4px 0" }}>Content line {i + 1}</p>
        ))}
      </Card>
    </div>
  ),
};

export const GridLayout: Story = {
  name: "CardGrid — responsive grid",
  render: () => (
    <CardGrid gap="md">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} title={`Card ${i + 1}`} interactive>
          Cards in a CardGrid auto-fill columns based on the available width.
        </Card>
      ))}
    </CardGrid>
  ),
  parameters: { layout: "padded" },
};

export const GridFixedColumns: Story = {
  name: "CardGrid — fixed 3 columns",
  render: () => (
    <CardGrid columns={3} gap="sm">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} title={`Card ${i + 1}`} flat>
          Fixed 3-column layout regardless of viewport width.
        </Card>
      ))}
    </CardGrid>
  ),
  parameters: { layout: "padded" },
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
