import * as React from "react";
import styles from "./Range.module.css";

export interface RangeProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export function Range({ label, min, max, step, value, onChange }: RangeProps) {
  return (
    <label className={styles.range}>
      <div className={styles.range__top}>
        <span>{label}</span>
        <span className={styles.range__value}>{String(value)}</span>
      </div>
      <input
        type="range"
        className={styles.range__input}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
