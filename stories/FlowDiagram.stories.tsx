import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FlowDiagram, type FlowDiagramData, type FlowDiagramLayout } from "../src";
import releaseContent from "./data/release-pipeline.flow.json";
import releaseLayout from "./data/release-pipeline.layout.json";
import checkoutSource from "./data/checkout.flow.mmd?raw";

const meta: Meta<typeof FlowDiagram> = {
  title: "Components/Organisms/FlowDiagram",
  component: FlowDiagram,
  tags: ["autodocs"],
  argTypes: {
    speed: { control: { type: "range", min: 10, max: 200, step: 5 } },
    dotSize: { control: { type: "range", min: 2, max: 8, step: 0.5 } },
    paused: { control: "boolean" },
    labelMotion: { control: "inline-radio", options: ["travel", "still"] },
  },
  args: { speed: 70, dotSize: 4, paused: false, labelMotion: "travel" },
};
export default meta;

type Story = StoryObj<typeof FlowDiagram>;

export const SteadyFlow: Story = {
  name: "Steady flow",
  args: {
    title: "Requests flowing through a service",
    source: `flowchart LR
  Client --success--> Gateway
  Gateway --success--> Service
  Service --success--> Database[(Database)]`,
  },
};

export const ErrorHandling: Story = {
  name: "Error handling (color-coded traffic)",
  args: {
    title: "Ninety percent success, ten percent errors routed to a handler",
    source: `flowchart LR
  A[Requests] --> B(API)
    success:90
    error:10
  B --> C([Happy path])
    success:90
  B --> D{Error handler}
    error:10`,
  },
};

export const Bottleneck: Story = {
  name: "Bottleneck (piles)",
  args: {
    title: "Pull requests piling up while waiting for review",
    source: `flowchart LR
  %% dot pr color=primary
  Devs([Developers]) --> Review(Review)
    pr:40|14
  Review --> Merge((Merge))
    pr:12
  Devs --> Docs(Docs)
    pr:6`,
  },
};

export const Cycle: Story = {
  name: "Cycle (retry loop)",
  args: {
    title: "Failed jobs retry until they succeed",
    source: `flowchart LR
  Queue --> Worker(Worker)
    primary:40
  Worker --> Done((Done))
    success:30
  Worker -.->|retry| Queue
    error:10|4`,
  },
};

export const TwoWay: Story = {
  name: "Two-way traffic",
  args: {
    title: "Requests and responses on the same line",
    source: `flowchart LR
  Browser <--> Server
    primary:60
    <secondary:60
  Server <==> Cache((Cache))
    primary:30
    <confirm:30`,
  },
};

export const Labels: Story = {
  name: "Labels (traveling pills, hover any dot)",
  args: {
    title: "Labeled traffic: hover, click, or tap any dot to see what it is",
    source: `flowchart LR
  Signup([Sign-up form]) -->|submitted| Verify(Verify email)
    success:50 error:12
  Verify -->|verified| Welcome((Welcome))
    success:40
  Verify -->|bounced| Support{Support}
    error:12|6
  Support -.->|resend| Verify
    primary:8`,
  },
};

export const LineStyles: Story = {
  name: "Line styles (no dots)",
  args: {
    title: "Static line styles",
    source: `flowchart TB
  A --> B
  A -.-> C
  A ==> D
  A --- E
  B --> F
    line=dotted color=secondary
  C -- labeled --> F
  D <--> F
    color=primary`,
  },
};

export const FromMermaidFile: Story = {
  name: "From a Mermaid file",
  args: { title: "Checkout flow", source: checkoutSource },
};

export const FromJsonFiles: Story = {
  name: "From JSON content + separate layout",
  args: {
    title: "Release pipeline",
    diagram: releaseContent as FlowDiagramData,
    layout: releaseLayout as unknown as FlowDiagramLayout,
  },
};

interface PlaygroundArgs {
  successDpm: number;
  errorDpm: number;
  pile: number;
  speed: number;
  dotSize: number;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  name: "Playground (live rates)",
  argTypes: {
    successDpm: { control: { type: "range", min: 0, max: 240, step: 5 } },
    errorDpm: { control: { type: "range", min: 0, max: 120, step: 5 } },
    pile: { control: { type: "range", min: 0, max: 40, step: 1 } },
    speed: { control: { type: "range", min: 10, max: 200, step: 5 } },
    dotSize: { control: { type: "range", min: 2, max: 8, step: 0.5 } },
  },
  args: { successDpm: 90, errorDpm: 10, pile: 8, speed: 70, dotSize: 4 },
  render: ({ successDpm, errorDpm, pile, speed, dotSize }) => {
    const pileToken = pile > 0 ? `|${pile}` : "";
    const source = `flowchart LR
  In([Incoming]) --> Triage(Triage)
    success:${successDpm} error:${errorDpm}
  Triage --> Ship((Ship))
    success:${successDpm}
  Triage --> Fix{Fix}
    error:${errorDpm}${pileToken}`;
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <FlowDiagram title="Playground" source={source} speed={speed} dotSize={dotSize} />
        <pre style={{ fontSize: "var(--text-xs)", color: "var(--foreground)" }}>{source}</pre>
      </div>
    );
  },
};
