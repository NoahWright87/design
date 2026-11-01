import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar, ProgressPie, ProgressRing, ProgressSegmentedBar } from "../../src";
import type { ProgressColorRange } from "../../src";

const meta: Meta = { title: "Examples/Progress indicators" };
export default meta;
type Story = StoryObj;

const health: readonly ProgressColorRange[] = [
  { upTo: 25, color: "var(--danger)" },
  { upTo: 65, color: "var(--secondary)" },
  { upTo: 100, color: "var(--confirm)" },
];
const heat: readonly ProgressColorRange[] = [
  { upTo: 50, color: "var(--confirm)" },
  { upTo: 80, color: "var(--secondary)" },
  { upTo: 100, color: "var(--danger)" },
];

export const Collection: Story = {
  render: function Collection() {
    const [shape, setShape] = React.useState<"bar" | "pie" | "ring" | "segments">("bar");
    const Indicator = shape === "pie" ? ProgressPie : shape === "ring" ? ProgressRing : shape === "segments" ? ProgressSegmentedBar : ProgressBar;
    const [completion, setCompletion] = React.useState(50);
    const [remaining, setRemaining] = React.useState(15);
    const [running, setRunning] = React.useState(false);
    const [xp, setXp] = React.useState(350);
    const [temperature, setTemperature] = React.useState(40);
    const [scroll, setScroll] = React.useState(0);

    React.useEffect(() => {
      if (!running) return;
      const started = Date.now();
      const initial = remaining;
      const timer = window.setInterval(() => {
        const next = Math.max(0, initial - (Date.now() - started) / 1000);
        setRemaining(next);
        if (next === 0) setRunning(false);
      }, 50);
      return () => window.clearInterval(timer);
      // Capture remaining only on start/resume; ticks keep the same clock origin.
    }, [running]);

    return <div style={{ display: "grid", gap: "2rem", maxWidth: "44rem", padding: "1rem", color: "var(--foreground)", background: "var(--background)" }}>
      <h1>Many shapes. Shared progress.</h1>
      <label>Indicator shape <select value={shape} onChange={event => setShape(event.target.value as typeof shape)}>
        <option value="bar">Bar</option>
        <option value="pie">Pie</option>
        <option value="ring">Ring</option>
        <option value="segments">Segmented bar</option>
      </select></label>
      <section>
        <h2>Completion</h2>
        <Indicator label="Completion" value={completion} colorRanges={health} />
        <label>Completion <input type="range" min={0} max={100} value={completion} onChange={event => setCompletion(Number(event.target.value))} /></label>
      </section>
      <section>
        <h2>Countdown</h2>
        <Indicator label="Time remaining" value={remaining} max={15} text={() => `${Math.ceil(remaining)}s remaining`} />
        <button disabled={remaining === 0} onClick={() => setRunning(value => !value)}>{running ? "Pause" : "Start"}</button>{" "}
        <button onClick={() => { setRunning(false); setRemaining(15); }}>Reset</button>
      </section>
      <section>
        <h2>Experience</h2>
        <Indicator label="Experience toward next level" value={xp} max={1000} color="var(--secondary)" text={({ value, max }) => shape === "pie" || shape === "ring" ? `${value} XP` : `${value} / ${max} XP`} />
        <button onClick={() => setXp(value => Math.min(1000, value + 125))}>Earn 125 XP</button>{" "}
        <button onClick={() => setXp(0)}>New level</button>
      </section>
      <section>
        <h2>Weapon heat</h2>
        <Indicator label="Weapon heat" value={temperature} colorRanges={heat} text={({ percentage }) => percentage === 100 ? "OVERHEATED" : `${Math.round(percentage)}% HEAT`} />
        <label>Heat <input type="range" min={0} max={100} value={temperature} onChange={event => setTemperature(Number(event.target.value))} /></label>
      </section>
      <section>
        <h2>Reading progress</h2>
        <Indicator label="Reading progress" value={scroll} />
        <div tabIndex={0} role="region" aria-label="Scrollable reading example" style={{ height: "10rem", overflow: "auto", border: "1px solid var(--foreground)", padding: "1rem", marginTop: "1rem" }} onScroll={event => {
          const element = event.currentTarget;
          const distance = element.scrollHeight - element.clientHeight;
          setScroll(distance > 0 ? element.scrollTop / distance * 100 : 100);
        }}>
          {Array.from({ length: 12 }, (_, index) => <p key={index}>Section {index + 1}. Scroll through this passage to update the shared progress indicator. The bar takes a value; the application decides where that value comes from.</p>)}
        </div>
      </section>
    </div>;
  },
};
