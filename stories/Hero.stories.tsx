import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Hero, Heading, Text, Button, TextCarousel, Carousel } from "../src";
import { getNonsense } from "../src/atoms/nonsense";

const meta: Meta<typeof Hero> = {
  title: "Components/Organisms/Hero",
  component: Hero,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    mediaPosition: {
      control: "radio",
      options: ["start", "end"],
      description: "Which side media sits on relative to the text content",
    },
    background: {
      control: "radio",
      options: ["none", "subtle", "primary", "secondary"],
      description: "Background treatment distinguishing the hero from the page",
    },
    bottomBorder: {
      control: "radio",
      options: ["none", "solid", "gradient"],
      description: "Decoration along the hero's bottom edge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function placeholderMedia() {
  return <img src={getNonsense("abstractImage") as string} alt="" style={{ borderRadius: 20 }} />;
}

export const TitleOnly: Story = {
  name: "Title only",
  render: () => <Hero title={<Heading level={1}>Just a title</Heading>} />,
};

export const Basic: Story = {
  render: () => (
    <Hero
      title={<Heading level={1}>👋 I&apos;m Noah</Heading>}
      tagline={<Heading level={2}>Software engineering leader</Heading>}
      description={<Text>{getNonsense("introText")}</Text>}
      actions={
        <>
          <Button variant="solid" color="primary">My Projects</Button>
          <Button variant="outline">Resume</Button>
        </>
      }
      media={placeholderMedia()}
    />
  ),
};

export const MediaStart: Story = {
  name: "Media on the start (left) side",
  render: () => (
    <Hero
      mediaPosition="start"
      title={<Heading level={1}>Media leads</Heading>}
      description={<Text>{getNonsense("introText")}</Text>}
      actions={<Button variant="solid">Get in touch</Button>}
      media={placeholderMedia()}
    />
  ),
};

export const NoMedia: Story = {
  name: "No media (text takes full width)",
  render: () => (
    <Hero
      title={<Heading level={1}>No media slot at all</Heading>}
      description={<Text>{getNonsense("introText")}</Text>}
      actions={<Button variant="solid">Get started</Button>}
    />
  ),
};

export const BackgroundSubtle: Story = {
  name: "Background: subtle",
  render: () => (
    <Hero
      background="subtle"
      title={<Heading level={1}>Subtly tinted hero</Heading>}
      description={<Text>{getNonsense("introText")}</Text>}
      media={placeholderMedia()}
    />
  ),
};

export const BackgroundPrimary: Story = {
  name: "Background: primary",
  render: () => (
    <Hero
      background="primary"
      title={<Heading level={1}>Primary-tinted hero</Heading>}
      description={<Text>{getNonsense("introText")}</Text>}
      media={placeholderMedia()}
    />
  ),
};

export const BackgroundSecondary: Story = {
  name: "Background: secondary",
  render: () => (
    <Hero
      background="secondary"
      title={<Heading level={1}>Secondary-tinted hero</Heading>}
      description={<Text>{getNonsense("introText")}</Text>}
      media={placeholderMedia()}
    />
  ),
};

export const BottomBorderSolid: Story = {
  name: "Bottom border: solid",
  render: () => (
    <Hero
      bottomBorder="solid"
      title={<Heading level={1}>Solid bottom divider</Heading>}
      description={<Text>{getNonsense("introText")}</Text>}
      media={placeholderMedia()}
    />
  ),
};

export const BottomBorderGradient: Story = {
  name: "Bottom border: gradient",
  render: () => (
    <Hero
      bottomBorder="gradient"
      title={<Heading level={1}>Gradient bottom bar</Heading>}
      description={<Text>{getNonsense("introText")}</Text>}
      media={placeholderMedia()}
    />
  ),
};

export const BackgroundAndBorderCombined: Story = {
  name: "Background + bottom border combined",
  render: () => (
    <Hero
      background="subtle"
      bottomBorder="gradient"
      title={<Heading level={1}>Both treatments together</Heading>}
      description={<Text>{getNonsense("introText")}</Text>}
      media={placeholderMedia()}
    />
  ),
};

export const RotatingTaglineAndMedia: Story = {
  name: "Composed with TextCarousel + Carousel",
  render: () => (
    <Hero
      background="subtle"
      bottomBorder="gradient"
      title={<Heading level={1}>👋 I&apos;m Noah</Heading>}
      tagline={
        <Heading level={2}>
          <TextCarousel
            items={["Software engineering leader", "Product builder", "Lifelong learner"]}
            animation="typewriter"
          />
        </Heading>
      }
      description={<Text>{getNonsense("introText")}</Text>}
      actions={<Button variant="solid" color="primary">My Projects</Button>}
      media={
        <Carousel
          items={[getNonsense("abstractImage") as string, getNonsense("abstractImage") as string, getNonsense("abstractImage") as string].map(
            (src, i) => <img key={i} src={src} alt="" style={{ borderRadius: 20 }} />
          )}
          aspectRatio="1 / 1"
          showControls={false}
          decorative
        />
      }
    />
  ),
};
