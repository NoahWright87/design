import * as React from "react";
import type { MotionAdapter, MotionValues, MotionKnob } from "./types";
import { Range } from "./ui/Range";
import { Select } from "./ui/Select";
import { Toggle } from "./ui/Toggle";
import { EasingGraph } from "./ui/EasingGraph";
import { GeneratedCss } from "./ui/GeneratedCss";
import styles from "./MotionLab.module.css";

export interface MotionLabProps {
  adapter: MotionAdapter;
}

export function MotionLab({ adapter }: MotionLabProps) {
  const [presetName, setPresetName] = React.useState(adapter.presets[0]?.name ?? "");
  const [values, setValues] = React.useState<MotionValues>({});
  const [copiedEasing, setCopiedEasing] = React.useState<string | null>(null);

  // Initialize values from adapter defaults
  React.useEffect(() => {
    if (!adapter) return;
    const defaultValues: MotionValues = {};
    adapter.knobs.forEach((knob) => {
      defaultValues[knob.id] = knob.defaultValue;
    });
    setValues(defaultValues);
    setPresetName(adapter.presets[0]?.name ?? "");
  }, [adapter]);

  // Apply preset when changed
  React.useEffect(() => {
    if (!adapter || !presetName) return;
    const preset = adapter.presets.find((p) => p.name === presetName);
    if (preset) {
      setValues({ ...preset.values });
    }
  }, [presetName, adapter]);

  const applyPreset = React.useCallback((name: string) => {
    const preset = adapter.presets.find((item) => item.name === name);

    if (preset) {
      setPresetName(name);
      setValues({ ...preset.values });
    }
  }, [adapter]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.metaKey || event.altKey) return;

      const presetIndex = Number(event.key) - 1;
      const preset = adapter.presets[presetIndex];

      if (!preset) return;

      event.preventDefault();
      applyPreset(preset.name);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [adapter, applyPreset]);

  const handleValueChange = (knobId: string, value: number | string | boolean) => {
    setValues((prev) => ({ ...prev, [knobId]: value }));
  };

  const handleCopyEasing = (prefix: string, value: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setCopiedEasing(prefix);
      setTimeout(() => setCopiedEasing(null), 1500);
    });
  };

  const renderKnob = (knob: MotionKnob) => {
    const value = values[knob.id] ?? knob.defaultValue;

    if (knob.type === "range") {
      return (
        <Range
          key={knob.id}
          label={knob.label}
          min={knob.min ?? 0}
          max={knob.max ?? 100}
          step={knob.step ?? 1}
          value={value as number}
          onChange={(v) => handleValueChange(knob.id, v)}
        />
      );
    }

    if (knob.type === "select") {
      return (
        <Select
          key={knob.id}
          label={knob.label}
          value={value as string}
          onChange={(v) => handleValueChange(knob.id, v)}
          options={knob.options ?? []}
        />
      );
    }

    if (knob.type === "toggle") {
      return (
        <Toggle
          key={knob.id}
          label={knob.label}
          value={value as boolean}
          onChange={(v) => handleValueChange(knob.id, v)}
        />
      );
    }

    return null;
  };

  // Generate easing graph sections for bezier knobs
  const renderEasingSection = (title: string, prefix: string) => {
    const x1Value = values[`${prefix}_x1`] as number;
    const y1Value = values[`${prefix}_y1`] as number;
    const x2Value = values[`${prefix}_x2`] as number;
    const y2Value = values[`${prefix}_y2`] as number;

    if (
      x1Value === undefined ||
      y1Value === undefined ||
      x2Value === undefined ||
      y2Value === undefined
    ) {
      return null;
    }

    const bezierString = `cubic-bezier(${x1Value}, ${y1Value}, ${x2Value}, ${y2Value})`;

    return (
      <Section title={title} key={prefix}>
        <div className={styles.easingGrid}>
          <div className={styles.easingGraphWrap}>
            <EasingGraph x1={x1Value} y1={y1Value} x2={x2Value} y2={y2Value} />
          </div>
          <div className={styles.bezierControls}>
            {adapter?.knobs
              .filter((k) => k.id.startsWith(prefix))
              .map((knob) => renderKnob(knob))}
          </div>
        </div>
        <div className={styles.readout}>
          <div className={styles.readout__value}>{bezierString}</div>
          <button
            className={styles.readout__copy}
            type="button"
            onClick={() => handleCopyEasing(prefix, bezierString)}
          >
            {copiedEasing === prefix ? "Copied!" : "Copy"}
          </button>
        </div>
      </Section>
    );
  };

  const groupedKnobs: Record<string, MotionKnob[]> = {};
  adapter?.knobs.forEach((knob) => {
    // Group easing knobs separately
    if (knob.id.includes("_x1") || knob.id.includes("_y1") || knob.id.includes("_x2") || knob.id.includes("_y2")) {
      return;
    }
    
    // Group by category (extract from ID, e.g., "hover_lift" → "hover")
    const category = knob.id.split("_")[0] ?? "general";
    if (!groupedKnobs[category]) {
      groupedKnobs[category] = [];
    }
    groupedKnobs[category].push(knob);
  });

  if (!adapter) {
    return <div className={styles.empty}>No adapters available</div>;
  }

  const generatedCss = adapter.generateCss(values);

  return (
    <div className={styles.motionLab}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{adapter.displayName}</h1>
          <p className={styles.subtitle}>
            Interactive motion tuning with live preview
          </p>
        </div>
      </div>

      <div className={styles.previewSticky}>
        {adapter.renderPreview(values)}
      </div>

      <div className={styles.controls}>
        <Section title="Presets">
          <Select
            label="Preset"
            value={presetName}
            onChange={setPresetName}
            options={adapter.presets.map((p) => p.name)}
          />
          <button
            className={styles.readout__copy}
            type="button"
            onClick={() => applyPreset(presetName)}
          >
            Reset to preset
          </button>
          <div className={styles.hint}>Pick a preset, then tweak knobs. Use Ctrl+1, Ctrl+2, etc. to switch presets.</div>
        </Section>

        {Object.entries(groupedKnobs).map(([category, knobs]) => (
          <Section key={category} title={category.charAt(0).toUpperCase() + category.slice(1)}>
            {knobs.map((knob) => renderKnob(knob))}
          </Section>
        ))}

        {/* Render easing sections if they exist */}
        {values["press_x1"] !== undefined && renderEasingSection("Press Easing", "press")}
        {values["release_x1"] !== undefined && renderEasingSection("Release Easing", "release")}
        {values["enter_x1"] !== undefined && renderEasingSection("Enter Easing", "enter")}
        {values["exit_x1"] !== undefined && renderEasingSection("Exit Easing", "exit")}

        <Section title="Generated CSS">
          <GeneratedCss cssText={generatedCss} />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.section__title}>{title}</div>
      <div className={styles.section__body}>{children}</div>
    </div>
  );
}
