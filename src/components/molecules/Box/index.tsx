import * as React from "react";
import "./box.css";

export type BoxSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type BoxRounded = "none" | "sm" | "md" | "lg" | "full";
export type BoxShadow = "none" | "sm" | "md" | "lg";
export type BoxBackground =
  | "transparent"
  | "background"
  | "foreground"
  | "primary"
  | "secondary"
  | "confirm"
  | "danger";

export interface BoxProps {
  /** Padding on all sides. Overridden by paddingX/paddingY. */
  padding?: BoxSpacing;
  /** Horizontal padding (left + right). */
  paddingX?: BoxSpacing;
  /** Vertical padding (top + bottom). */
  paddingY?: BoxSpacing;
  /** Margin shorthand. Use "auto" for centering. */
  margin?: BoxSpacing | "auto";
  /** Border radius. */
  rounded?: BoxRounded;
  /** Box shadow depth. */
  shadow?: BoxShadow;
  /** Background color mapped to theme token. */
  background?: BoxBackground;
  /** Render as any HTML element or custom component. Defaults to "div". */
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Box({
  padding,
  paddingX,
  paddingY,
  margin,
  rounded,
  shadow,
  background,
  as: Tag = "div",
  children,
  className = "",
  style,
}: BoxProps) {
  const cls = [
    "nw-box",
    padding && padding !== "none" && `nw-box--p-${padding}`,
    paddingX && paddingX !== "none" && `nw-box--px-${paddingX}`,
    paddingY && paddingY !== "none" && `nw-box--py-${paddingY}`,
    margin && margin !== "none" && `nw-box--m-${margin}`,
    rounded && rounded !== "none" && `nw-box--rounded-${rounded}`,
    shadow && shadow !== "none" && `nw-box--shadow-${shadow}`,
    background && background !== "transparent" && `nw-box--bg-${background}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={cls} style={style}>
      {children}
    </Tag>
  );
}

export default Box;
