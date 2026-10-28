import * as React from "react";
import "./toggle-icon.css";
import { usePrefersReducedMotion } from "../../../atoms/usePrefersReducedMotion.js";
import { clamp, eyeGeometry, heartGeometry, lockGeometry, mix, moonSunGeometry, playbackGeometry, restingHeart, restingLock, stepHeartMotion, stepIconSpring, stepLockMotion, targetHeart, targetLock } from "./spring.js";

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

function useIconSpring(target: number, mode: "spring" | "fill" | "playback" | "lock") {
  const fillMode = mode === "fill";
  const reduced = usePrefersReducedMotion();
  const state = React.useRef({ position: target, velocity: 0, width: 0, height: 0, rotation: 0 });
  const heart = React.useRef(restingHeart(target));
  const lock = React.useRef(restingLock(target));
  const previousMode = React.useRef(mode);
  const [snapshot, setSnapshot] = React.useState(state.current);
  React.useEffect(() => {
    if (reduced || previousMode.current !== mode) {
      previousMode.current = mode;
      state.current = { position: target, velocity: 0, width: 0, height: 0, rotation: 0 };
      heart.current = restingHeart(target);
      lock.current = restingLock(target);
      setSnapshot(state.current);
      return;
    }
    if (fillMode) {
      heart.current = targetHeart(heart.current, target);
      if (heart.current.phase === "idle") return;
    } else if (mode === "lock") {
      lock.current = targetLock(lock.current, target);
      if (lock.current.progress.position === target && lock.current.progress.velocity === 0 && lock.current.recoil.position === 0 && lock.current.recoil.velocity === 0) return;
    } else if (state.current.position === target && state.current.velocity === 0) return;
    let frame = 0;
    let previous: number | null = null;
    function tick(now: number) {
      const dt = previous === null ? 0 : (now - previous) / 1000;
      if (fillMode) {
        heart.current = stepHeartMotion(heart.current, dt);
        state.current = { position: heart.current.fill, velocity: 0, width: heart.current.width.position, height: heart.current.height.position, rotation: 0 };
      } else if (mode === "lock") {
        lock.current = stepLockMotion(lock.current, dt);
        state.current = { ...lock.current.progress, width: 0, height: 0, rotation: lock.current.recoil.position };
      } else {
        state.current = { ...stepIconSpring(state.current, target, dt, mode === "playback" ? 6.5 : 14.5), width: 0, height: 0, rotation: 0 };
      }
      previous = now;
      setSnapshot(state.current);
      const active = fillMode ? heart.current.phase !== "idle" : state.current.position !== target || state.current.velocity !== 0 || (mode === "lock" && (lock.current.recoil.position !== 0 || lock.current.recoil.velocity !== 0));
      if (active) frame = window.requestAnimationFrame(tick);
    }
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, reduced, mode, fillMode]);
  return reduced ? { position: target, velocity: 0, width: 0, height: 0, rotation: 0 } : snapshot;
}

function IconGeometry({ preset, maskId, progress: p, width, height, rotation }: { preset: ToggleIconPreset; maskId: string; progress: number; width: number; height: number; rotation: number }) {
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
    case "eye": {
      const g = eyeGeometry(p);
      const clipId = `${maskId}-eye-opening`;
      return <g transform={`translate(0 ${g.offsetY}) ${centerTransform(`scale(${g.scaleX} ${g.scaleY})`)}`}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={g.aperture} fill="currentColor" />
          </clipPath>
        </defs>
        <path d={g.lower} strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" clipPath={`url(#${clipId})`} />
        <path d={g.upper} />
        <g strokeWidth="1.6">
          {g.lashes.map((lash, i) => <path key={i} d={`M${lash.x} ${lash.y}L${lash.endX} ${lash.endY}`} />)}
        </g>
      </g>;
    }
    case "play-pause": {
      const g = playbackGeometry(p);
      return <g fill="currentColor" strokeWidth="1.2">
        <path d={g.primary} />
        <path d={g.secondary} />
      </g>;
    }
    case "mute": return <>
      <path d="M3 9H7L12 5V19L7 15H3Z" />
      <g transform={centerTransform(`scale(${mix(0.6, 1, p)})`)} opacity={t}><path d="M16 8C18 10 18 14 16 16" /><path d="M19 5C23 9 23 15 19 19" /></g>
      <g transform={centerTransform(`scale(${mix(1, 0.6, p)})`)} opacity={1 - t}><path d="M16 9L22 15M22 9L16 15" /></g>
    </>;
    case "thumbs": return <g transform={centerTransform(`rotate(${180 * p})`)}><path d="M7 10L11 3C12 1 15 3 14 6L13 9H19C21 9 21 11 20.5 13L19 19C18.8 20 18 21 17 21H7ZM3 10H7V21H3Z" /></g>;
    case "heart":
    case "bookmark": {
      const shape = preset === "heart"
        ? "M20.5 5.5C18 3 14 4 12 7C10 4 6 3 3.5 5.5C0 9 3 14 12 21C21 14 24 9 20.5 5.5Z"
        : "M7 3H17Q18 3 18 4V21L12 17L6 21V4Q6 3 7 3Z";
      const g = heartGeometry(p, width, height);
      const clipId = `${maskId}-${preset}-fill`;
      return <g transform={`translate(12 21) scale(${g.scaleX} ${g.scaleY}) translate(-12 -21)`}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect x="0" y={g.fillY} width="24" height={g.fillHeight} />
          </clipPath>
        </defs>
        <path d={shape} fill="currentColor" stroke="none" clipPath={`url(#${clipId})`} />
        <path d={shape} fill="none" vectorEffect="non-scaling-stroke" strokeWidth="0.1em" />
      </g>;
    }
    case "lock": {
      const g = lockGeometry(p);
      return <g transform={`translate(12 16) rotate(${rotation}) translate(-12 -16)`}>
        <path d={g.shackle} />
        <rect x="5" y="11" width="14" height="10" rx="3" />
        <path d="M12 15V17" />
      </g>;
    }
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

  const mode = preset === "heart" || preset === "bookmark" ? "fill" : preset === "play-pause" ? "playback" : preset === "lock" ? "lock" : "spring";
  const progress = useIconSpring(currentToggled ? 1 : 0, mode);

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
        <IconGeometry preset={preset} maskId={maskId} progress={progress.position} width={progress.width} height={progress.height} rotation={progress.rotation} />
      </svg>
    </button>
  );
}

export default ToggleIcon;
