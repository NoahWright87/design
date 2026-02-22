import * as React from "react";
import "./Container.css";

export type ContainerSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface ContainerProps {
  direction?: "vertical" | "horizontal";
  padding?: ContainerSpacing;
  margin?: ContainerSpacing;
  itemSpacing?: ContainerSpacing;
  backgroundColor?: string;
  foregroundColor?: string;
  width?: string | number;
  height?: string | number;
  wrap?: "always"; // reserved for future flexibility
  /** Remove side gutter treatment on large screens. Gutters are on by default. */
  noGutters?: boolean;
  children?: React.ReactNode;
}

const SPACING_CLASS = {
  padding: (s: ContainerSpacing) => `nw-p-${s}`,
  margin: (s: ContainerSpacing) => `nw-m-${s}`,
  gap: (s: ContainerSpacing) => `nw-gap-${s}`
};

const DEFAULTS: Required<Omit<ContainerProps, "children">> = {
  direction: "vertical",
  padding: "md",
  margin: "none",
  itemSpacing: "sm",
  backgroundColor: "transparent",
  foregroundColor: "var(--foreground)",
  width: "100%",
  height: "auto",
  wrap: "always",
  noGutters: false,
};

function normalizeSize(v: string | number | undefined, fallback: string | number): string | undefined {
  const base = v == null ? fallback : v;
  if (typeof base === "number") return `${base}%`;
  return base;
}

export function Container(props: ContainerProps) {
  const {
    direction = DEFAULTS.direction,
    padding = DEFAULTS.padding,
    margin = DEFAULTS.margin,
    itemSpacing = DEFAULTS.itemSpacing,
    backgroundColor = DEFAULTS.backgroundColor,
    foregroundColor = DEFAULTS.foregroundColor,
    width = DEFAULTS.width,
    height = DEFAULTS.height,
    noGutters = DEFAULTS.noGutters,
    // wrap currently only supports "always"; future options can branch behavior
    children
  } = props;

  const classNames = [
    "nw-container",
    direction === "horizontal" ? "horizontal" : "vertical",
    SPACING_CLASS.padding(padding),
    SPACING_CLASS.margin(margin),
    SPACING_CLASS.gap(itemSpacing),
    !noGutters && "nw-container--gutters",
  ].filter(Boolean).join(" ");

  const style: React.CSSProperties = {
    backgroundColor,
    color: foregroundColor,
    width: normalizeSize(width, DEFAULTS.width) || undefined,
    height: normalizeSize(height, DEFAULTS.height) || undefined
  };

  return <div className={classNames} style={style}>{children}</div>;
}

export default Container;