"use client";
import * as React from "react";
import { getProgressColor, getProgressState } from "../../../atoms/progress.js";
import type { ProgressColorRange, ProgressOptions, ProgressState } from "../../../atoms/progress.js";
import { useProgressPulse } from "../../../atoms/useProgressPulse.js";
import { ProgressText } from "../ProgressText/index.js";
import "./progressBar.css";

export interface ProgressBarProps extends ProgressOptions {
  /** Accessible name, independent of the visible text. */
  label: string;
  /** Omit for a rounded percentage; false hides the visible text. */
  text?: string | false | ((progress: ProgressState) => string);
  rounded?: boolean;
  color?: string;
  textColor?: string;
  colorRanges?: readonly ProgressColorRange[];
  pulse?: boolean;
}

export function ProgressBar({
  value,
  min,
  max,
  label,
  text,
  rounded = false,
  color = "var(--primary)",
  textColor = "var(--background)",
  colorRanges,
  pulse = true,
}: ProgressBarProps) {
  const progress = getProgressState({ value, min, max });
  const colors = getProgressColor(progress.percentage, colorRanges, color, textColor);
  const display = typeof text === "function" ? text(progress) : text === undefined ? `${Math.round(progress.percentage)}%` : text;
  const ref = React.useRef<HTMLDivElement>(null);
  useProgressPulse(ref, progress, pulse);

  return (
    <div
      ref={ref}
      className={`nw-progress-bar${rounded ? " nw-progress-bar--rounded" : ""}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={progress.min}
      aria-valuemax={progress.max}
      aria-valuenow={progress.value}
      aria-valuetext={display === false ? undefined : display}
    >
      <span className="nw-progress-bar__fill" style={{ width: `${progress.percentage}%`, backgroundColor: colors.color }} />
      {display !== false && <ProgressText percentage={progress.percentage} filledColor={colors.textColor}>{display}</ProgressText>}
    </div>
  );
}

export default ProgressBar;
