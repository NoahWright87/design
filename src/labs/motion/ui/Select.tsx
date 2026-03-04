import * as React from "react";
import styles from "./Select.module.css";

export interface SelectGroup {
  label: string;
  options: readonly string[];
}

export interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  /** When provided, renders options grouped under <optgroup> labels instead of a flat list. */
  groups?: readonly SelectGroup[];
}

export function Select({ label, value, onChange, options, groups }: SelectProps) {
  return (
    <label className={styles.select}>
      <div className={styles.select__label}>{label}</div>
      <select
        className={styles.select__input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {groups && groups.length > 0
          ? groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
            ))
          : options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
      </select>
    </label>
  );
}
