import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "../src";
import { getNonsense } from "../src/atoms/nonsense";

const meta: Meta<typeof Container> = {
  title: "Components/Organisms/Container",
  component: Container,
  tags: ["autodocs"],
  args: {
    direction: "vertical",
    padding: "md",
    margin: "none",
    itemSpacing: "sm",
    centered: false,
    spaceBetween: false,
    backgroundColor: "transparent",
    foregroundColor: "foreground",
    fullWidth: true,
    width: "100%",
    height: "auto",
    wrap: "always"
  },
  argTypes: {
    direction:       { control: { type: "select" }, options: ["vertical", "horizontal"] },
    padding:         { control: { type: "select" }, options: ["none", "xs", "sm", "md", "lg", "xl"] },
    margin:          { control: { type: "select" }, options: ["none", "xs", "sm", "md", "lg", "xl"] },
    itemSpacing:     { control: { type: "select" }, options: ["none", "xs", "sm", "md", "lg", "xl"] },
    alignItems:      { control: { type: "select" }, options: ["stretch", "flex-start", "center", "flex-end", "baseline"] },
    justifyContent:  { control: { type: "select" }, options: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] },
    centered:        { control: { type: "boolean" } },
    spaceBetween:    { control: { type: "boolean" } },
    backgroundColor: { control: { type: "select" }, options: ["transparent", "background", "foreground", "primary", "secondary", "confirm", "danger"] },
    foregroundColor: { control: { type: "select" }, options: ["foreground", "background", "primary", "secondary", "confirm", "danger"] },
    gutterBorder:    { control: { type: "select" }, options: ["subtle", "medium", "strong"] },
    gutterShadow:    { control: { type: "select" }, options: ["sm", "md", "lg"] },
    fullWidth:       { control: { type: "boolean" } },
    width:           { control: { type: "text" } },
    height:          { control: { type: "text" } },
    wrap:            { control: { type: "select" }, options: ["always", "never"] },
    grow:            { control: { type: "number" } },
    shrink:          { control: { type: "number" } },
    basis:           { control: { type: "text" } },
    children:        { control: { type: "text" } }
  }
};
export default meta;

type Story = StoryObj<typeof Container>;

export const Playground: Story = {
  args: {
    children: "This is a flexible container with placeholder content. Add more text or components to explore spacing and direction."
  }
};

export const Directions: Story = {
  render: () => (
    <Container itemSpacing="md">
      <Container direction="vertical" itemSpacing="xs" padding="sm" backgroundColor="background">
        <div>Vertical 1</div>
        <div>Vertical 2</div>
        <div>Vertical 3</div>
      </Container>
      <Container direction="horizontal" itemSpacing="xs" padding="sm" backgroundColor="background">
        <div>Horizontal 1</div>
        <div>Horizontal 2</div>
        <div>Horizontal 3</div>
      </Container>
    </Container>
  )
};

export const SpacingPresets: Story = {
  render: () => (
    <Container direction="vertical" itemSpacing="md" width="100%">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map(p => (
        <Container key={p} padding={p} itemSpacing="xs" backgroundColor="background">
          <div style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.25rem" }}>Padding {p}</div>
          <div style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.25rem" }}>Second item</div>
        </Container>
      ))}
    </Container>
  )
};

export const ItemSpacingPresets: Story = {
  render: () => (
    <Container direction="vertical" itemSpacing="md" width="100%">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map(g => (
        <Container key={g} itemSpacing={g} padding="sm" backgroundColor="background">
          <div style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.25rem" }}>Gap {g}</div>
          <div style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.25rem" }}>Second item</div>
          <div style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.25rem" }}>Third item</div>
        </Container>
      ))}
    </Container>
  )
};

export const GutterCustomization: Story = {
  render: () => (
    <Container direction="vertical" itemSpacing="md">
      <Container padding="lg" gutterBorder="subtle">
        <div>Subtle gutter border (default)</div>
      </Container>
      <Container padding="lg" gutterBorder="medium">
        <div>Medium gutter border</div>
      </Container>
      <Container padding="lg" gutterBorder="strong">
        <div>Strong gutter border</div>
      </Container>
      <Container padding="lg" gutterShadow="sm">
        <div>Shadow — sm</div>
      </Container>
      <Container padding="lg" gutterShadow="md">
        <div>Shadow — md</div>
      </Container>
      <Container padding="lg" gutterBorder="medium" gutterShadow="lg">
        <div>Medium border + lg shadow combined</div>
      </Container>
    </Container>
  )
};

export const NoBorders: Story = {
  render: () => (
    <Container direction="vertical" itemSpacing="md">
      <Container padding="lg">
        <div>Default — visible side borders + shadow</div>
      </Container>
      <Container padding="lg" noBorders>
        <div>noBorders — all border/shadow treatment removed</div>
      </Container>
      <Container padding="lg" noGutters>
        <div>noGutters — same as noBorders (existing prop)</div>
      </Container>
    </Container>
  ),
};

export const BackgroundImage: Story = {
  render: () => (
    <Container
      padding="xl"
      height="200px"
      backgroundImage={getNonsense("abstractImage") as string}
      foregroundColor="background"
    >
      <div style={{ fontWeight: 600 }}>
        Container with generated background image
      </div>
    </Container>
  )
};

export const ParallaxBackground: Story = {
  render: () => (
    <Container
      padding="xl"
      height="200px"
      backgroundImage={getNonsense("abstractImage") as string}
      foregroundColor="background"
      parallax
    >
      <div style={{ fontWeight: 600 }}>
        Container with parallax background attachment
      </div>
    </Container>
  )
};

export const ColorsAndSizes: Story = {
  render: () => (
    <Container direction="horizontal" itemSpacing="md" width="100%">
      <Container padding="lg" width="50%" backgroundColor="background">
        <div>Width 50% — background</div>
      </Container>
      <Container padding="lg" width={25} backgroundColor="foreground" foregroundColor="background">
        <div>Width 25% — foreground inverted</div>
      </Container>
      <Container padding="lg" width="20rem" backgroundColor="primary" foregroundColor="background">
        <div>Width 20rem — primary color</div>
      </Container>
    </Container>
  )
};

export const AlignmentAndShortcuts: Story = {
  render: () => (
    <Container direction="vertical" itemSpacing="md">
      <Container padding="lg" backgroundColor="background" alignItems="center" justifyContent="space-between" direction="horizontal" height="120px">
        <div>Start</div>
        <div>Middle</div>
        <div>End</div>
      </Container>
      <Container padding="lg" backgroundColor="background" centered height="120px">
        <div>Centered shortcut applies both axes</div>
      </Container>
      <Container padding="lg" backgroundColor="background" spaceBetween direction="horizontal" height="120px">
        <div>Left</div>
        <div>Center</div>
        <div>Right</div>
      </Container>
    </Container>
  )
};

export const FlexItemControls: Story = {
  render: () => (
    <Container direction="horizontal" itemSpacing="sm" wrap="never" fullWidth>
      <Container backgroundColor="primary" foregroundColor="background" padding="md" grow={1} basis="20%">
        grow=1 basis=20%
      </Container>
      <Container backgroundColor="secondary" foregroundColor="background" padding="md" grow={2} basis="30%">
        grow=2 basis=30%
      </Container>
      <Container backgroundColor="confirm" foregroundColor="background" padding="md" grow={0} shrink={0} basis="180px" fullWidth={false}>
        fixed 180px
      </Container>
    </Container>
  )
};
