import * as React from "react";
import { getProgressState } from "../../../atoms/progress.js";
import "./progressText.css";

export interface ProgressTextProps {
  percentage: number;
  children: string;
  filledColor?: string;
  trackColor?: string;
}

/** Position inside an indicator's relative container, sharing its fill percentage. */
export function ProgressText({
  percentage,
  children,
  filledColor = "var(--background)",
  trackColor = "var(--foreground)",
}: ProgressTextProps) {
  const fill = getProgressState({ value: percentage }).percentage;
  return (
    <span className="nw-progress-text" aria-hidden="true">
      <span style={{ color: trackColor, clipPath: `inset(0 0 0 ${fill}%)` }}>{children}</span>
      <span style={{ color: filledColor, clipPath: `inset(0 ${100 - fill}% 0 0)` }}>{children}</span>
    </span>
  );
}
