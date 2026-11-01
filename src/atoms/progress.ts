export interface ProgressOptions { value: number; min?: number; max?: number; }
export interface ProgressState {
  value: number; min: number; max: number; percentage: number; isEmpty: boolean; isFull: boolean;
}
export interface ProgressColorRange {
  /** Inclusive upper percentage bound. Smallest matching bound wins. */
  upTo: number;
  color: string;
  textColor?: string;
}
export type ProgressTextValue = string | false | ((progress: ProgressState) => string);
export type ProgressShape = "BarHorizontal" | "BarVertical" | "Pie" | "Ring";
export interface ProgressSeries {
  id: string;
  label: string;
  /** Amount added after preceding series in this layer. */
  value: number;
  color?: string;
  colorRanges?: readonly ProgressColorRange[];
}
export interface ProgressLayer {
  id: string;
  label: string;
  max?: number;
  appearance?: "solid" | "hatched" | "outline";
  opacity?: number;
  outlineWidth?: number;
  series: readonly ProgressSeries[];
}
export interface ResolvedProgressSeries extends ProgressSeries {
  amount: number;
  start: number;
  end: number;
  resolvedColor: string;
}
export interface ResolvedProgressLayer extends Omit<ProgressLayer, "series"> {
  max: number;
  state: ProgressState;
  series: ResolvedProgressSeries[];
}
export function getProgressState({ value, min = 0, max = 100 }: ProgressOptions): ProgressState {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min || !Number.isFinite(max - min)) { min = 0; max = 100; }
  const clamped = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
  return { value: clamped, min, max, percentage: (clamped - min) / (max - min) * 100, isEmpty: clamped === min, isFull: clamped === max };
}
export function getProgressText(progress: ProgressState, text?: ProgressTextValue): string | false {
  return typeof text === "function" ? text(progress) : text === undefined ? `${Math.round(progress.percentage)}%` : text;
}
export function getProgressColor(percentage: number, ranges: readonly ProgressColorRange[] = [], fallback = "var(--primary)", textColor = "var(--background)") {
  let match: ProgressColorRange | undefined;
  for (const range of ranges) {
    if (!Number.isFinite(range.upTo) || range.upTo < 0 || range.upTo > 100) continue;
    if (percentage <= range.upTo && (!match || range.upTo < match.upTo)) match = range;
  }
  return { color: match?.color ?? fallback, textColor: match?.textColor ?? textColor };
}
/** One immutable stacking/color model for every shape. First duplicate ID wins. */
export function resolveProgressLayers(layers: readonly ProgressLayer[], max = 100, color = "var(--primary)", ranges: readonly ProgressColorRange[] = []): ResolvedProgressLayer[] {
  const seenLayers = new Set<string>();
  return layers.filter(layer => { if (seenLayers.has(layer.id)) return false; seenLayers.add(layer.id); return true; }).map(layer => {
    const capacity = Number.isFinite(layer.max ?? max) && (layer.max ?? max) > 0 ? (layer.max ?? max) : 100;
    let used = 0;
    const seen = new Set<string>();
    const series = layer.series.filter(series => { if (seen.has(series.id)) return false; seen.add(series.id); return true; }).map(series => {
      const amount = Number.isFinite(series.value) ? Math.min(Math.max(0, series.value), capacity - used) : 0;
      const start = used / capacity * 100;
      used += amount;
      return { ...series, amount, start, end: used / capacity * 100,
        resolvedColor: getProgressColor(amount / capacity * 100, series.colorRanges ?? ranges, series.color ?? color).color };
    });
    return { ...layer, max: capacity, series, state: getProgressState({ value: used, max: capacity }) };
  });
}
