import * as React from "react";
import styles from "./Select.module.css";

export interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <label className={styles.select}>
      <div className={styles.select__label}>{label}</div>
      <select
        className={styles.select__input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
