#!/usr/bin/env python3
"""gen_thumb_v2.py — Bilder via OpenAI gpt-image-2 (Frontier) mit echter Likeness.

Verbesserungen ggü. gen_thumb_openai.py (v1, gpt-image-1):
  - Modell gpt-image-2 (parametrisierbar) statt gpt-image-1.
  - input_fidelity=high → bewahrt Gesicht/Identität der Referenzen.
  - Referenzbilder in HOHER Auflösung (Default 1536px statt 1024) → bessere Likeness.
  - Logo wird NICHT vom Modell gemalt, sondern nach der Generierung exakt per PIL
    einkomponiert (transparentes PNG, unten rechts). Marke immer korrekt getroffen.
  - Optional: Dortmunder Skyline als dezentes Compositing-Band am unteren Rand.

Aufruf:
  python gen_thumb_v2.py --prompt-file p.txt --output out.png \
      --ref assets/000_PP-1.jpg --ref assets/001_PP-2.jpg \
      --logo ".../ki_affairs_logo_2048.png" [--skyline ".../DO Skyline.png"]

Key: OPENAI_API_KEY (gleiche Quelle wie gen_thumb_openai.py).
"""
import argparse, base64, os, sys
from io import BytesIO
from pathlib import Path
import requests
from PIL import Image

KEY_CANDIDATES = [
    Path.home() / "Documents" / "Claude" / "Projects" / "Bild Skill" / "api_keys.env",
    Path.home() / "Dokumente" / "Claude" / "Projects" / "Bild Skill" / "api_keys.env",
    Path.home() / ".config" / "ki-affairs" / "api_keys.env",
]
LOGO_DEFAULT = Path.home() / "Desktop/Claude/Code/Bild Assets/ki_affairs_logo_transparent_clean.png"  # RGBA m. echtem Alpha (ki_affairs_logo_2048.png ist RGB/opak -> Block!)


def load_key(name="OPENAI_API_KEY"):
    if os.environ.get(name):
        return os.environ[name]
    for p in KEY_CANDIDATES:
        if p.exists():
            for line in p.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line.startswith(name + "="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit(f"FEHLER: {name} nicht gefunden")


def prep_ref(path, maxpx):
    img = Image.open(path).convert("RGB")
    img.thumbnail((maxpx, maxpx), Image.LANCZOS)
    buf = BytesIO(); img.save(buf, "PNG"); buf.seek(0)
    return buf


def crop_16x9(img, w_out=1280, h_out=720):
    w, h = img.size
    tr = w_out / h_out
    if w / h > tr:
        nw = int(round(h * tr)); left = (w - nw) // 2; img = img.crop((left, 0, left + nw, h))
    else:
        nh = int(round(w / tr)); top = (h - nh) // 2; img = img.crop((0, top, w, top + nh))
    return img.resize((w_out, h_out), Image.LANCZOS)


def composite_logo(base, logo_path, frac=0.13, pad_frac=0.028):
    """Transparentes Logo unten rechts exakt einfügen (skaliert auf frac der Breite)."""
    base = base.convert("RGBA")
    logo = Image.open(logo_path)
    if logo.mode not in ("RGBA", "LA") and "transparency" not in logo.info:
        print(f"  WARNUNG: Logo '{logo_path}' hat KEINEN Alpha-Kanal -> wuerde als opaker Block "
              f"eingefuegt. Bitte transparente PNG-Variante nutzen.", file=sys.stderr)
    logo = logo.convert("RGBA")
    bw, bh = base.size
    target_w = int(bw * frac)
    ratio = target_w / logo.width
    logo = logo.resize((target_w, int(logo.height * ratio)), Image.LANCZOS)
    pad = int(bw * pad_frac)
    pos = (bw - logo.width - pad, bh - logo.height - pad)
    base.alpha_composite(logo, pos)
    return base.convert("RGB")


def composite_skyline(base, skyline_path, height_frac=0.22, opacity=0.55):
    """Dezente Skyline-Silhouette als Band am unteren Rand (transparentes PNG)."""
    base = base.convert("RGBA")
    sky = Image.open(skyline_path).convert("RGBA")
    bw, bh = base.size
    target_h = int(bh * height_frac)
    ratio = target_h / sky.height
    sky = sky.resize((int(sky.width * ratio), target_h), Image.LANCZOS)
    # Breite auf Bildbreite begrenzen / zentrieren
    if sky.width > bw:
        left = (sky.width - bw) // 2; sky = sky.crop((left, 0, left + bw, sky.height))
    if opacity < 1.0:
        a = sky.split()[3].point(lambda v: int(v * opacity)); sky.putalpha(a)
    pos = ((bw - sky.width) // 2, bh - sky.height)
    base.alpha_composite(sky, pos)
    return base.convert("RGB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt-file"); ap.add_argument("--prompt")
    ap.add_argument("--output", required=True)
    ap.add_argument("--ref", action="append", default=[], help="Likeness-Referenzbild (mehrfach)")
    ap.add_argument("--logo", default=str(LOGO_DEFAULT), help="transparentes Logo (Compositing); '' = aus")
    ap.add_argument("--skyline", default="", help="transparente Skyline (Compositing); leer = aus")
    ap.add_argument("--model", default="gpt-image-2")
    ap.add_argument("--fidelity", default="high", choices=["high", "low", "none"],
                    help="input_fidelity (Likeness-Treue); 'none' = Parameter weglassen")
    ap.add_argument("--ref-px", type=int, default=1536, help="max. Kantenlänge der Referenzen")
    ap.add_argument("--size", default="1792x1024")  # natives 16:9 (gpt-image-2) -> kein großer Crop, Kopf bleibt drin
    ap.add_argument("--quality", default="high", choices=["low", "medium", "high"])
    a = ap.parse_args()

    prompt = a.prompt or (Path(a.prompt_file).read_text(encoding="utf-8") if a.prompt_file else None)
    if not prompt:
        sys.exit("FEHLER: --prompt oder --prompt-file nötig")
    key = load_key()

    files = []
    for i, r in enumerate(a.ref):
        if not Path(r).exists():
            sys.exit(f"FEHLER: Referenzbild fehlt: {r}")
        files.append(("image[]", (f"ref{i}.png", prep_ref(r, a.ref_px), "image/png")))

    data = {"model": a.model, "prompt": prompt, "size": a.size, "quality": a.quality, "n": "1"}
    if a.fidelity != "none" and files:
        data["input_fidelity"] = a.fidelity
    if files:
        print(f"[{a.model} edits] {len(files)} Refs @≤{a.ref_px}px, fidelity={data.get('input_fidelity','-')}, "
              f"size={a.size}, q={a.quality} ...", file=sys.stderr)
        r = requests.post("https://api.openai.com/v1/images/edits",
                          headers={"Authorization": f"Bearer {key}"}, files=files, data=data, timeout=600)
    else:
        # Keine Referenz (z. B. Konzept-/Blog-Bilder ohne Likeness) -> reine Text-zu-Bild-Generierung.
        print(f"[{a.model} generations] 0 Refs, size={a.size}, q={a.quality} ...", file=sys.stderr)
        jdata = {**data, "n": 1}  # JSON-Endpoint erwartet n als Integer (multipart nur String)
        r = requests.post("https://api.openai.com/v1/images/generations",
                          headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                          json=jdata, timeout=600)
    if r.status_code != 200:
        sys.exit(f"OpenAI API error {r.status_code}: {r.text[:900]}")
    img = Image.open(BytesIO(base64.b64decode(r.json()["data"][0]["b64_json"]))).convert("RGB")

    img = crop_16x9(img)
    if a.skyline and Path(a.skyline).exists():
        img = composite_skyline(img, a.skyline)
        print(f"  + Skyline einkomponiert", file=sys.stderr)
    if a.logo and Path(a.logo).exists():
        img = composite_logo(img, a.logo)
        print(f"  + Logo exakt einkomponiert", file=sys.stderr)
    Path(a.output).parent.mkdir(parents=True, exist_ok=True)
    img.save(a.output, "PNG")
    print(f"OK -> {a.output} (1280x720)", file=sys.stderr)


if __name__ == "__main__":
    main()
