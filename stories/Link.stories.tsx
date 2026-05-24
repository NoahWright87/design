import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "../src";

const meta: Meta<typeof Link> = {
  title: "Components/Molecules/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    motion: { control: "select", options: ["none", "once", "pulsing"] },
    isExternal: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Basic: Story = {
  args: { href: "#", children: "Go somewhere" },
};

export const External: Story = {
  args: {
    href: "https://example.com",
    children: "Open external link",
    isExternal: true,
  },
};

export const AffiliateDisclosure: Story = {
  args: {
    href: "#",
    children: "Affiliate link with disclosure prompt",
    isAffiliate: true,
  },
};

export const MotionNone: Story = {
  name: "Motion: None",
  args: { href: "#", children: "No animation", motion: "none" },
};

export const MotionOnce: Story = {
  name: "Motion: Once",
  args: { href: "#", children: "Hover me — slingshot plays once", motion: "once" },
};

export const MotionPulsing: Story = {
  name: "Motion: Pulsing (default)",
  args: { href: "#", children: "Hover me — brightness pulses continuously", motion: "pulsing" },
};

export const ExternalPulsing: Story = {
  name: "External + Pulsing",
  args: {
    href: "https://example.com",
    children: "Visit example.com",
    isExternal: true,
    motion: "pulsing",
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Link href="#" variant="default">Default — primary color, always underlined</Link>
      <Link href="#" variant="subtle">Subtle — muted, underline on hover only</Link>
      <Link href="#" variant="prominent">Prominent — bold, always full color</Link>
    </div>
  ),
};

export const IconSlots: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Link href="#" leadingIcon="←">Back to results</Link>
      <Link href="#" trailingIcon="↓">Download report</Link>
      <Link href="#" leadingIcon="★" trailingIcon="→" variant="prominent">Featured article</Link>
      <Link href="#" leadingIcon="⚙" variant="subtle">Settings</Link>
    </div>
  ),
};

export const AllMotions: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Link href="#" motion="none">None — no animation</Link>
      <Link href="#" motion="once">Once — slingshot on hover-in</Link>
      <Link href="#" motion="pulsing">Pulsing — continuous oscillation (default)</Link>
      <Link href="https://example.com" isExternal motion="once">External once — arrow nudges once</Link>
      <Link href="https://example.com" isExternal motion="pulsing">External pulsing — arrow keeps going</Link>
    </div>
  ),
};

export const CustomComponent: Story = {
  name: "Router `as` prop",
  render: () => {
    // Simulate a router link component (e.g., Next.js Link or React Router Link)
    const FakeRouterLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >(({ href, children, ...rest }, ref) => (
      <a ref={ref} href={href} {...rest} data-router-link="true">
        {children}
      </a>
    ));
    FakeRouterLink.displayName = "FakeRouterLink";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.6 }}>
          Using <code>as</code> prop to render via a custom component (e.g., Next.js Link, React Router Link):
        </p>
        <Link as={FakeRouterLink} href="/about">Navigate to /about</Link>
        <Link as={FakeRouterLink} href="/contact" variant="prominent" trailingIcon="→">Contact us</Link>
        <Link as={FakeRouterLink} href="https://example.com" isExternal>External via custom component</Link>
      </div>
    );
  },
};
