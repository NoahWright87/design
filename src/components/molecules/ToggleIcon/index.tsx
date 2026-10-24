import * as React from "react";
import "./toggle-icon.css";
import { usePrefersReducedMotion } from "../../../atoms/usePrefersReducedMotion.js";
import { clamp, heartGeometry, mix, moonSunGeometry, stepIconSpring } from "./spring.js";

export type ToggleIconPreset =
  | "hamburger"   // Menu → close
  | "moon-sun"    // Sun → crescent (true means dark mode)
  | "circle"      // ○ → ●
  | "arrow"       // → ↓
  | "plus-minus"  // + → −
  | "eye"         // Visible → hidden
  | "play-pause"  // ▶ → ⏸
  | "mute"        // Muted → audible
  | "thumbs"      // 👍 → 👎
  | "heart"       // ♡ → ♥
  | "bookmark"    // Outline → filled bookmark
  | "lock";       // 🔓 → 🔒

/** Default aria-label for each preset state [off, on] */
const DEFAULT_LABELS: Record<ToggleIconPreset, [string, string]> = {
  hamburger:   ["Open menu", "Close menu"],
  "moon-sun":  ["Switch to dark mode", "Switch to light mode"],
  circle:      ["Select", "Deselect"],
  arrow:       ["Expand", "Collapse"],
  "plus-minus":["Add", "Remove"],
  eye:         ["Hide", "Show"],
  "play-pause":["Play", "Pause"],
  mute:        ["Unmute", "Mute"],
  thumbs:      ["Downvote", "Upvote"],
  heart:       ["Like", "Unlike"],
  bookmark:    ["Save", "Unsave"],
  lock:        ["Lock", "Unlock"],
};

export interface ToggleIconProps {
  /** Built-in icon pair. */
  preset: ToggleIconPreset;
  /** Controlled toggled state. */
  isToggled?: boolean;
  /** Uncontrolled initial state. */
  defaultToggled?: boolean;
  /** Called with the new toggled value after each click. */
  onChange?: (toggled: boolean) => void;
  /**
   * Accessible button label. Defaults to the preset's built-in label
   * for the current state (e.g. "Open menu" / "Close menu").
   */
  label?: string;
  /** Icon size. @default "md" */
  size?: "sm" | "md" | "lg";
}

function useIconSpring(target: number) {
  const reduced = usePrefersReducedMotion();
  const state = React.useRef({ position: target, velocity: 0 });
  const [snapshot, setSnapshot] = React.useState(state.current);
  React.useEffect(() => {
    if (reduced) {
      state.current = { position: target, velocity: 0 };
      setSnapshot(state.current);
      return;
    }
    if (state.current.position === target && state.current.velocity === 0) return;
    let frame = 0;
    let previous: number | null = null;
    function tick(now: number) {
      state.current = stepIconSpring(state.current, target, previous === null ? 0 : (now - previous) / 1000);
      previous = now;
      setSnapshot(state.current);
      if (state.current.position !== target || state.current.velocity !== 0) frame = window.requestAnimationFrame(tick);
    }
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, reduced]);
  return reduced ? { position: target, velocity: 0 } : snapshot;
}

function IconGeometry({ preset, maskId, progress: p, velocity }: { preset: ToggleIconPreset; maskId: string; progress: number; velocity: number }) {
  const t = clamp(p);
  const centerTransform = (transform: string) => `translate(12 12) ${transform} translate(-12 -12)`;
  switch (preset) {
    case "hamburger": return <>
      <path d="M4 6H20" transform={`translate(12 ${6 + 6 * p}) rotate(${45 * p}) translate(-12 -6)`} />
      <path d="M4 12H20" transform={centerTransform(`scale(${1 - p} 1)`)} opacity={clamp(1 - t)} />
      <path d="M4 18H20" transform={`translate(12 ${18 - 6 * p}) rotate(${-45 * p}) translate(-12 -18)`} />
    </>;
    case "moon-sun": {
      const g = moonSunGeometry(1 - p);
      return <g fill="currentColor" stroke="none">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100" style={{ maskType: "luminance" }}>
            <rect width="100" height="100" fill="white" />
            <circle cx={g.cutX} cy={g.cutY} r={g.cutRadius} fill="black" />
          </mask>
        </defs>
        <g>
          {Array.from({ length: 8 }, (_, i) => <rect key={i} x={g.rayStart} y={-g.rayWidth / 2} width={g.rayLength} height={g.rayWidth} rx={g.rayWidth / 2} transform={`translate(50 50) rotate(${i * 45 + g.rotation})`} opacity={g.rayOpacity} />)}
        </g>
        <circle cx="50" cy="50" r={g.radius} mask={`url(#${maskId})`} />
      </g>;
    }
    case "circle": return <circle cx="12" cy="12" r={8 + Math.sin(p * Math.PI) * 0.7} fill="currentColor" fillOpacity={t} />;
    case "arrow": return <g transform={centerTransform(`rotate(${90 * p})`)}><path d="M4 12H20M13 5L20 12L13 19" /></g>;
    case "plus-minus": return <><path d="M5 12H19" /><path d="M12 5V19" transform={centerTransform(`rotate(${90 * p}) scale(1 ${1 - p})`)} opacity={1 - t} /></>;
    case "eye": return <>
      <path d="M2 12C6 4 18 4 22 12C18 20 6 20 2 12Z" />
      <circle cx="12" cy="12" r="3" transform={centerTransform(`scale(${mix(1, 0.2, p)})`)} opacity={1 - t} />
      <path pathLength="1" d="M3 3L21 21" strokeDasharray="1" strokeDashoffset={1 - t} />
    </>;
    case "play-pause": return <g fill="currentColor">
      <path d={`M6 4L${mix(12, 9, p)} ${mix(8, 4, p)}L${mix(12, 9, p)} ${mix(16, 20, p)}L6 20Z`} />
      <path d={`M${mix(12, 15, p)} ${mix(8, 4, p)}L${mix(20, 18, p)} ${mix(12, 4, p)}L${mix(20, 18, p)} ${mix(12, 20, p)}L${mix(12, 15, p)} ${mix(16, 20, p)}Z`} />
    </g>;
    case "mute": return <>
      <path d="M3 9H7L12 5V19L7 15H3Z" />
      <g transform={centerTransform(`scale(${mix(0.6, 1, p)})`)} opacity={t}><path d="M16 8C18 10 18 14 16 16" /><path d="M19 5C23 9 23 15 19 19" /></g>
      <g transform={centerTransform(`scale(${mix(1, 0.6, p)})`)} opacity={1 - t}><path d="M16 9L22 15M22 9L16 15" /></g>
    </>;
    case "thumbs": return <g transform={centerTransform(`rotate(${180 * p})`)}><path d="M7 10L11 3C12 1 15 3 14 6L13 9H19C21 9 21 11 20.5 13L19 19C18.8 20 18 21 17 21H7ZM3 10H7V21H3Z" /></g>;
    case "heart": {
      const heart = "M20.5 5.5C18 3 14 4 12 7C10 4 6 3 3.5 5.5C0 9 3 14 12 21C21 14 24 9 20.5 5.5Z";
      const g = heartGeometry(p, velocity);
      const clipId = `${maskId}-heart-fill`;
      return <g transform={`translate(12 ${21 + g.drop}) scale(${g.scale}) translate(-12 -21)`}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect x="0" y={g.fillY} width="24" height={g.fillHeight} />
          </clipPath>
        </defs>
        <path d={heart} fill="currentColor" stroke="none" clipPath={`url(#${clipId})`} />
        <path d={heart} fill="none" />
      </g>;
    }
    case "bookmark": return <path
      fill="currentColor" fillOpacity={t}
      transform={centerTransform(`scale(${1 + 0.12 * Math.sin(p * Math.PI) + 0.04 * p})`)}
      d="M7 3H17Q18 3 18 4V20Q18 21 17 20.4L12 17L7 20.4Q6 21 6 20V4Q6 3 7 3Z"
    />;
    case "lock": return <>
      <path d={`M8 11V7A4 4 0 0 1 16 7V${7 + 4 * p}`} />
      <rect x="5" y="11" width="14" height="10" rx="3" />
      <path d="M12 15V17" />
    </>;
  }
}

export function ToggleIcon({
  preset,
  isToggled,
  defaultToggled = false,
  onChange,
  label,
  size = "md",
}: ToggleIconProps) {
  const isControlled = isToggled !== undefined;
  const [internalToggled, setInternalToggled] = React.useState(defaultToggled);
  const maskId = `nw-icon-moon-${React.useId().replace(/:/g, "")}`;

  const currentToggled = isControlled ? isToggled : internalToggled;

  const progress = useIconSpring(currentToggled ? 1 : 0);

  function handleClick() {
    const next = !currentToggled;
    if (!isControlled) setInternalToggled(next);
    onChange?.(next);
  }

  const [offLabel, onLabel] = DEFAULT_LABELS[preset];

  const ariaLabel = label ?? (currentToggled ? onLabel : offLabel);

  const btnClass = [
    "nw-toggle-icon",
    `nw-toggle-icon--${size}`,
    currentToggled && "nw-toggle-icon--open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={btnClass}
      data-preset={preset}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={currentToggled}
      aria-expanded={preset === "hamburger" ? currentToggled : undefined}
    >
      <svg className="nw-toggle-icon__svg" viewBox={preset === "moon-sun" ? "0 0 100 100" : "0 0 24 24"} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <IconGeometry preset={preset} maskId={maskId} progress={progress.position} velocity={progress.velocity} />
      </svg>
    </button>
  );
}

export default ToggleIcon;
