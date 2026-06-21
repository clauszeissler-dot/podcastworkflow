#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Postprocessing fuer fertige Thumbnails/Bilder:
  - kaschiert den alten harten Logo-Kasten (RGB-Block-Bug) durch einen weichen Eck-Scrim
  - legt das ECHTE transparente Logo (ki_affairs_logo_transparent_clean.png) sauber unten rechts auf
  - optional: setzt eine fette Headline (1-2 Zeilen) oben rechts mit Schatten

Aufruf:
  python fix_logo_headline.py --in bild.png --out bild.png [--headline "ZEILE1|ZEILE2"] [--accent cyan|orange]
"""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

LOGO = Path.home() / "Desktop/Claude/Code/Bild Assets/ki_affairs_logo_transparent_clean.png"
FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Impact.ttf",
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/Library/Fonts/Arial Bold.ttf",
]
ACCENTS = {"cyan": (46, 196, 198), "orange": (233, 113, 50), "white": (245, 245, 245)}


def load_font(size):
    for f in FONT_CANDIDATES:
        if Path(f).exists():
            try:
                return ImageFont.truetype(f, size)
            except Exception:
                continue
    return ImageFont.load_default()


def corner_scrim(base, w_frac=0.30, h_frac=0.40, max_alpha=235):
    """Weicher dunkler Verlauf in der unteren rechten Ecke -> verschluckt den alten Logo-Kasten."""
    bw, bh = base.size
    pw, ph = int(bw * w_frac), int(bh * h_frac)
    scrim = Image.new("L", (pw, ph), 0)
    px = scrim.load()
    for y in range(ph):
        for x in range(pw):
            # Distanz zur oberen-linken Ecke des Panels -> 0, zur unteren-rechten -> max
            fx = x / (pw - 1)
            fy = y / (ph - 1)
            f = (fx * 0.5 + fy * 0.5)
            px[x, y] = int(max(0.0, min(1.0, f)) ** 1.4 * max_alpha)
    scrim = scrim.filter(ImageFilter.GaussianBlur(max(pw, ph) * 0.04))
    dark = Image.new("RGBA", (pw, ph), (6, 10, 14, 0))
    dark.putalpha(scrim)
    base = base.convert("RGBA")
    base.alpha_composite(dark, (bw - pw, bh - ph))
    return base


def place_logo(base, logo_path, frac=0.135, pad_frac=0.030):
    base = base.convert("RGBA")
    logo = Image.open(logo_path).convert("RGBA")
    bw, bh = base.size
    tw = int(bw * frac)
    logo = logo.resize((tw, int(logo.height * tw / logo.width)), Image.LANCZOS)
    pad = int(bw * pad_frac)
    base.alpha_composite(logo, (bw - logo.width - pad, bh - logo.height - pad))
    return base


def draw_headline(base, lines, accent, pos="tr", plate=False, max_frac=0.60, size_frac=0.135):
    """pos: Kombination aus t/b (top/bottom) + l/c/r (left/center/right), z.B. 'tr','bl','tc'."""
    base = base.convert("RGBA")
    bw, bh = base.size
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    size = int(bh * size_frac)
    maxw = bw * max_frac
    while size > 24:
        font = load_font(size)
        widest = max(d.textlength(ln, font=font) for ln in lines)
        if widest <= maxw:
            break
        size = int(size * 0.92)
    font = load_font(size)
    lh = int(size * 1.08)
    block_h = lh * len(lines)
    block_w = int(max(d.textlength(ln, font=font) for ln in lines))
    vert, horiz = pos[0], pos[1] if len(pos) > 1 else "r"
    margin_x, margin_y = int(bw * 0.045), int(bh * 0.07)
    y0 = margin_y if vert == "t" else bh - margin_y - block_h
    col = ACCENTS.get(accent, ACCENTS["white"])
    if plate:
        pad = int(size * 0.28)
        if horiz == "l":
            px0 = margin_x - pad
        elif horiz == "c":
            px0 = (bw - block_w) // 2 - pad
        else:
            px0 = bw - margin_x - block_w - pad
        plate_img = Image.new("RGBA", (block_w + 2 * pad, block_h + int(pad * 1.2)), (8, 12, 16, 170))
        plate_img = plate_img.filter(ImageFilter.GaussianBlur(2))
        overlay.alpha_composite(plate_img, (max(0, px0), y0 - int(pad * 0.5)))
    y = y0
    for ln in lines:
        w = d.textlength(ln, font=font)
        if horiz == "l":
            x = margin_x
        elif horiz == "c":
            x = (bw - w) // 2
        else:
            x = bw - margin_x - w
        for dx, dy in [(-3, -3), (3, -3), (-3, 3), (3, 3), (0, 4), (0, -4)]:
            d.text((x + dx, y + dy), ln, font=font, fill=(0, 0, 0, 235))
        d.text((x, y), ln, font=font, fill=col + (255,))
        y += lh
    base.alpha_composite(overlay)
    return base


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--headline", default="", help="Zeilen mit | trennen")
    ap.add_argument("--accent", default="white", choices=list(ACCENTS))
    ap.add_argument("--pos", default="tr", help="t/b + l/c/r, z.B. tr, bl, tc")
    ap.add_argument("--plate", action="store_true", help="halbtransparenter Balken hinter Headline")
    ap.add_argument("--no-scrim", action="store_true")
    ap.add_argument("--no-logo", action="store_true", help="kein Logo aufkleben (Bild hat schon sauberes transparentes Logo)")
    ap.add_argument("--logo", default=str(LOGO))
    a = ap.parse_args()

    img = Image.open(a.inp).convert("RGBA")
    if not a.no_scrim:
        img = corner_scrim(img)
    if not a.no_logo:
        img = place_logo(img, a.logo)
    if a.headline.strip():
        img = draw_headline(img, [s for s in a.headline.split("|") if s.strip()], a.accent,
                            pos=a.pos, plate=a.plate)
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(a.out, "PNG")
    print(f"OK -> {a.out}")


if __name__ == "__main__":
    main()
