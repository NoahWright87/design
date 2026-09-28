import React, { useState } from "react";
import type { Meta } from "@storybook/react";
import { TextCarousel } from "../../src";

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

  function applyPhrases(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setItems(draft.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
    setAppliedTypoChance(Math.min(1, Math.max(0, typoPercent / 100)));
    setRun((current) => current + 1);
  }

  return (
    <main style={{ display: "grid", gap: "2rem", maxWidth: "70rem", margin: "0 auto", padding: "2rem", color: "var(--foreground)", background: "var(--background)" }}>
      <header>
        <h1>Text carousel playground</h1>
        <p>Try reorderings, small corrections, and entirely new phrases. The preview restarts when you apply the list.</p>
      </header>
      <section aria-label="Carousel preview" style={{ minHeight: "10rem", padding: "2rem", border: "1px solid var(--foreground)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1.3, fontWeight: 600, overflowWrap: "anywhere" }}>
        {items.length > 0 ? (
          <TextCarousel key={run} items={items} animation="typewriter" as="div" pauseOnHover={false} interval={1800} typoChance={appliedTypoChance} className="text-carousel-playground__preview" />
        ) : (
          <p>Enter at least one phrase and apply it to start the preview.</p>
        )}
      </section>
      <form onSubmit={applyPhrases} style={{ display: "grid", gap: "0.75rem" }}>
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
