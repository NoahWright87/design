import * as React from "react";
import { LinearProgress } from "../Progress/index.js";
import type { LinearProgressProps } from "../Progress/index.js";

export interface ProgressSegmentedBarProps extends LinearProgressProps {}

export function ProgressSegmentedBar({ segments = 10, ...props }: ProgressSegmentedBarProps) {
  return <LinearProgress {...props} segments={segments} />;
}

export default ProgressSegmentedBar;
