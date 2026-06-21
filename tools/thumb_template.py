#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""thumb_template.py — FESTER Marken-Rahmen für Podcast-Thumbnails (Wiedererkennungswert).

Standard (Hybrid): Badge + Logo werden hier per Code IMMER GLEICH gesetzt; die große
Headline wird nativ im KI-Motiv generiert (separat). Badge-Schrift = DIN Condensed Bold.

  python thumb_template.py --in motiv.png --out final.png --kind quicky|deepdive \
      [--cover-old]   # überdeckt einen bereits eingebrannten Badge oben links (für Mockups)
"""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

LOGO = Path.home() / "Desktop/Claude/Code/Bild Assets/ki_affairs_logo_transparent_clean.png"
DIN = "/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf"
ORANGE = (233, 113, 50)
CYAN = (46, 196, 198)
KINDS = {
    "quicky":   {"label": "QUICKY",    "accent": ORANGE},
    "deepdive": {"label": "DEEP DIVE", "accent": CYAN},
}


def font(size):
    try:
        return ImageFont.truetype(DIN, size)
    except Exception:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", size)


def draw_badge(img, label, accent, cover_old=False):
    """Feste Marken-Plakette oben links: dunkles Tag, linker Akzentbalken, DIN-Versalien, dezenter Glow."""
    base = img.convert("RGBA")
    bw, bh = base.size
    pad = int(bw * 0.030)                      # Außenabstand
    fsz = int(bh * 0.085)                       # feste Schriftgröße
    f = font(fsz)
    d0 = ImageDraw.Draw(base)
    # gesperrte Versalien für Plaketten-Look
    text = " ".join(list(label)).replace("   ", "  ")  # leichtes Tracking
    tw = int(d0.textlength(text, font=f))
    th = fsz
    bar = max(6, int(bw * 0.006))               # Akzentbalken-Breite
    inner = int(fsz * 0.42)                      # Innenabstand
    plate_w = bar + inner + tw + inner
    plate_h = th + int(inner * 1.4)
    x0, y0 = pad, pad
    if cover_old:                                # alten eingebrannten Badge dezent abdunkeln (nur Eckzone)
        cw = min(bw // 2, x0 + plate_w + int(pad * 1.2))
        ch = y0 + plate_h + int(pad * 1.0)
        scrim = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        sd = ImageDraw.Draw(scrim)
        for yy in range(ch):                     # weicher vertikaler Verlauf, oben dunkler
            a = int(200 * max(0.0, 1 - yy / ch) ** 1.2)
            sd.line([(0, yy), (cw, yy)], fill=(8, 11, 15, a))
        scrim = scrim.filter(ImageFilter.GaussianBlur(8))
        base.alpha_composite(scrim, (0, 0))
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    dl = ImageDraw.Draw(layer)
    # Glow
    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow).rectangle([x0 - 3, y0 - 3, x0 + plate_w + 3, y0 + plate_h + 3],
                                   fill=accent + (90,))
    layer = Image.alpha_composite(layer, glow.filter(ImageFilter.GaussianBlur(10)))
    dl = ImageDraw.Draw(layer)
    # Plakette
    dl.rectangle([x0, y0, x0 + plate_w, y0 + plate_h], fill=(10, 14, 19, 235))
    dl.rectangle([x0, y0, x0 + plate_w, y0 + plate_h], outline=accent + (255,), width=2)
    dl.rectangle([x0, y0, x0 + bar, y0 + plate_h], fill=accent + (255,))   # Akzentbalken links
    # Text vertikal zentriert
    ty = y0 + (plate_h - th) // 2 - int(fsz * 0.12)
    dl.text((x0 + bar + inner, ty), text, font=f, fill=accent + (255,))
    base = Image.alpha_composite(base, layer)
    return base


def place_logo(base, frac=0.115, pad_frac=0.030):
    base = base.convert("RGBA")
    logo = Image.open(LOGO).convert("RGBA")
    bw, bh = base.size
    tw = int(bw * frac)
    logo = logo.resize((tw, int(logo.height * tw / logo.width)), Image.LANCZOS)
    pad = int(bw * pad_frac)
    base.alpha_composite(logo, (bw - logo.width - pad, bh - logo.height - pad))
    return base


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--kind", required=True, choices=list(KINDS))
    ap.add_argument("--cover-old", action="store_true")
    ap.add_argument("--no-logo", action="store_true")
    a = ap.parse_args()
    k = KINDS[a.kind]
    img = Image.open(a.inp).convert("RGBA")
    img = draw_badge(img, k["label"], k["accent"], cover_old=a.cover_old)
    if not a.no_logo:
        img = place_logo(img)
    img.convert("RGB").save(a.out, "PNG")
    print(f"OK -> {a.out}  [{k['label']}]")


if __name__ == "__main__":
    main()
