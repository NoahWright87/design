"""Constructed redraws for glyphs that trace poorly (tiny, noisy shapes).

Usage (from the repo root):
    python3 scripts/wright-sans/recipes.py [weight ...] [--glyph NAME ...]

Each recipe reads the traced glyph for its size and position, rebuilds it as
a clean stroke (construct.py) with the same ink area, and writes it back as
an edited SVG. Run trace.py --force on a glyph first to recover its tracing
if you want to re-derive a recipe from scratch.
"""
import argparse

from construct import ink_bounds, match_area, stroke, to_contours
from glyphsvg import load_glyph, read_metrics, write_glyph

WEIGHTS = ["regular", "semibold", "bold", "black"]


def tilde(traced):
    """Squared wave: up the left end, over, a short steep diagonal, along the
    bottom, up the right end. Ends are cut flat (bottom-left, top-right)."""
    x0, y0, x1, y1 = ink_bounds(traced)
    xc = (x0 + x1) / 2
    run = 0.11 * (x1 - x0)
    radius = 0.45 * (y1 - y0)  # thin weights get a rounder wave

    def build(t):
        xl, xr = x0 + t / 2, x1 - t / 2
        yb, yt = y0 + t / 2, y1 - t / 2
        return stroke([(xl, y0), (xl, yt), (xc - run, yt), (xc + run, yb), (xr, yb), (xr, y1)], t,
                      outer_radius=max(radius, 1.2 * t))

    return build


def cedilla(traced):
    """Squared reversed-C hook hanging from the baseline: a top bar joined to
    the letter, a right side, and a bottom bar ending in a flat cut."""
    x0, y0, x1, y1 = ink_bounds(traced)
    xs = x0 + 0.27 * (x1 - x0)
    max_t = 0.36 * (y1 - y0)  # keep the counter open in heavy weights

    def build(t):
        t = min(t, max_t)
        yt, yb, xr = y1 - t / 2, y0 + t / 2, x1 - t / 2
        return stroke([(xs, yt), (xr, yt), (xr, yb), (x0, yb)], t)

    build.max_t = max_t
    return build


RECIPES = {
    "tilde.cap": tilde,
    "tilde.lc": tilde,
    "cedilla.cap": cedilla,
    "cedilla.lc": cedilla,
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("weights", nargs="*")
    ap.add_argument("--glyph", nargs="*")
    ap.add_argument("--redo", action="store_true", help="rebuild even if the glyph is already edited")
    a = ap.parse_args()
    for w in a.weights or WEIGHTS:
        metrics = read_metrics(w)
        for name in a.glyph or RECIPES:
            traced = load_glyph(w, name)["contours"]
            if load_glyph(w, name)["status"] == "edited" and not a.redo:
                print(f"{w}/{name}: already edited, skipping (use --redo)")
                continue
            build = RECIPES[name](traced)
            geom, t = match_area(build, traced)
            t = min(t, getattr(build, "max_t", t))
            write_glyph(w, name, to_contours(geom), metrics=metrics, status="edited",
                        note=f"Constructed by recipes.py ({RECIPES[name].__name__}, stroke {t:.0f}).")
            print(f"{w}/{name}: stroke {t:.0f}")


if __name__ == "__main__":
    main()
