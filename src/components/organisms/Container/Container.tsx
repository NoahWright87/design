import * as React from "react";
import "./Container.css";

export type ContainerSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Named design-system color tokens. Pass one of these names instead of raw CSS.
 * Each maps to the corresponding CSS custom property from the theme.
 */
export type ContainerColor =
  | "background"
  | "foreground"
  | "primary"
  | "secondary"
  | "confirm"
  | "danger"
  | "transparent";

/** Gutter border strength — controls the inset edge lines on large screens. */
export type GutterBorder = "subtle" | "medium" | "strong";

/** Gutter shadow depth — maps to design-system shadow tokens. */
export type GutterShadow = "sm" | "md" | "lg";

export interface ContainerProps {
  direction?: "vertical" | "horizontal";
  padding?: ContainerSpacing;
  margin?: ContainerSpacing;
  itemSpacing?: ContainerSpacing;
  alignItems?: React.CSSProperties["alignItems"];
  justifyContent?: React.CSSProperties["justifyContent"];
  /**
   * Background color. Use a named design-system token for consistency.
   * Default: `"transparent"`.
   */
  backgroundColor?: ContainerColor;
  /**
   * Text/foreground color. Use a named design-system token for consistency.
   * Default: `"foreground"`.
   */
  foregroundColor?: ContainerColor;
  width?: string | number;
  height?: string | number;
  wrap?: "always" | "never";
  fullWidth?: boolean;
  grow?: number;
  shrink?: number;
  basis?: string | number;
  centered?: boolean;
  spaceBetween?: boolean;
  /** Remove side gutter treatment on large screens. Gutters are on by default. */
  noGutters?: boolean;
  /** Disable all side border and shadow treatment. Alias for `noGutters`. */
  noBorders?: boolean;
  /** Enable a fixed background attachment effect for the background image. */
  parallax?: boolean;
  /**
   * Strength of the inset edge lines shown in the gutter area on large screens.
   * `"subtle"` (default) | `"medium"` | `"strong"`.
   */
  gutterBorder?: GutterBorder;
  /**
   * Drop-shadow depth added to the gutter area on large screens.
   * Uses design-system shadow tokens: `"sm"` | `"md"` | `"lg"`.
   */
  gutterShadow?: GutterShadow;
  /** Background image URL (e.g. from `getNonsense('abstractImage')`). */
  backgroundImage?: string;
  children?: React.ReactNode;
}

const COLOR_MAP: Record<ContainerColor, string> = {
  background:  "var(--background)",
  foreground:  "var(--foreground)",
  primary:     "var(--primary)",
  secondary:   "var(--secondary)",
  confirm:     "var(--confirm)",
  danger:      "var(--danger)",
  transparent: "transparent",
};

const SPACING_CLASS = {
  padding: (s: ContainerSpacing) => `nw-p-${s}`,
  margin:  (s: ContainerSpacing) => `nw-m-${s}`,
  gap:     (s: ContainerSpacing) => `nw-gap-${s}`,
};

const DEFAULTS = {
  direction:       "vertical"    as const,
  padding:         "md"          as ContainerSpacing,
  margin:          "none"        as ContainerSpacing,
  itemSpacing:     "sm"          as ContainerSpacing,
  backgroundColor: "transparent" as ContainerColor,
  foregroundColor: "foreground"  as ContainerColor,
  width:           "100%",
  height:          "auto",
  noGutters:       false,
};

function normalizeSize(v: string | number | undefined, fallback: string | number): string | undefined {
  const base = v == null ? fallback : v;
  if (typeof base === "number") return `${base}%`;
  return base;
}

export function Container(props: ContainerProps) {
  const {
    direction       = DEFAULTS.direction,
    padding         = DEFAULTS.padding,
    margin          = DEFAULTS.margin,
    itemSpacing     = DEFAULTS.itemSpacing,
    alignItems,
    justifyContent,
    backgroundColor = DEFAULTS.backgroundColor,
    foregroundColor = DEFAULTS.foregroundColor,
    width,
    height          = DEFAULTS.height,
    wrap            = "always",
    fullWidth       = true,
    grow,
    shrink,
    basis,
    centered        = false,
    spaceBetween    = false,
    noGutters       = DEFAULTS.noGutters,
    noBorders       = false,
    parallax        = false,
    gutterBorder,
    gutterShadow,
    backgroundImage,
    children,
  } = props;

  const resolvedJustifyContent = centered
    ? "center"
    : (spaceBetween ? "space-between" : justifyContent);
  const resolvedAlignItems = centered ? "center" : alignItems;
  const normalizedBasis = basis != null && typeof basis === "number" ? `${basis}%` : basis;

  const classNames = [
    "nw-container",
    direction === "horizontal" ? "horizontal" : "vertical",
    SPACING_CLASS.padding(padding),
    SPACING_CLASS.margin(margin),
    SPACING_CLASS.gap(itemSpacing),
    !(noGutters || noBorders) && "nw-container--gutters",
    gutterBorder  && `nw-container--gutter-border-${gutterBorder}`,
    gutterShadow  && `nw-container--gutter-shadow-${gutterShadow}`,
  ].filter(Boolean).join(" ");

  const normalizedBgImage = backgroundImage && !backgroundImage.startsWith("url(")
    ? `url("${backgroundImage.replace(/"/g, '\\"')}")`
    : backgroundImage;

  const style: React.CSSProperties = {
    backgroundColor: COLOR_MAP[backgroundColor],
    color:           COLOR_MAP[foregroundColor],
    width:  fullWidth ? "100%" : (normalizeSize(width, "auto") || undefined),
    height: normalizeSize(height, DEFAULTS.height) || undefined,
    flexWrap: wrap === "never" ? "nowrap" : "wrap",
    justifyContent: resolvedJustifyContent,
    alignItems: resolvedAlignItems,
    flexGrow: grow,
    flexShrink: shrink,
    flexBasis: normalizedBasis,
    ...(normalizedBgImage ? { backgroundImage: normalizedBgImage, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: parallax ? "fixed" : undefined } : {}),
  };

  return <div className={classNames} style={style}>{children}</div>;
}

export default Container;
