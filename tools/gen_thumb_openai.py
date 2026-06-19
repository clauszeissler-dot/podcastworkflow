#!/usr/bin/env python3
"""gen_thumb_openai.py — YouTube-Thumbnail (1280x720, 16:9) via OpenAI gpt-image-1 (edits)
mit Personen-Likeness (Claus) UND Marken-Referenz (KI-AffAIrs-Logo).

Anders als gen_image_fixed.py (reines Text-zu-Bild) nutzt dieses Skript den
/v1/images/edits-Endpoint und reicht echte Referenzbilder mit ein -> Likeness + Logo.

Aufruf:
  python gen_thumb_openai.py --prompt-file p.txt --output out.png \
      --ref "assets/000_PP-1.jpg" --ref "assets/001_PP-2.jpg" --ref "logo.png"

Key: OPENAI_API_KEY aus ~/Documents/Claude/Projects/Bild Skill/api_keys.env (Mac)
oder Umgebungsvariable OPENAI_API_KEY.
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

def load_key(name="OPENAI_API_KEY"):
    if os.environ.get(name):
        return os.environ[name]
    for p in KEY_CANDIDATES:
        if p.exists():
            for line in p.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line.startswith(name + "="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit(f"FEHLER: {name} nicht gefunden in {[str(p) for p in KEY_CANDIDATES]}")

def prep_ref(path, maxpx=1024):
    img = Image.open(path).convert("RGB")
    img.thumbnail((maxpx, maxpx), Image.LANCZOS)
    buf = BytesIO(); img.save(buf, "PNG"); buf.seek(0)
    return buf

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt-file")
    ap.add_argument("--prompt")
    ap.add_argument("--output", required=True)
    ap.add_argument("--ref", action="append", required=True, help="Referenzbild (mehrfach)")
    ap.add_argument("--size", default="1536x1024", help="OpenAI-Größe (landscape 1536x1024)")
    ap.add_argument("--quality", default="high", choices=["low", "medium", "high"])
    args = ap.parse_args()

    prompt = args.prompt or (Path(args.prompt_file).read_text(encoding="utf-8") if args.prompt_file else None)
    if not prompt:
        sys.exit("FEHLER: --prompt oder --prompt-file nötig")
    key = load_key()

    files = []
    for i, r in enumerate(args.ref):
        if not Path(r).exists():
            sys.exit(f"FEHLER: Referenzbild fehlt: {r}")
        files.append(("image[]", (f"ref{i}.png", prep_ref(r), "image/png")))

    data = {"model": "gpt-image-1", "prompt": prompt, "size": args.size,
            "quality": args.quality, "n": "1"}
    print(f"[gpt-image-1 edits] {len(files)} Referenzen, size={args.size}, quality={args.quality} ...", file=sys.stderr)
    r = requests.post("https://api.openai.com/v1/images/edits",
                      headers={"Authorization": f"Bearer {key}"},
                      files=files, data=data, timeout=400)
    if r.status_code != 200:
        sys.exit(f"OpenAI API error {r.status_code}: {r.text[:700]}")
    js = r.json()
    b64 = js["data"][0]["b64_json"]
    img = Image.open(BytesIO(base64.b64decode(b64))).convert("RGB")

    # 16:9 center-crop -> 1280x720 (YouTube-Thumbnail)
    w, h = img.size
    tr = 16 / 9
    if w / h > tr:
        nw = int(round(h * tr)); left = (w - nw) // 2; img = img.crop((left, 0, left + nw, h))
    else:
        nh = int(round(w / tr)); top = (h - nh) // 2; img = img.crop((0, top, w, top + nh))
    img = img.resize((1280, 720), Image.LANCZOS)
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    img.save(args.output, "PNG")
    print(f"OK -> {args.output} (1280x720)", file=sys.stderr)

if __name__ == "__main__":
    main()
