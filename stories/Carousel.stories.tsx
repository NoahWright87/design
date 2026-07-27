import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Carousel, Card } from "../src";
import { getNonsense } from "../src/atoms/nonsense";

const meta: Meta<typeof Carousel> = {
  title: "Components/Organisms/Carousel",
  component: Carousel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    autoPlay: {
      control: "boolean",
      description: "Automatically advance through slides",
    },
    interval: {
      control: "number",
      description: "Milliseconds between automatic advances",
    },
    pauseOnHover: {
      control: "boolean",
      description: "Pause autoplay while hovered or focused within",
    },
    aspectRatio: {
      control: "text",
      description: "Aspect ratio of the carousel viewport",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function slides(count: number) {
  return Array.from({ length: count }, (_, i) => (
    <img key={i} src={getNonsense("abstractImage") as string} alt={`Abstract slide ${i + 1}`} />
  ));
}

export const Default: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Carousel items={slides(4)} aria-label="Example carousel" />
    </div>
  ),
};

export const AutoplayDisabled: Story = {
  name: "Autoplay disabled",
  render: () => (
    <div style={{ width: 480 }}>
      <Carousel items={slides(4)} autoPlay={false} aria-label="Manual-only carousel" />
    </div>
  ),
};

export const FastInterval: Story = {
  name: "Custom interval (1.5s)",
  render: () => (
    <div style={{ width: 480 }}>
      <Carousel items={slides(4)} interval={1500} aria-label="Fast carousel" />
    </div>
  ),
};

export const SingleSlide: Story = {
  name: "Single slide (no controls)",
  render: () => (
    <div style={{ width: 480 }}>
      <Carousel items={slides(1)} aria-label="Single slide carousel" />
    </div>
  ),
};

export const SquareAspectRatio: Story = {
  name: "Square aspect ratio",
  render: () => (
    <div style={{ width: 360 }}>
      <Carousel items={slides(3)} aspectRatio="1 / 1" aria-label="Square carousel" />
    </div>
  ),
};

export const AsCardImage: Story = {
  name: "Used as a Card's image",
  render: () => (
    <div style={{ width: 340 }}>
      <Card
        image={<Carousel items={slides(4)} aria-label="Property photos" />}
        title="Lakeside Cabin"
        subtitle="4 photos"
      >
        Passing a Carousel as the image prop gives the card several rotating photos with no other changes required.
      </Card>
    </div>
  ),
};

export const AsExpandableCardImage: Story = {
  name: "Used as an expandable Card's image",
  render: () => (
    <div style={{ width: 340 }}>
      <Card
        image={<Carousel items={slides(4)} aria-label="Property photos" />}
        title="Lakeside Cabin"
        subtitle="4 photos · Sleeps 6"
        longDescription="This three-bedroom cabin sits directly on the lake, with a private dock, a wood-burning stove, and a wraparound porch facing the sunset. Kayaks and paddleboards are included with every stay, and the nearest town is a fifteen-minute drive for groceries or a sit-down dinner."
      >
        A quick summary of the cabin. Expand to see the full description — the carousel keeps rotating the same way in both states.
      </Card>
    </div>
  ),
};
