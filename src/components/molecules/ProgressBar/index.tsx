"use client";
import * as React from "react";
import { getProgressColor, getProgressState, getProgressText } from "../../../atoms/progress.js";
import type { ProgressIndicatorProps } from "../../../atoms/progress.js";
import { useProgressPulse } from "../../../atoms/useProgressPulse.js";
import { ProgressText } from "../ProgressText/index.js";
import "./progressBar.css";

export interface ProgressBarProps extends ProgressIndicatorProps {
  rounded?: boolean;
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
  const display = getProgressText(progress, text);
  const ref = React.useRef<HTMLDivElement>(null);
  const fillRef = React.useRef<HTMLSpanElement>(null);
  useProgressPulse(ref, progress, pulse, fillRef);

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
      <span ref={fillRef} className="nw-progress-bar__fill" style={{ width: `${progress.percentage}%`, backgroundColor: colors.color }} />
      {display !== false && <ProgressText percentage={progress.percentage} filledColor={colors.textColor}>{display}</ProgressText>}
    </div>
  );
}

export default ProgressBar;
