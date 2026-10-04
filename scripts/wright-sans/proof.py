"""Render a type specimen from the built font files (after build.py).

Usage (from the repo root):
    python3 scripts/wright-sans/proof.py [weight ...] [--out proof.png] [--size 64]

Shows the full character set, kerning and figure samples for each weight,
set the way a browser would (HarfBuzz layout via Pillow/raqm when available).
"""
import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT_DIR = Path(__file__).resolve().parents[2] / "src" / "styles" / "fonts"
STYLES = {"regular": "Regular", "semibold": "SemiBold", "bold": "Bold", "black": "Black"}
LINES = [
    ("Wright Sans – {style}", 1.5),
    ("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 0.9),
    ("abcdefghijklmnopqrstuvwxyz", 0.9),
    ("0123456789  1111  8080  $1,024.50  12:45", 0.8),
    (".,:;!?@#&%+-/\\()[]{}'\"_=*$ <|^~> “” ‘’ – — … · ¡¿", 0.8),
    ("ÀÁÃÄÇÈÉËÌÍÏÑÒÓÕÖÙÚÜÝŸ àáãäçèéëìíïñòóõöùúüýÿ", 0.8),
    ("AVATAR Type Yolk L’été “Quotes” T. W. Y,", 0.8),
    ("The quick brown fox jumps over the lazy dog.", 0.7),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("weights", nargs="*", default=list(STYLES))
    ap.add_argument("--out", default="wright-sans-proof.png")
    ap.add_argument("--size", type=int, default=64)
    a = ap.parse_args()
    weights = a.weights or list(STYLES)
    size = a.size
    block = sum(int(size * k * 1.35) for _, k in LINES) + size
    img = Image.new("L", (int(size * 26), block * len(weights)), 255)
    d = ImageDraw.Draw(img)
    y = size // 3
    for w in weights:
        path = FONT_DIR / f"WrightSans-{STYLES[w]}.otf"
        for text, k in LINES:
            font = ImageFont.truetype(str(path), int(size * k))
            d.text((size // 2, y), text.replace("{style}", STYLES[w]), font=font, fill=20)
            y += int(size * k * 1.35)
        y += size
    img.save(a.out)
    print(a.out)


if __name__ == "__main__":
    main()
