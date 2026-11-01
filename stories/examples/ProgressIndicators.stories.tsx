import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "../../src";
import type { ProgressLayer, ProgressShape } from "../../src";
const meta: Meta = { title: "Examples/Progress indicators" };
export default meta;

export const LayersAndSeries: StoryObj = {
  render: function LayersAndSeries() {
    const [shape, setShape] = React.useState<ProgressShape>("BarHorizontal");
    const [hp, setHp] = React.useState(75);
    const [poison, setPoison] = React.useState(10);
    const [shield, setShield] = React.useState(60);
    const [segments, setSegments] = React.useState(0);
    const layers: ProgressLayer[] = [
      { id: "health", label: "Health", appearance: "solid", series: [
        { id: "hp", label: "Safe health", value: hp, color: "var(--danger)" },
        { id: "poison", label: "Health pending poison damage", value: poison, color: "var(--confirm)" },
      ] },
      { id: "shield", label: "Shield", appearance: "hatched", series: [{ id: "shield", label: "Shield charge", value: shield, color: "var(--primary)" }] },
      { id: "reserve", label: "Reserve", appearance: "outline", outlineWidth: 4, series: [{ id: "reserve", label: "Reserve charge", value: 95, color: "var(--secondary)" }] },
    ];
    return <div style={{ display: "grid", gap: "1.5rem", padding: "1.5rem", maxWidth: "42rem" }}>
      <h1>Layers define styling. Series stack inside each layer.</h1>
      <label>Shape <select value={shape} onChange={event => setShape(event.target.value as ProgressShape)}>
        {["BarHorizontal", "BarVertical", "Pie", "Ring"].map(shape => <option key={shape}>{shape}</option>)}
      </select></label>
      <Progress label="Player status" layers={layers} shape={shape} segments={segments} size={220} thickness={24} text="Player status" labelPosition="bottom" />
      <label>Health <input type="range" min={0} max={100} value={hp} onChange={event => setHp(Number(event.target.value))} /> {hp}</label>
      <label>Pending poison <input type="range" min={0} max={100} value={poison} onChange={event => setPoison(Number(event.target.value))} /> {poison}</label>
      <label>Shield <input type="range" min={0} max={100} value={shield} onChange={event => setShield(Number(event.target.value))} /> {shield}</label>
      <label>Segments <input type="number" min={0} max={100} value={segments} onChange={event => setSegments(Number(event.target.value))} /></label>
      <p>Initially, health occupies 0–75%, pending poison occupies 75–85%, and 85–100% is empty. Shield and reserve use separate layers.</p>
      <Progress label="Health and poison only" shape={shape} layers={[layers[0]]} size={160} text={`${hp} + ${Math.min(poison, 100 - hp)}`} labelPosition="bottom" />
    </div>;
  },
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
