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
    mediaPosition: {
      control: "radio",
      options: ["top", "left", "right"],
      description: "Position of the image relative to the card body. left/right collapse to top on small screens.",
    },
    interactive: {
      control: "boolean",
      description: "Enable hover lift and shadow transition",
    },
    longDescription: {
      control: "text",
      description: "Longer content revealed only when the card expands. Providing this makes the card expandable.",
    },
    expandedImagePosition: {
      control: "radio",
      options: ["top", "between"],
      description: "Where the image sits once the card is expanded.",
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
  render: () => (
    <div style={{ width: 360 }}>
      <Card
        image={<img src={getNonsense("abstractImage") as string} alt="Abstract card visual" />}
        title="Card with Image"
        subtitle="Top media section"
      >
        The image sits above the title and content.
      </Card>
    </div>
  ),
};

export const MediaLeft: Story = {
  name: "Media position — left",
  render: () => (
    <div style={{ width: 480 }}>
      <Card
        image={<img src={getNonsense("abstractImage") as string} alt="Abstract card visual" />}
        mediaPosition="left"
        title="Card with Left Media"
        subtitle="Media sits beside the content"
      >
        On small screens this collapses back to a top-positioned image.
      </Card>
    </div>
  ),
};

export const MediaRight: Story = {
  name: "Media position — right",
  render: () => (
    <div style={{ width: 480 }}>
      <Card
        image={<img src={getNonsense("abstractImage") as string} alt="Abstract card visual" />}
        mediaPosition="right"
        title="Card with Right Media"
        subtitle="Media sits beside the content"
      >
        On small screens this collapses back to a top-positioned image.
      </Card>
    </div>
  ),
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

export const LinkCard: Story = {
  args: {
    title: "Linked Card",
    subtitle: "Entire surface is clickable",
    children: "Use href to make the whole card act like a link.",
    href: "#",
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

export const ExpandableLongDescriptionOnly: Story = {
  name: "Expandable — long description only",
  render: () => (
    <div style={{ width: 340 }}>
      <Card
        title="Notes on Tidal Erosion"
        subtitle="Coastal Geology"
        longDescription="Tidal erosion reshapes coastlines gradually over centuries, as the rhythmic push and pull of the tides wears away at rock, sand, and sediment. This process accelerates during storms, when wave energy is amplified and the usual protective buffers of dune grass and reef are overwhelmed. Studying tidal erosion helps engineers plan more resilient shorelines, from living breakwaters to managed retreats that account for a coastline's long-term drift."
      >
        No short content was given here, so the collapsed card previews the long description, cut off with an ellipsis. Expand to read all of it.
      </Card>
    </div>
  ),
};

export const ExpandableWithShortAndLong: Story = {
  name: "Expandable — short + long description",
  render: () => (
    <div style={{ width: 340 }}>
      <Card
        image={<img src={getNonsense("abstractImage") as string} alt="Abstract card visual" />}
        title="Field Notes: Alpine Lichen"
        subtitle="Botany"
        longDescription="Lichen growing above the treeline survives some of the harshest conditions on land, tolerating freeze-thaw cycles, intense UV exposure, and months without liquid water. Because lichen growth rates are so slow and so consistent, researchers use lichen colonies to date rockfalls and glacial retreat with surprising precision — a technique known as lichenometry."
        footer={
          <CardFooter align="start">Updated 3 days ago</CardFooter>
        }
      >
        A short summary shown in the collapsed card. The longer description above stays hidden until you expand.
      </Card>
    </div>
  ),
};

export const ExpandableImageTop: Story = {
  name: "Expandable — image stays at top when expanded",
  render: () => (
    <div style={{ width: 340 }}>
      <Card
        image={<img src={getNonsense("abstractImage") as string} alt="Abstract card visual" />}
        title="Trail Report: Ridgeline Loop"
        subtitle="Hiking"
        expandedImagePosition="top"
        longDescription="The ridgeline loop climbs steadily for the first two miles before leveling off into a series of rolling switchbacks with panoramic views on both sides. Snowmelt can make the northern descent slick well into early summer, so trekking poles are recommended for that stretch."
      >
        A quick trail summary. By default the image grows and moves between the short and long description when expanded — this card opts into keeping it at the top instead.
      </Card>
    </div>
  ),
};

export const ExpandableLinkCard: Story = {
  name: "Expandable — with href (expand button required)",
  render: () => (
    <div style={{ width: 340 }}>
      <Card
        title="Release Notes v2.4"
        subtitle="Changelog"
        href="#"
        longDescription="Version 2.4 introduces expandable cards, a reworked focus ring for form controls, and a handful of performance improvements to the theming layer. See the full changelog for a breakdown of every change, including a few small breaking changes to the Menu component's keyboard handling."
      >
        Clicking the card follows its link, since href takes precedence — use the expand button in the corner to preview the release notes instead.
      </Card>
    </div>
  ),
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
