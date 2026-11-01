import * as React from "react";
import { LinearProgress } from "../Progress/index.js";
import type { LinearProgressProps } from "../Progress/index.js";

export interface ProgressBarProps extends Omit<LinearProgressProps, "segments" | "gap"> {}

export function ProgressBar(props: ProgressBarProps) {
  return <LinearProgress {...props} />;
}

export default ProgressBar;
