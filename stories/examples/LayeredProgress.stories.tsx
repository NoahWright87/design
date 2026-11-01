import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LinearProgress, RadialProgress } from "../../src";
import type { ProgressPresentationProps } from "../../src";

const meta: Meta = { title: "Examples/Layered progress" };
export default meta;

export const Combat: StoryObj = {
  render: function Combat() {
    const [shape, setShape] = React.useState("bar");
    const [vertical, setVertical] = React.useState(false);
    const [poisoned, setPoisoned] = React.useState(false);
    const [stats, setStats] = React.useState({ hp: 80, trail: 80, armor: 35 });
    const damage = React.useCallback((poison = false) => setStats(previous => {
      const absorbed = poison ? 0 : Math.min(previous.armor, 12);
      return {
        hp: Math.max(0, previous.hp - (poison ? 4 : 12 - absorbed)),
        armor: previous.armor - absorbed,
        trail: Math.max(previous.trail, previous.hp),
      };
    }), []);
    React.useEffect(() => {
      if (stats.trail <= stats.hp) return;
      const timer = window.setTimeout(() => setStats(previous => ({ ...previous, trail: previous.hp })), 650);
      return () => window.clearTimeout(timer);
    }, [stats.hp, stats.trail]);
    React.useEffect(() => {
      if (!poisoned || stats.hp === 0) return;
      const timer = window.setInterval(() => damage(true), 1000);
      return () => window.clearInterval(timer);
    }, [poisoned, stats.hp === 0, damage]);

    const shared: ProgressPresentationProps = {
      label: "Health", value: stats.hp, max: 100,
      color: "var(--confirm)", text: `${stats.hp} HP`,
      layers: [
        { id: "damage", label: "Health before recent damage", value: stats.trail, max: 100, color: "var(--danger)" },
        { id: "armor", label: "Armor", value: stats.armor, max: 50, color: "var(--primary)", placement: "over", thickness: 6 },
      ],
    };
    return <div style={{ display: "grid", gap: "1rem", maxWidth: "40rem", padding: "1.5rem", color: "var(--foreground)", background: "var(--background)" }}>
      <h1>Health, armor, and damage in one control</h1>
      <label>Shape <select value={shape} onChange={event => setShape(event.target.value)}>
        <option value="bar">Bar</option><option value="segments">Segmented bar</option><option value="pie">Pie</option><option value="ring">Ring</option>
      </select></label>
      {(shape === "bar" || shape === "segments") && <label><input type="checkbox" checked={vertical} onChange={event => setVertical(event.target.checked)} /> Vertical</label>}
      {shape === "bar" || shape === "segments"
        ? <LinearProgress {...shared} orientation={vertical ? "vertical" : "horizontal"} segments={shape === "segments" ? 10 : 1} />
        : <RadialProgress {...shared} variant={shape === "ring" ? "ring" : "pie"} size={160} thickness={24} />}
      <p>Health: {stats.hp}/100 · Armor: {stats.armor}/50 · {poisoned && stats.hp > 0 ? "Poison active" : "Poison inactive"}</p>
      <p>The thin primary-colored band is armor. The danger-colored trail shows recent health loss and catches up after a short delay. Poison bypasses armor.</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button onClick={() => damage()} disabled={stats.hp === 0}>Take 12 damage</button>
        <button onClick={() => setPoisoned(value => !value)} disabled={stats.hp === 0}>{poisoned ? "Cure poison" : "Apply poison"}</button>
        <button onClick={() => setStats(previous => ({ ...previous, armor: 50 }))}>Restore armor</button>
        <button onClick={() => setStats(previous => ({ ...previous, hp: 100, trail: 100 }))}>Heal</button>
        <button onClick={() => { setPoisoned(false); setStats({ hp: 80, trail: 80, armor: 35 }); }}>Reset</button>
      </div>
    </div>;
  },
};
