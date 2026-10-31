export interface ProgressOptions {
  value: number;
  min?: number;
  max?: number;
}

export interface ProgressState {
  value: number;
  min: number;
  max: number;
  percentage: number;
  isEmpty: boolean;
  isFull: boolean;
}

export interface ProgressColorRange {
  /** Inclusive upper bound, expressed as a percentage from 0 to 100. */
  upTo: number;
  color: string;
  /** Text on the filled portion; useful for light custom colors. */
  textColor?: string;
}

export type ProgressTextValue = string | false | ((progress: ProgressState) => string);

/** Common contract for canonical indicator shapes. */
export interface ProgressIndicatorProps extends ProgressOptions {
  label: string;
  text?: ProgressTextValue;
  color?: string;
  textColor?: string;
  colorRanges?: readonly ProgressColorRange[];
  pulse?: boolean;
}

export function getProgressText(progress: ProgressState, text?: ProgressTextValue): string | false {
  return typeof text === "function" ? text(progress) : text === undefined ? `${Math.round(progress.percentage)}%` : text;
}

/** Shared by all indicator shapes; callers own timers, scoring, and scroll sources. */
export function getProgressState({ value, min = 0, max = 100 }: ProgressOptions): ProgressState {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min || !Number.isFinite(max - min)) {
    min = 0;
    max = 100;
  }
  const clamped = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
  const percentage = ((clamped - min) / (max - min)) * 100;
  return { value: clamped, min, max, percentage, isEmpty: clamped === min, isFull: clamped === max };
}

/** The smallest matching upper bound wins; input order and arrays are preserved. */
export function getProgressColor(
  percentage: number,
  ranges: readonly ProgressColorRange[] = [],
  fallback: string = "var(--primary)",
  textColor: string = "var(--background)"
): { color: string; textColor: string } {
  let match: ProgressColorRange | undefined;
  for (const range of ranges) {
    if (!Number.isFinite(range.upTo) || range.upTo < 0 || range.upTo > 100) continue;
    if (percentage <= range.upTo && (!match || range.upTo < match.upTo)) match = range;
  }
  return { color: match?.color ?? fallback, textColor: match?.textColor ?? textColor };
}
