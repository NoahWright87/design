import * as React from "react";
import styles from "./Toggle.module.css";

export interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ label, value, onChange, disabled }: ToggleProps) {
  return (
    <label className={`${styles.toggle} ${disabled ? styles["toggle--disabled"] : ""}`.trim()}>
      <div className={styles.toggle__label}>{label}</div>
      <button
        type="button"
        className={`${styles.toggle__btn} ${value ? styles["toggle--on"] : ""}`.trim()}
        onClick={() => !disabled && onChange(!value)}
        aria-pressed={value}
        disabled={disabled}
      >
        <span className={styles.toggle__knob} />
      </button>
    </label>
  );
}
