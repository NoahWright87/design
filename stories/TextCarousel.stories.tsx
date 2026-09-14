import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TextCarousel, Heading } from "../src";

const meta: Meta<typeof TextCarousel> = {
  title: "Components/Molecules/TextCarousel",
  component: TextCarousel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    animation: {
      control: "radio",
      options: ["crossfade", "sequential", "typewriter"],
      description: "How each transition plays",
    },
    interval: {
      control: "number",
      description: "Milliseconds each item stays fully visible before transitioning onward",
    },
    transitionDuration: {
      control: "number",
      description: "Milliseconds the fade itself takes (crossfade/sequential only)",
    },
    pauseOnHover: {
      control: "boolean",
      description: "Pause the rotation while hovered",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const titles = ["Software engineering leader", "Product builder", "Lifelong learner", "Coffee enthusiast"];

export const Crossfade: Story = {
  render: () => (
    <Heading level={2}>
      <TextCarousel items={titles} animation="crossfade" />
    </Heading>
  ),
};

export const Sequential: Story = {
  render: () => (
    <Heading level={2}>
      <TextCarousel items={titles} animation="sequential" />
    </Heading>
  ),
};

export const Typewriter: Story = {
  render: () => (
    <Heading level={2}>
      <TextCarousel items={titles} animation="typewriter" />
    </Heading>
  ),
};

export const FastInterval: Story = {
  name: "Custom interval + transition duration",
  render: () => (
    <Heading level={2}>
      <TextCarousel items={titles} animation="crossfade" interval={1000} transitionDuration={150} />
    </Heading>
  ),
};

export const AsPlainSpan: Story = {
  name: "Inline within a sentence",
  render: () => (
    <p style={{ fontSize: "1.1rem" }}>
      I am currently feeling like a{" "}
      <strong>
        <TextCarousel items={["genius", "fraud", "genius fraud"]} animation="typewriter" interval={1800} />
      </strong>
      .
    </p>
  ),
};

export const PartialWordEdit: Story = {
  name: "Typewriter — partial word edits",
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the typewriter\'s word-diffing: "Software engineer" -> "Software builder" only edits the second word, and "Software builder" -> "I build cool stuff" keeps "build" in place (editing just "builder" -> "build") while replacing the rest.',
      },
    },
  },
  render: () => (
    <Heading level={2}>
      <TextCarousel
        items={["Software engineer", "Software builder", "I build cool stuff"]}
        animation="typewriter"
        interval={1800}
      />
    </Heading>
  ),
};

export const SingleItem: Story = {
  name: "Single item (no rotation)",
  render: () => (
    <Heading level={2}>
      <TextCarousel items={["Just one option"]} animation="crossfade" />
    </Heading>
  ),
};
