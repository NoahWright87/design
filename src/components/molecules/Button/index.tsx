import * as React from "react";
import "./button.css";

export type ButtonVariant = "solid" | "outline" | "ghost" | "text";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonColor = "primary" | "secondary" | "confirm" | "danger" | string;
export type IconPosition = "left" | "right" | "center" | "top" | "bottom";
export type ButtonMotion = "none" | "subtle" | "bouncy";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  icon?: React.ReactElement;
  iconPosition?: IconPosition;
  disabled?: boolean;
  motion?: ButtonMotion;
  style?: React.CSSProperties;
};

/**
 * Get contrast color (white or black) based on background color
 */
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace("#", "");
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

/**
 * Resolve color to CSS variable or hex value
 */
function resolveColor(color: ButtonColor): { color: string; contrast: string } {
  const semanticColors = ["primary", "secondary", "confirm", "danger"];
  
  if (semanticColors.includes(color)) {
    return {
      color: `var(--${color})`,
      contrast: "var(--background)",
    };
  }
  
  // Custom hex color
  return {
    color,
    contrast: getContrastColor(color),
  };
}

export function Button({
  children,
  onClick,
  variant = "solid",
  size = "medium",
  color = "primary",
  icon,
  iconPosition = "left",
  disabled = false,
  motion = "bouncy",
  style,
}: ButtonProps) {
  const { color: buttonColor, contrast: buttonContrast } = resolveColor(color);
  
  const classNames = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    `button--motion-${motion}`,
    icon && `button--icon-${iconPosition}`,
  ]
    .filter(Boolean)
    .join(" ");
  
  const inlineStyles: React.CSSProperties = {
    "--button-color": buttonColor,
    "--button-contrast": buttonContrast,
    ...style,
  } as React.CSSProperties;
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames}
      style={inlineStyles}
    >
      {icon && <span className="button__icon">{icon}</span>}
      <span className="button__label">{children}</span>
    </button>
  );
}

export default Button;
