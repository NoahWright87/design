import React from "react";
import { Progress, resolveProgressLayers } from "../../src";
import type { ProgressColorRange, ProgressLayer, ProgressProps, ProgressShape } from "../../src";
import "./progressShowcase.css";

const colors = ["danger", "warning", "confirm", "primary", "secondary", "foreground", "background"] as const;
type Color = typeof colors[number];
const token = (color: Color) => `var(--${color})`;
type SeriesEditor = { id: string; label: string; value: number; color: Color | "inherit"; ranged: boolean; enabled: boolean; ranges: { upTo: number; color: Color }[] };
type LayerEditor = { id: string; label: string; enabled: boolean; max: number; appearance: NonNullable<ProgressLayer["appearance"]>; opacity: number; outlineWidth: number; series: SeriesEditor[] };
const series = (id: string, label: string, value: number, color: Color, ranged = false): SeriesEditor => ({
  id, label, value, color, ranged, enabled: true,
  ranges: [{ upTo: 10, color: "danger" }, { upTo: 50, color: "warning" }, { upTo: 100, color }],
});
const initialLayers = (): LayerEditor[] => [
  { id: "health", label: "Health", enabled: true, max: 100, appearance: "solid", opacity: 1, outlineWidth: 3, series: [series("hp", "Safe health", 75, "danger"), series("poison", "Pending poison", 10, "confirm")] },
  { id: "shield", label: "Shield", enabled: true, max: 100, appearance: "hatched", opacity: 1, outlineWidth: 3, series: [series("shield", "Shield charge", 35, "primary", true), series("recharge", "Shield recharge", 15, "secondary")] },
  { id: "reserve", label: "Reserve", enabled: true, max: 100, appearance: "outline", opacity: 1, outlineWidth: 4, series: [series("reserve", "Reserve charge", 30, "secondary"), { ...series("bonus", "Bonus reserve", 25, "warning"), color: "inherit" }] },
];

function ColorSelect({ label, value, onChange }: { label: string; value: Color; onChange: (value: Color) => void }) {
  return <label>{label}<select value={value} onChange={event => onChange(event.target.value as Color)}>{colors.map(color => <option key={color}>{color}</option>)}</select></label>;
}
function NumberControl({ label, value, min = 0, max = 100, step = 1, onChange }: { label: string; value: number; min?: number; max?: number; step?: number; onChange: (value: number) => void }) {
  return <label>{label}<input type="number" value={value} min={min} max={max} step={step} onChange={event => {
    const next = event.currentTarget.valueAsNumber;
    if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next)));
  }} /></label>;
}

export function ProgressShowcase() {
  const [layers, setLayers] = React.useState(initialLayers);
  const [shape, setShape] = React.useState<ProgressShape>("BarHorizontal");
  const [label, setLabel] = React.useState("Player status");
  const [position, setPosition] = React.useState<ProgressProps["labelPosition"]>("bottom");
  const [textMode, setTextMode] = React.useState("automatic");
  const [customText, setCustomText] = React.useState("Ready for battle");
  const [segments, setSegments] = React.useState(0);
  const [gap, setGap] = React.useState(3);
  const [size, setSize] = React.useState(260);
  const [thickness, setThickness] = React.useState(24);
  const [layerGap, setLayerGap] = React.useState(4);
  const [rounded, setRounded] = React.useState(false);
  const [pulse, setPulse] = React.useState(true);
  const [fallback, setFallback] = React.useState<Color>("primary");
  const updateLayer = (id: string, update: Partial<LayerEditor>) => setLayers(previous => previous.map(layer => layer.id === id ? { ...layer, ...update } : layer));
  const updateSeries = (layerId: string, id: string, update: Partial<SeriesEditor>) => setLayers(previous => previous.map(layer => layer.id === layerId ? { ...layer, series: layer.series.map(series => series.id === id ? { ...series, ...update } : series) } : layer));
  const data: ProgressLayer[] = layers.filter(layer => layer.enabled).map(layer => ({
    id: layer.id, label: layer.label, max: layer.max, appearance: layer.appearance, opacity: layer.opacity, outlineWidth: layer.outlineWidth,
    series: layer.series.filter(series => series.enabled).map(series => ({ id: series.id, label: series.label, value: series.value, color: series.color === "inherit" ? undefined : token(series.color),
      colorRanges: series.ranged ? series.ranges.map(range => ({ upTo: range.upTo, color: token(range.color) })) as ProgressColorRange[] : [],
    })),
  }));
  const resolved = resolveProgressLayers(data, 100, token(fallback));
  const fillLayers = () => setLayers(previous => previous.map(layer => {
    const first = layer.series.find(series => series.enabled)?.id;
    return { ...layer, series: layer.series.map(series => ({ ...series, value: series.id === first ? layer.max : 0 })) };
  }));
  const reset = () => {
    setLayers(initialLayers()); setShape("BarHorizontal"); setLabel("Player status"); setPosition("bottom");
    setTextMode("automatic"); setCustomText("Ready for battle"); setSegments(0); setGap(3); setSize(260); setThickness(24); setLayerGap(4); setRounded(false); setPulse(true); setFallback("primary");
  };
  return <div className="progress-showcase">
    <header><h1>Progress showcase</h1><p>Three layers, six series, one control. Change any value below; switch shapes to see the same data overlap as bars or form concentric radial regions.</p><button onClick={reset}>Reset showcase</button></header>
    <section className="progress-showcase-preview" aria-label="Live progress preview">
      <Progress label={label} shape={shape} layers={data} color={token(fallback)} labelPosition={position}
        text={textMode === "custom" ? customText : textMode === "hidden" ? false : undefined}
        segments={segments} gap={gap} size={size} thickness={thickness} layerGap={layerGap} rounded={rounded} pulse={pulse} />
      {resolved.length === 0 && <p>All layers are disabled. Enable a layer below to restore its data.</p>}
    </section>
    <section aria-label="Resolved series legend"><h2>What you’re seeing</h2>
      <p>Initially, safe health fills 0–75%, pending poison fills 75–85%, and 85–100% remains empty. Shield charge starts in the yellow range; move it through 10% and 50% to see its color change.</p>
      <div className="progress-showcase-legend">{resolved.map(layer => <div key={layer.id}><strong>{layer.label}: {layer.state.value}/{layer.max}</strong>
        <ul>{layer.series.map(series => <li key={series.id}><span className="progress-showcase-swatch" style={{ background: series.resolvedColor }} />{series.label}: {series.amount} ({Math.round(series.start * 10) / 10}–{Math.round(series.end * 10) / 10}%)</li>)}</ul>
      </div>)}</div>
      <p>Later series clip to the remaining capacity. Range colors use each series’ effective amount divided by its layer capacity. The first enabled layer controls the default percentage and full/empty pulse.</p>
    </section>
    <fieldset><legend>Presentation and label</legend><div className="progress-showcase-controls">
      <label>Shape<select value={shape} onChange={event => setShape(event.target.value as ProgressShape)}>{["BarHorizontal", "BarVertical", "Pie", "Ring"].map(shape => <option key={shape}>{shape}</option>)}</select></label>
      <label>Label<input value={label} onChange={event => setLabel(event.target.value)} /></label>
      <label>Label position<select value={position} onChange={event => setPosition(event.target.value as ProgressProps["labelPosition"])}>{["center", "top", "bottom", "left", "right", "none"].map(position => <option key={position}>{position}</option>)}</select></label>
      <label>Visible text<select value={textMode} onChange={event => setTextMode(event.target.value)}><option value="automatic">Label + percentage</option><option value="custom">Custom text</option><option value="hidden">Hidden</option></select></label>
      {textMode === "custom" && <label>Custom text<input value={customText} onChange={event => setCustomText(event.target.value)} /></label>}
      <ColorSelect label="Fallback color" value={fallback} onChange={setFallback} />
      <NumberControl label="Segments (0 = continuous)" value={segments} max={100} onChange={setSegments} />
      <NumberControl label={shape === "Pie" || shape === "Ring" ? "Segment gap (degrees)" : "Segment gap (px)"} value={gap} max={30} onChange={setGap} />
      <NumberControl label="Radial diameter" value={size} min={80} max={480} onChange={setSize} />
      <NumberControl label="Radial band width" value={thickness} min={1} max={100} onChange={setThickness} />
      <NumberControl label="Radial layer gap" value={layerGap} max={30} onChange={setLayerGap} />
      <label><input type="checkbox" checked={rounded} onChange={event => setRounded(event.target.checked)} /> Rounded bars</label>
      <label><input type="checkbox" checked={pulse} onChange={event => setPulse(event.target.checked)} /> Endpoint pulse</label>
    </div></fieldset>
    {layers.map(layer => <fieldset key={layer.id}><legend>{layer.label} layer</legend><div className="progress-showcase-controls">
      <label><input type="checkbox" checked={layer.enabled} onChange={event => updateLayer(layer.id, { enabled: event.target.checked })} /> Enable {layer.label}</label>
      <label>{layer.label} appearance<select value={layer.appearance} onChange={event => updateLayer(layer.id, { appearance: event.target.value as LayerEditor["appearance"] })}>{["solid", "hatched", "outline"].map(appearance => <option key={appearance}>{appearance}</option>)}</select></label>
      <NumberControl label={`${layer.label} capacity`} value={layer.max} min={1} max={500} onChange={max => updateLayer(layer.id, { max })} />
      <NumberControl label={`${layer.label} opacity`} value={layer.opacity} max={1} step={0.05} onChange={opacity => updateLayer(layer.id, { opacity })} />
      <NumberControl label={`${layer.label} outline width`} value={layer.outlineWidth} min={1} max={20} onChange={outlineWidth => updateLayer(layer.id, { outlineWidth })} />
    </div><div className="progress-showcase-series">{layer.series.map(series => <fieldset key={series.id}><legend>{series.label}</legend>
      <label><input type="checkbox" checked={series.enabled} onChange={event => updateSeries(layer.id, series.id, { enabled: event.target.checked })} /> Enable {series.label}</label>
      <label>{series.label} value<input type="range" min={0} max={layer.max} value={Math.min(series.value, layer.max)} onChange={event => updateSeries(layer.id, series.id, { value: Number(event.target.value) })} /></label>
      <NumberControl label={`${series.label} amount`} value={series.value} max={500} onChange={value => updateSeries(layer.id, series.id, { value })} />
      <label>{series.label} fixed/fallback color<select value={series.color} onChange={event => updateSeries(layer.id, series.id, { color: event.target.value as SeriesEditor["color"] })}>{["inherit", ...colors].map(color => <option key={color}>{color}</option>)}</select></label>
      <label><input type="checkbox" checked={series.ranged} onChange={event => updateSeries(layer.id, series.id, { ranged: event.target.checked })} /> Value-based colors for {series.label}</label>
      {series.ranged && <div className="progress-showcase-ranges">{series.ranges.map((range, index) => <div key={index}>
        <NumberControl label={`${series.label} range ${index + 1} upper %`} value={range.upTo} onChange={upTo => updateSeries(layer.id, series.id, { ranges: series.ranges.map((range, position) => position === index ? { ...range, upTo } : range) })} />
        <ColorSelect label={`${series.label} range ${index + 1} color`} value={range.color} onChange={color => updateSeries(layer.id, series.id, { ranges: series.ranges.map((range, position) => position === index ? { ...range, color } : range) })} />
      </div>)}</div>}
    </fieldset>)}</div></fieldset>)}
    <div className="progress-showcase-actions"><button onClick={() => setLayers(previous => previous.map(layer => ({ ...layer, series: layer.series.map(series => ({ ...series, value: 0 })) })))}>Empty all series</button>
      <button onClick={fillLayers}>Fill each layer</button></div>
  </div>;
}
