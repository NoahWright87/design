import React, { useMemo, useState } from "react";
import type { Meta } from "@storybook/react";
import { TextCarousel, ToggleIcon, buildTypewriterFrames } from "../../src";

const samplePhrases = [
  "creative software builder",
  "software builder creative",
  "Building software with AI",
  "AI is my favorite building block",
  "Building better software with AI",
  "Building better sofware with AI",
  "I build thoughtful experiences",
].join("\n");

function TextCarouselPlayground() {
  const [draft, setDraft] = useState(samplePhrases);
  const [items, setItems] = useState(() => samplePhrases.split("\n"));
  const [typoPercent, setTypoPercent] = useState(0.8);
  const [appliedTypoChance, setAppliedTypoChance] = useState(0.008);
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState('live');
  const [transition, setTransition] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [timing, setTiming] = useState({ typingSpeed: 45, deletingSpeed: 30, interval: 1800, pauseBeforeTyping: 400 });
  const [appliedTiming, setAppliedTiming] = useState(timing);
  const frames = useMemo(() => items.length ? buildTypewriterFrames(items[transition % items.length], items[(transition + 1) % items.length]) : [], [items, transition]);
  const frame = frames[Math.min(frameIndex, frames.length - 1)];

  function applyPhrases(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setItems(draft.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
    setAppliedTypoChance(Math.min(1, Math.max(0, typoPercent / 100)));
    setRun((current) => current + 1);
    setAppliedTiming(timing);
    setTransition(0);
    setFrameIndex(0);
  }

  return (
    <main style={{ display: "grid", gap: "2rem", maxWidth: "70rem", margin: "0 auto", padding: "2rem", color: "var(--foreground)", background: "var(--background)" }}>
      <header>
        <h1>Text carousel playground</h1>
      </header>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <label>Preview mode <select value={mode} onChange={event => setMode(event.target.value)}><option value="live">Live</option><option value="inspect">Inspect transition</option></select></label>
        <ToggleIcon preset="play-pause" label={paused ? 'Resume playback' : 'Pause playback'} isToggled={!paused} onChange={playing => setPaused(!playing)} />
      </div>
      <section aria-label="Carousel preview" style={{ minHeight: "10rem", padding: "2rem", border: "1px solid var(--foreground)", borderRadius: 8, display: "flex", alignItems: "center", fontSize: "2rem", lineHeight: 1.3, fontWeight: 600, overflowWrap: "anywhere" }}>
        {items.length > 0 ? (
          mode === 'inspect' && frame ? <div aria-label="Inspected frame">{frame.text.slice(0, frame.cursor)}<span aria-hidden="true" style={{ borderLeft: '2px solid var(--primary)' }} />{frame.text.slice(frame.cursor)}</div> :
          <TextCarousel key={run} items={items} animation="typewriter" as="div" pauseOnHover={false} paused={paused} {...appliedTiming} typoChance={appliedTypoChance} className="text-carousel-playground__preview" />
        ) : (
          <p>Enter at least one phrase and apply it to start the preview.</p>
        )}
      </section>
      {mode === 'inspect' && items.length > 0 && <div style={{ display: 'grid', gap: 12 }}>
        <label>Transition <select value={transition} onChange={event => { setTransition(Number(event.target.value)); setFrameIndex(0); }}>{items.map((item, index) => <option key={index} value={index}>{index + 1}: {item}</option>)}</select></label>
        <label>Frame {frameIndex + 1} / {frames.length}<input aria-label="Frame" type="range" min={0} max={Math.max(0, frames.length - 1)} value={frameIndex} onChange={event => setFrameIndex(Number(event.target.value))} style={{ width: '100%' }} /></label>
        <div style={{ display: 'flex', gap: 12 }}><button type="button" aria-label="Previous frame" disabled={frameIndex === 0} onClick={() => setFrameIndex(index => index - 1)}>&lt;</button><button type="button" aria-label="Next frame" disabled={frameIndex >= frames.length - 1} onClick={() => setFrameIndex(index => index + 1)}>&gt;</button></div>
      </div>}
      <form onSubmit={applyPhrases} style={{ display: "grid", gap: "0.75rem" }}>
        <fieldset style={{ border: '1px solid var(--overlay)', display: 'flex', gap: 16, flexWrap: 'wrap' }}><legend>Timing</legend>{Object.entries(timing).map(([key, value]) => <label key={key}>{({ typingSpeed: 'Typing delay', deletingSpeed: 'Deleting delay', interval: 'Dwell interval', pauseBeforeTyping: 'Pre-typing pause' } as Record<string, string>)[key]} (ms)<input type="number" min={1} max={10000} required value={value} onChange={event => setTiming(previous => ({ ...previous, [key]: Number(event.target.value) }))} style={{ display: 'block', width: '8rem' }} /></label>)}</fieldset>
        <label htmlFor="text-carousel-phrases">Phrases (one per line)</label>
        <textarea
          id="text-carousel-phrases"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={8}
          spellCheck={false}
          style={{ width: "100%", padding: "0.75rem", font: "inherit", color: "var(--foreground)", background: "var(--background)", border: "1px solid var(--foreground)", borderRadius: "var(--radius)" }}
        />
        <label htmlFor="text-carousel-typo-chance">Typo chance per letter (%)</label>
        <input
          id="text-carousel-typo-chance"
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={typoPercent}
          onChange={(event) => setTypoPercent(Number(event.target.value))}
          style={{ width: "8rem", padding: "0.6rem", font: "inherit", color: "var(--foreground)", background: "var(--background)", border: "1px solid var(--foreground)", borderRadius: "var(--radius)" }}
        />
        <button type="submit" style={{ justifySelf: "start", padding: "0.6rem 1rem", font: "inherit", color: "var(--background)", background: "var(--primary)", border: "none", borderRadius: "var(--radius)", cursor: "pointer" }}>
          Apply phrases and restart
        </button>
      </form>
    </main>
  );
}

const meta: Meta = {
  title: "Examples/Text Carousel Playground",
  component: TextCarouselPlayground,
  parameters: { layout: "fullscreen", docs: { disable: true } },
  tags: ["!autodocs"],
};

export default meta;

export const Playground = {};
