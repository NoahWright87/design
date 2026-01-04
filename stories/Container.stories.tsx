import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "../src";

const meta: Meta<typeof Container> = {
  title: "Components/Container",
  component: Container,
  tags: ["autodocs"],
  args: {
    direction: "vertical",
    padding: "md",
    margin: "none",
    itemSpacing: "sm",
    backgroundColor: "transparent",
    foregroundColor: "var(--foreground)",
    width: "100%",
    height: "auto",
    wrap: "always"
  },
  argTypes: {
    direction: { control: { type: "select" }, options: ["vertical", "horizontal"] },
    padding: { control: { type: "select" }, options: ["none", "xs", "sm", "md", "lg", "xl"] },
    margin: { control: { type: "select" }, options: ["none", "xs", "sm", "md", "lg", "xl"] },
    itemSpacing: { control: { type: "select" }, options: ["none", "xs", "sm", "md", "lg", "xl"] },
    backgroundColor: { control: { type: "text" } },
    foregroundColor: { control: { type: "text" } },
    width: { control: { type: "text" } },
    height: { control: { type: "text" } },
    wrap: { control: { type: "select" }, options: ["always"] },
    children: { control: { type: "text" } }
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
      <Container direction="vertical" itemSpacing="xs" padding="sm" backgroundColor="var(--background)">
        <div>Vertical 1</div>
        <div>Vertical 2</div>
        <div>Vertical 3</div>
      </Container>
      <Container direction="horizontal" itemSpacing="xs" padding="sm" backgroundColor="var(--background)">
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
        <Container key={p} padding={p} itemSpacing="xs" backgroundColor="var(--background)">
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
        <Container key={g} itemSpacing={g} padding="sm" backgroundColor="var(--background)">
          <div style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.25rem" }}>Gap {g}</div>
          <div style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.25rem" }}>Second item</div>
          <div style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.25rem" }}>Third item</div>
        </Container>
      ))}
    </Container>
  )
};

export const ColorsAndSizes: Story = {
  render: () => (
    <Container direction="horizontal" itemSpacing="md" width="100%">
      <Container padding="lg" width="50%" backgroundColor="var(--background)">
        <div>Width 50%</div>
      </Container>
      <Container padding="lg" width={25} backgroundColor="#222" foregroundColor="#fff">
        <div>Width 25 (number → %)</div>
      </Container>
      <Container padding="lg" width="20rem" backgroundColor="#ffe0e0" foregroundColor="#900">
        <div>Width 20rem custom colors</div>
      </Container>
    </Container>
  )
};