import * as React from "react";
import "./pill.css";

export type PillVariant = 'default' | 'primary' | 'secondary' | 'confirm' | 'danger';
export type PillSize = 'small' | 'medium' | 'large';

export type PillProps = {
  children: React.ReactNode;
  variant?: PillVariant;
  size?: PillSize;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
  /**
   * When provided, renders a dismiss (×) button inside the pill.
   * Called when the user clicks the dismiss button.
   */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Defaults to "Remove". */
  dismissLabel?: string;
  /** Render the pill as an anchor link. */
  href?: string;
  /** Link target. Defaults to "_self". */
  target?: string;
  /** Inline styles for custom colors beyond the semantic palette. */
  style?: React.CSSProperties;
  /**
   * When true, visually hides the label and reveals it as a speech-bubble tooltip on hover.
   * Useful for icon-only pills where the label provides accessible context.
   */
  hideLabel?: boolean;
};

/** Duration must match --nw-pill-dismiss-duration in pill.css */
const DISMISS_DURATION_MS = 240;

export function Pill({ children, variant = 'default', size = 'medium', icon, onDismiss, dismissLabel = "Remove", href, target, style, hideLabel = false }: PillProps) {
  const [dismissing, setDismissing] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function handleDismiss() {
    setDismissing(true);
    timerRef.current = setTimeout(() => onDismiss?.(), DISMISS_DURATION_MS);
  }

  const cls = [
    "nw-pill",
    `nw-pill--${variant}`,
    `nw-pill--${size}`,
    href && "nw-pill--link",
    icon && "nw-pill--with-icon",
    hideLabel && "nw-pill--hide-label",
    onDismiss && "nw-pill--dismissable",
    dismissing && "nw-pill--dismissing",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {icon && <span className="nw-pill__icon" aria-hidden="true">{icon}</span>}
      <span className="nw-pill__label" aria-hidden={hideLabel || undefined}>{children}</span>
      {hideLabel && <span className="nw-pill__tooltip" role="tooltip">{children}</span>}
      {onDismiss && (
        <button
          type="button"
          className="nw-pill__dismiss"
          onClick={handleDismiss}
          aria-label={dismissLabel}
          disabled={dismissing}
        >
          ×
        </button>
      )}
    </>
  );

  if (href) {
    return (
      <a className={cls} href={href} target={target} style={style}>
        {inner}
      </a>
    );
  }

  return (
    <span className={cls} style={style}>
      {inner}
    </span>
  );
}

export default Pill;
