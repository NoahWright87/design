import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "../../src";
import { ProgressShowcase } from "./ProgressShowcase";
const meta: Meta = { title: "Examples/Progress indicators" };
export default meta;

export const Showcase: StoryObj = {
  render: () => <ProgressShowcase />,
};

export const TimersXpAndScroll: StoryObj = {
  render: function Sources() {
    const [remaining, setRemaining] = React.useState(15);
    const [running, setRunning] = React.useState(false);
    const [xp, setXp] = React.useState(350);
    const [scroll, setScroll] = React.useState(0);
    React.useEffect(() => {
      if (!running) return;
      const start = Date.now();
      const initial = remaining;
      const timer = window.setInterval(() => {
        const next = Math.max(0, initial - (Date.now() - start) / 1000);
        setRemaining(next);
        if (next === 0) setRunning(false);
      }, 50);
      return () => window.clearInterval(timer);
    }, [running]);
    return <div style={{ display: "grid", gap: "1rem" }}>
      <Progress label="Time remaining" shape="Ring" value={remaining} max={15} text={({ value }) => `${Math.ceil(value)}s`} />
      <div><button disabled={remaining === 0} onClick={() => setRunning(value => !value)}>{running ? "Pause" : "Start"}</button>{" "}<button onClick={() => { setRunning(false); setRemaining(15); }}>Reset</button></div>
      <Progress label="Experience" value={xp} max={1000} text={({ value, max }) => `${value} / ${max} XP`} labelPosition="top" segments={10} />
      <button onClick={() => setXp(value => Math.min(1000, value + 125))}>Earn XP</button>
      <Progress label="Reading progress" value={scroll} labelPosition="right" />
      <div tabIndex={0} role="region" aria-label="Reading example" style={{ height: "10rem", overflow: "auto" }} onScroll={event => {
        const element = event.currentTarget;
        const distance = element.scrollHeight - element.clientHeight;
        setScroll(distance > 0 ? element.scrollTop / distance * 100 : 100);
      }}>{Array.from({ length: 12 }, (_, index) => <p key={index}>Section {index + 1}. All sources use one Progress component with shared normalization and animation.</p>)}</div>
    </div>;
  },
};
