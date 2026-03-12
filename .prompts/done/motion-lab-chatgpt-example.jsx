import React from "react";

/**
 * BouncyButton (pure CSS version)
 * - No layout shift (transform-only interactions)
 * - Separate press vs release easing (two cubic-beziers)
 * - Release overshoot is done via the RELEASE cubic-bezier (y > 1) — no keyframes needed
 */
export const BouncyButton = React.forwardRef(function BouncyButton(
  {
    children,
    variant = "primary", // "primary" | "secondary" | "ghost"
    size = "md", // "sm" | "md" | "lg"
    press = "squish", // "shrink" | "squish"
    anchor = "top", // "center" | "top" | "bottom" | "left" | "right"
    loading = false,
    lockWhileLoading = false,
    disabled,
    className = "",
    style,
    ...props
  },
  ref
) {
  const isDisabled = Boolean(disabled || (lockWhileLoading && loading));

  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      data-variant={variant}
      data-size={size}
      data-press={press}
      data-anchor={anchor}
      aria-busy={loading ? "true" : undefined}
      className={`nw-btn ${className}`.trim()}
      style={style}
      {...props}
    >
      <span className="nw-btn__content" aria-hidden={loading ? "true" : undefined}>
        {children}
      </span>

      {loading && (
        <span className="nw-btn__overlay" aria-label="Loading">
          <span className="nw-btn__spinner" aria-hidden="true" />
        </span>
      )}
    </button>
  );
});

export default function Demo() {
  const [variant, setVariant] = React.useState("primary");
  const [press, setPress] = React.useState("squish");
  const [size, setSize] = React.useState("md");
  const [anchor, setAnchor] = React.useState("top");

  // Motion knobs
  const [hoverLift, setHoverLift] = React.useState(-3); // px
  const [hoverScale, setHoverScale] = React.useState(1.09);

  const [pressScale, setPressScale] = React.useState(0.88); // for shrink
  const [squishX, setSquishX] = React.useState(1.25);
  const [squishY, setSquishY] = React.useState(0.75);

  const [pressMs, setPressMs] = React.useState(120);
  const [releaseMs, setReleaseMs] = React.useState(520);

  // Separate easing: press should feel smooth; release can overshoot.
  // Keep x1/x2 in [0..1]. y can go <0 or >1 for under/over-shoot.
  const [px1, setPx1] = React.useState(0.2);
  const [py1, setPy1] = React.useState(0.9);
  const [px2, setPx2] = React.useState(0.2);
  const [py2, setPy2] = React.useState(1.0);

  const [rx1, setRx1] = React.useState(0.28);
  const [ry1, setRy1] = React.useState(1.8);
  const [rx2, setRx2] = React.useState(0.55);
  const [ry2, setRy2] = React.useState(1.0);

  const [showReleaseOvershoot, setShowReleaseOvershoot] = React.useState(true);

  // Loading simulation
  const [simulateLoading, setSimulateLoading] = React.useState(false);
  const [lockWhileLoading, setLockWhileLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Presets (sets ALL knobs en masse, including both press+release curves)
  const presets = React.useMemo(
    () =>
      ({
        "No motion": {
          hoverLift: 0,
          hoverScale: 1,
          pressScale: 1,
          squishX: 1,
          squishY: 1,
          pressMs: 0,
          releaseMs: 0,
          pressEase: [0.2, 1, 0.2, 1],
          releaseEase: [0.2, 1, 0.2, 1],
          showReleaseOvershoot: false,
        },
        "Smooth press + smooth release": {
          hoverLift: -1,
          hoverScale: 1.03,
          pressScale: 0.97,
          squishX: 1.08,
          squishY: 0.92,
          pressMs: 110,
          releaseMs: 180,
          pressEase: [0.2, 0.85, 0.2, 1],
          releaseEase: [0.2, 1, 0.2, 1],
          showReleaseOvershoot: false,
        },
        "Smooth press + snap release (your thing)": {
          hoverLift: -2,
          hoverScale: 1.06,
          pressScale: 0.92,
          squishX: 1.25,
          squishY: 0.75,
          pressMs: 140,
          releaseMs: 520,
          pressEase: [0.2, 0.9, 0.2, 1],
          // y1>1 creates overshoot; from {1.25,0.75} -> {1,1} this yields {<1,>1} mid-flight.
          releaseEase: [0.28, 1.8, 0.55, 1],
          showReleaseOvershoot: true,
        },
        "Subtle bounce": {
          hoverLift: -2,
          hoverScale: 1.05,
          pressScale: 0.94,
          squishX: 1.14,
          squishY: 0.84,
          pressMs: 120,
          releaseMs: 320,
          pressEase: [0.2, 0.9, 0.2, 1],
          releaseEase: [0.34, 1.35, 0.64, 1],
          showReleaseOvershoot: true,
        },
        "Extreme bounce": {
          hoverLift: -4,
          hoverScale: 1.12,
          pressScale: 0.86,
          squishX: 1.32,
          squishY: 0.68,
          pressMs: 150,
          releaseMs: 700,
          pressEase: [0.18, 0.92, 0.2, 1],
          releaseEase: [0.22, 2.2, 0.6, 1],
          showReleaseOvershoot: true,
        },
      }),
    []
  );

  const [presetName, setPresetName] = React.useState("Smooth press + snap release (your thing)");

  React.useEffect(() => {
    const p = presets[presetName];
    if (!p) return;

    setHoverLift(p.hoverLift);
    setHoverScale(p.hoverScale);
    setPressScale(p.pressScale);
    setSquishX(p.squishX);
    setSquishY(p.squishY);
    setPressMs(p.pressMs);
    setReleaseMs(p.releaseMs);

    const [a, b, c, d] = p.pressEase;
    setPx1(a);
    setPy1(b);
    setPx2(c);
    setPy2(d);

    const [e, f, g, h] = p.releaseEase;
    setRx1(e);
    setRy1(f);
    setRx2(g);
    setRy2(h);

    setShowReleaseOvershoot(p.showReleaseOvershoot);
  }, [presetName, presets]);

  const pressEase = `cubic-bezier(${px1}, ${py1}, ${px2}, ${py2})`;
  const releaseEase = `cubic-bezier(${rx1}, ${ry1}, ${rx2}, ${ry2})`;

  // If overshoot toggle is off, clamp release to a sane curve.
  const effectiveReleaseEase = showReleaseOvershoot ? releaseEase : "cubic-bezier(0.2, 1, 0.2, 1)";

  const buttonStyle = {
    "--hover-lift": `${hoverLift}px`,
    "--hover-scale": String(hoverScale),
    "--press-scale": String(pressScale),
    "--squish-x": String(squishX),
    "--squish-y": String(squishY),
    "--t-press": `${pressMs}ms`,
    "--t-release": `${releaseMs}ms`,
    "--ease-press": pressEase,
    "--ease-release": effectiveReleaseEase,
  };

  const generatedCss = React.useMemo(() => {
    const originMap = {
      center: "50% 50%",
      top: "50% 0%",
      bottom: "50% 100%",
      left: "0% 50%",
      right: "100% 50%",
    };

    const origin = originMap[anchor] ?? originMap.center;

    // NOTE: This intentionally emits a *portable* snippet for your design system,
    // not the entire playground page styling.
    const base = `/* Generated from the button playground */

.nw-btn {
  appearance: none;
  border: 0;
  cursor: pointer;
  user-select: none;

  position: relative;
  display: inline-grid;
  place-items: center;

  border-radius: 14px;
  padding: 0 18px;
  height: 44px;

  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.01em;

  /* TODO: wire these into your tokens */
  color: var(--btn-fg, #07111f);
  background: var(--btn-bg, #38bdf8);
  box-shadow: var(--btn-shadow, 0 10px 30px rgba(0, 0, 0, 0.35));

  transform: translateZ(0);
  will-change: transform;

  transform-origin: ${origin};

  transition-property: transform, background, filter, box-shadow;
  transition-duration: ${releaseMs}ms, 140ms, 140ms, 140ms;
  transition-timing-function: ${effectiveReleaseEase}, ease, ease, ease;

  -webkit-tap-highlight-color: transparent;
}

.nw-btn:hover:not(:disabled) {
  background: var(--btn-bg-hover, #7dd3fc);
  transform: translateY(${hoverLift}px) scale(${hoverScale});
}

.nw-btn:focus-visible {
  outline: none;
  box-shadow:
    var(--btn-shadow, 0 10px 30px rgba(0, 0, 0, 0.35)),
    0 0 0 2px rgba(11, 18, 32, 0.9),
    0 0 0 5px var(--btn-ring, rgba(125, 211, 252, 0.6));
}

/* Press uses its OWN duration + easing */
.nw-btn:active:not(:disabled) {
  transition-duration: ${pressMs}ms, 140ms, 140ms, 140ms;
  transition-timing-function: ${pressEase}, ease, ease, ease;
}
`;

    const pressRule =
      press === "shrink"
        ? `.nw-btn:active:not(:disabled) { transform: translateY(0px) scale(${pressScale}); }
`
        : `.nw-btn:active:not(:disabled) { transform: translateY(0px) scaleX(${squishX}) scaleY(${squishY}); filter: saturate(0.98); }
`;

    const sizes = `
.nw-btn[data-size="sm"] { height: 38px; padding: 0 14px; font-size: 13px; }
.nw-btn[data-size="md"] { height: 44px; padding: 0 18px; font-size: 15px; }
.nw-btn[data-size="lg"] { height: 52px; padding: 0 22px; font-size: 16px; }
`;

    const content = `
.nw-btn__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  padding: 0 2px;
}

.nw-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  filter: grayscale(0.2);
}

@media (prefers-reduced-motion: reduce) {
  .nw-btn { transition: none; }
}
`;

    return `${base}${pressRule}${sizes}${content}`.trim();
  }, [
    anchor,
    press,
    pressMs,
    releaseMs,
    hoverLift,
    hoverScale,
    pressScale,
    squishX,
    squishY,
    pressEase,
    effectiveReleaseEase,
  ]);


  return (
    <div className="page">
      <style>{css}</style>

      <div className="card">
        <div className="header">
          <div>
            <h1>Button animation playground</h1>
            <p>
              Separate curves for press vs release. Release curve can overshoot so you get:
              <span className="mono"> 1.25/0.75 → 0.9/1.1 → 1/1</span> (ish).
            </p>
          </div>
          <div className="pill">Pure CSS easing</div>
        </div>

        <div className="preview">
          <BouncyButton
            variant={variant}
            press={press}
            size={size}
            anchor={anchor}
            loading={loading}
            lockWhileLoading={lockWhileLoading}
            style={buttonStyle}
            onClick={() => {
              if (!simulateLoading) return;
              setLoading(true);
              window.setTimeout(() => setLoading(false), 450);
            }}
          >
            Click me
          </BouncyButton>
        </div>

        <div className="controls">
          <Section title="Presets">
            <Select label="Preset" value={presetName} onChange={setPresetName} options={Object.keys(presets)} />
            <div className="hint mono">Pick one, then tweak.</div>
          </Section>

          <Section title="Mode">
            <Select label="Variant" value={variant} onChange={setVariant} options={["primary", "secondary", "ghost"]} />
            <Select label="Press" value={press} onChange={setPress} options={["shrink", "squish"]} />
            <Select label="Size" value={size} onChange={setSize} options={["sm", "md", "lg"]} />
            <Select label="Squish anchor" value={anchor} onChange={setAnchor} options={["center", "top", "bottom", "left", "right"]} />
          </Section>

          <Section title="Hover">
            <Range label="Lift (px)" min={-16} max={0} step={1} value={hoverLift} onChange={setHoverLift} />
            <Range label="Scale" min={1.0} max={1.30} step={0.01} value={hoverScale} onChange={setHoverScale} />
          </Section>

          <Section title="Press">
            <Range label="Shrink scale" min={0.60} max={1.0} step={0.01} value={pressScale} onChange={setPressScale} />
            <Range label="Squish X" min={0.75} max={1.55} step={0.01} value={squishX} onChange={setSquishX} />
            <Range label="Squish Y" min={0.45} max={1.25} step={0.01} value={squishY} onChange={setSquishY} />
          </Section>

          <Section title="Timing">
            <Range label="Press-in (ms)" min={0} max={600} step={10} value={pressMs} onChange={setPressMs} />
            <Range label="Release (ms)" min={0} max={2000} step={20} value={releaseMs} onChange={setReleaseMs} />
          </Section>

          <Section title="Press easing (cubic-bezier)">
            <div className="easingGrid">
              <div className="easingGraphWrap">
                <EasingGraph x1={px1} y1={py1} x2={px2} y2={py2} />
              </div>
              <div className="bezier">
                <Range label="x1" min={0} max={1} step={0.01} value={px1} onChange={setPx1} />
                <Range label="y1" min={-2} max={3} step={0.01} value={py1} onChange={setPy1} />
                <Range label="x2" min={0} max={1} step={0.01} value={px2} onChange={setPx2} />
                <Range label="y2" min={-2} max={3} step={0.01} value={py2} onChange={setPy2} />
              </div>
            </div>
            <div className="readout">
              <div className="mono">{pressEase}</div>
              <button className="copy" type="button" onClick={() => navigator.clipboard?.writeText(pressEase)}>
                Copy
              </button>
            </div>
          </Section>

          <Section title="Release easing (cubic-bezier)">
            <Toggle label="Enable overshoot on release" value={showReleaseOvershoot} onChange={setShowReleaseOvershoot} />
            <div className="easingGrid">
              <div className="easingGraphWrap">
                <EasingGraph x1={rx1} y1={ry1} x2={rx2} y2={ry2} />
              </div>
              <div className="bezier">
                <Range label="x1" min={0} max={1} step={0.01} value={rx1} onChange={setRx1} />
                <Range label="y1" min={-2} max={3} step={0.01} value={ry1} onChange={setRy1} />
                <Range label="x2" min={0} max={1} step={0.01} value={rx2} onChange={setRx2} />
                <Range label="y2" min={-2} max={3} step={0.01} value={ry2} onChange={setRy2} />
              </div>
            </div>
            <div className="readout">
              <div className="mono">{effectiveReleaseEase}</div>
              <button className="copy" type="button" onClick={() => navigator.clipboard?.writeText(effectiveReleaseEase)}>
                Copy
              </button>
            </div>
            <div className="hint">
              Overshoot happens because <span className="mono">y</span> goes above 1. From {"{1.25,0.75}"} → {"{1,1}"}, that means X dips below 1 while Y pops above 1.
            </div>
          </Section>

          <Section title="Loading (optional)">$1</Section>

          <Section title="Generated CSS">
            <GeneratedCss cssText={generatedCss} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="section">
      <div className="section__title">{title}</div>
      <div className="section__body">{children}</div>
    </div>
  );
}

function Range({ label, min, max, step, value, onChange }) {
  return (
    <label className="control">
      <div className="control__top">
        <span>{label}</span>
        <span className="mono">{String(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="control">
      <div className="control__top">
        <span>{label}</span>
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, value, onChange, disabled }) {
  return (
    <label className={`toggle ${disabled ? "toggle--disabled" : ""}`.trim()}>
      <div className="toggle__label">{label}</div>
      <button
        type="button"
        className={`toggle__btn ${value ? "is-on" : ""}`.trim()}
        onClick={() => !disabled && onChange(!value)}
        aria-pressed={value}
        disabled={disabled}
      >
        <span className="toggle__knob" />
      </button>
    </label>
  );
}

function GeneratedCss({ cssText }) {
  return (
    <div className="gen">
      <div className="gen__top">
        <div className="hint">This is the portable CSS snippet based on your current settings.</div>
        <button className="copy" type="button" onClick={() => navigator.clipboard?.writeText(cssText)}>
          Copy
        </button>
      </div>
      <textarea className="gen__box" value={cssText} readOnly rows={16} spellCheck={false} />
    </div>
  );
}

function EasingGraph({ x1, y1, x2, y2 }) {
  // SVG coordinates: x in [0..1], y in [-1..2] (inverted for screen)
  const W = 280;
  const H = 200;
  const xMin = 0;
  const xMax = 1;
  const yMin = -1;
  const yMax = 2;

  const sx = (x) => ((x - xMin) / (xMax - xMin)) * W;
  const sy = (y) => H - ((y - yMin) / (yMax - yMin)) * H;

  const p0 = { x: 0, y: 0 };
  const p1 = { x: x1, y: y1 };
  const p2 = { x: x2, y: y2 };
  const p3 = { x: 1, y: 1 };

  const path = `M ${sx(p0.x)} ${sy(p0.y)} C ${sx(p1.x)} ${sy(p1.y)} ${sx(p2.x)} ${sy(p2.y)} ${sx(p3.x)} ${sy(p3.y)}`;

  const y0 = sy(0);
  const y1line = sy(1);

  const samples = 40;
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = cubic(p0.x, p1.x, p2.x, p3.x, t);
    const y = cubic(p0.y, p1.y, p2.y, p3.y, t);
    pts.push({ x: sx(x), y: sy(y) });
  }

  return (
    <div className="easingGraph" aria-label="Easing curve graph">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img">
        <rect x="0" y="0" width={W} height={H} rx="14" ry="14" className="eg__bg" />
        <line x1="0" y1={y0} x2={W} y2={y0} className="eg__grid" />
        <line x1="0" y1={y1line} x2={W} y2={y1line} className="eg__grid" />

        <line x1={sx(p0.x)} y1={sy(p0.y)} x2={sx(p1.x)} y2={sy(p1.y)} className="eg__handle" />
        <line x1={sx(p3.x)} y1={sy(p3.y)} x2={sx(p2.x)} y2={sy(p2.y)} className="eg__handle" />

        <path d={path} className="eg__curve" />

        {pts.map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r={idx % 4 === 0 ? 2.2 : 1.4} className="eg__dot" />
        ))}

        <circle cx={sx(p0.x)} cy={sy(p0.y)} r="4" className="eg__p" />
        <circle cx={sx(p3.x)} cy={sy(p3.y)} r="4" className="eg__p" />
        <circle cx={sx(p1.x)} cy={sy(p1.y)} r="4" className="eg__cp" />
        <circle cx={sx(p2.x)} cy={sy(p2.y)} r="4" className="eg__cp" />

        <text x="10" y={y0 - 6} className="eg__label">
          y=0
        </text>
        <text x="10" y={y1line - 6} className="eg__label">
          y=1
        </text>
      </svg>
    </div>
  );
}

function cubic(a, b, c, d, t) {
  const mt = 1 - t;
  return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
}

const css = `
:root { color-scheme: dark; }

.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background: #0b1220;
  color: #e7edf7;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
    "Apple Color Emoji", "Segoe UI Emoji";
}

.card {
  width: min(920px, 100%);
  border-radius: 22px;
  padding: 22px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

h1 {
  margin: 0 0 6px;
  font-size: 18px;
  letter-spacing: -0.02em;
}

p {
  margin: 0;
  color: rgba(231, 237, 247, 0.78);
  line-height: 1.4;
}

.pill {
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.10);
  border: 1px solid rgba(148, 163, 184, 0.18);
  color: rgba(231, 237, 247, 0.78);
  white-space: nowrap;
}

.preview {
  display: grid;
  place-items: center;
  padding: 26px 16px;
  border-radius: 18px;
  background: rgba(2, 6, 23, 0.60);
  border: 1px solid rgba(148, 163, 184, 0.14);
  margin-bottom: 16px;
}

.controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 760px) {
  .controls { grid-template-columns: 1fr; }
}

.section {
  border-radius: 18px;
  background: rgba(2, 6, 23, 0.46);
  border: 1px solid rgba(148, 163, 184, 0.14);
  padding: 14px;
}

.section__title {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(231, 237, 247, 0.70);
  margin-bottom: 10px;
}

.section__body {
  display: grid;
  gap: 10px;
}

.control {
  display: grid;
  gap: 8px;
}

.control__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: rgba(231, 237, 247, 0.86);
  font-size: 13px;
}

input[type="range"] { width: 100%; }

select {
  width: 100%;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.72);
  color: rgba(231, 237, 247, 0.92);
  padding: 0 12px;
  outline: none;
}

select:focus-visible {
  box-shadow: 0 0 0 2px rgba(11, 18, 32, 0.9), 0 0 0 5px rgba(125, 211, 252, 0.35);
}

.hint { color: rgba(231, 237, 247, 0.58); font-size: 12px; }

.bezier { display: grid; gap: 10px; }

.easingGrid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 12px;
  align-items: start;
}

@media (max-width: 860px) {
  .easingGrid { grid-template-columns: 1fr; }
}

.easingGraphWrap {
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.16);
  padding: 10px;
}

.easingGraph {
  width: 100%;
  height: 210px;
}

.eg__bg { fill: rgba(2, 6, 23, 0.55); }
.eg__grid { stroke: rgba(148, 163, 184, 0.18); stroke-width: 1; }
.eg__handle { stroke: rgba(148, 163, 184, 0.35); stroke-width: 1; stroke-dasharray: 3 3; }
.eg__curve { fill: none; stroke: rgba(125, 211, 252, 0.95); stroke-width: 2.5; }
.eg__dot { fill: rgba(231, 237, 247, 0.55); opacity: 0.55; }
.eg__p { fill: rgba(231, 237, 247, 0.88); }
.eg__cp { fill: rgba(56, 189, 248, 0.85); }
.eg__label { fill: rgba(231, 237, 247, 0.62); font-size: 12px; }

.readout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 6px;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  color: rgba(231, 237, 247, 0.78);
}

.copy {
  appearance: none;
  border: 1px solid rgba(148, 163, 184, 0.20);
  background: rgba(148, 163, 184, 0.10);
  color: rgba(231, 237, 247, 0.86);
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
}

.copy:hover { background: rgba(148, 163, 184, 0.16); }

/* Generated CSS box */
.gen { display: grid; gap: 10px; }
.gen__top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.gen__box {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(2, 6, 23, 0.55);
  color: rgba(231, 237, 247, 0.86);
  padding: 12px;
  resize: vertical;
  outline: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  line-height: 1.35;
}

.gen__box:focus-visible {
  box-shadow: 0 0 0 2px rgba(11, 18, 32, 0.9), 0 0 0 5px rgba(125, 211, 252, 0.25);
}


/* Toggle */
.toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
}

.toggle__label { font-size: 13px; color: rgba(231, 237, 247, 0.86); }

.toggle__btn {
  width: 46px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(148, 163, 184, 0.10);
  cursor: pointer;
  padding: 0;
  position: relative;
}

.toggle__btn.is-on {
  border-color: rgba(125, 211, 252, 0.35);
  background: rgba(56, 189, 248, 0.18);
}

.toggle__knob {
  position: absolute;
  top: 50%;
  left: 4px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  transform: translateY(-50%);
  background: rgba(231, 237, 247, 0.86);
  transition: transform 160ms ease;
}

.toggle__btn.is-on .toggle__knob { transform: translate(18px, -50%); }

.toggle--disabled { opacity: 0.55; }

/* Button */
.nw-btn {
  --bg: #38bdf8;
  --bg-hover: #7dd3fc;
  --fg: #07111f;
  --ring: rgba(125, 211, 252, 0.6);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  /* Playground vars */
  --hover-lift: -3px;
  --hover-scale: 1.09;
  --press-scale: 0.88;
  --squish-x: 1.25;
  --squish-y: 0.75;
  --t-press: 120ms;
  --t-release: 520ms;
  --ease-press: cubic-bezier(0.2, 0.9, 0.2, 1);
  --ease-release: cubic-bezier(0.28, 1.8, 0.55, 1);

  appearance: none;
  border: 0;
  cursor: pointer;
  user-select: none;

  position: relative;
  display: inline-grid;
  place-items: center;

  border-radius: 14px;
  padding: 0 18px;
  height: 44px;

  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.01em;

  color: var(--fg);
  background: var(--bg);
  box-shadow: var(--shadow);

  transform: translateZ(0);
  will-change: transform;

  transition-property: transform, background, filter, box-shadow;
  transition-duration: var(--t-release), 140ms, 140ms, 140ms;
  transition-timing-function: var(--ease-release), ease, ease, ease;

  -webkit-tap-highlight-color: transparent;
}

.nw-btn[data-size="sm"] { height: 38px; padding: 0 14px; font-size: 13px; }
.nw-btn[data-size="md"] { height: 44px; padding: 0 18px; font-size: 15px; }
.nw-btn[data-size="lg"] { height: 52px; padding: 0 22px; font-size: 16px; }

/* Anchor (transform-origin) */
.nw-btn[data-anchor="center"] { transform-origin: 50% 50%; }
.nw-btn[data-anchor="top"] { transform-origin: 50% 0%; }
.nw-btn[data-anchor="bottom"] { transform-origin: 50% 100%; }
.nw-btn[data-anchor="left"] { transform-origin: 0% 50%; }
.nw-btn[data-anchor="right"] { transform-origin: 100% 50%; }

.nw-btn:hover:not(:disabled) {
  background: var(--bg-hover);
  transform: translateY(var(--hover-lift)) scale(var(--hover-scale));
}

.nw-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow), 0 0 0 2px rgba(11, 18, 32, 0.9), 0 0 0 5px var(--ring);
}

/* Press uses its OWN duration + easing */
.nw-btn:active:not(:disabled) {
  transition-duration: var(--t-press), 140ms, 140ms, 140ms;
  transition-timing-function: var(--ease-press), ease, ease, ease;
}

.nw-btn[data-press="shrink"]:active:not(:disabled) {
  transform: translateY(0px) scale(var(--press-scale));
}

.nw-btn[data-press="squish"]:active:not(:disabled) {
  transform: translateY(0px) scaleX(var(--squish-x)) scaleY(var(--squish-y));
  filter: saturate(0.98);
}

/* Variants */
.nw-btn[data-variant="secondary"] {
  --bg: rgba(148, 163, 184, 0.22);
  --bg-hover: rgba(148, 163, 184, 0.30);
  --fg: rgba(231, 237, 247, 0.92);
  --ring: rgba(148, 163, 184, 0.55);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.28);
}

.nw-btn[data-variant="ghost"] {
  --bg: transparent;
  --bg-hover: rgba(148, 163, 184, 0.14);
  --fg: rgba(231, 237, 247, 0.92);
  --ring: rgba(148, 163, 184, 0.55);
  box-shadow: none;
  border: 1px solid rgba(148, 163, 184, 0.20);
}

.nw-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  filter: grayscale(0.2);
}

.nw-btn__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  padding: 0 2px;
}

.nw-btn[aria-busy="true"] .nw-btn__content { opacity: 0; }

.nw-btn__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.nw-btn__spinner {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: spin 900ms linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .nw-btn { transition: none; }
  .nw-btn__spinner { animation: none; }
}
`;
