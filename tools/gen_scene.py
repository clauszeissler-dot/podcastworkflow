#!/usr/bin/env python3
"""gen_scene.py — KI AffAIrs Imagery: Szene mit Personen- UND Marken-Referenz via Gemini Image.

--ref   : Referenzbild(er) der realen Person (Claus) -> wird als LIKENESS behandelt.
--brand : Referenzbild des KI-AffAIrs-Logos (Hexagon mit 'KI') -> wird als Marken-Emblem behandelt.
Beide optional, beide mehrfach moeglich.

Aufruf:
  python gen_scene.py --output out.png --ref headshot.jpg --brand logo.png \
      --prompt "Wide 16:9 cinematic scene ... display the KI AffAIrs hexagon on the shield ..."

GOOGLE_AI_KEY wird aus der api_keys.env im 'Bild Skill'-Ordner gelesen.
"""
import argparse
import base64
import sys
from pathlib import Path

import requests

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

KEY_CANDIDATES = [
    Path.home() / "OneDrive" / "Dokumente" / "Claude" / "Projects" / "Bild Skill" / "api_keys.env",
    Path.home() / "OneDrive" / "Documents" / "Claude" / "Projects" / "Bild Skill" / "api_keys.env",
    Path.home() / "OneDrive" / "Claude" / "Projects" / "Bild Skill" / "api_keys.env",
]
MIME = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}


def load_key(name="GOOGLE_AI_KEY"):
    for p in KEY_CANDIDATES:
        if p.exists():
            for line in p.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                if k.strip() == name:
                    return v.strip().strip('"').strip("'")
    sys.exit(f"FEHLER: {name} nicht gefunden in: {[str(p) for p in KEY_CANDIDATES]}")


def inline_part(path_str):
    rp = Path(path_str)
    if not rp.exists():
        sys.exit(f"FEHLER: Referenzbild fehlt: {rp}")
    b64 = base64.b64encode(rp.read_bytes()).decode("ascii")
    return {"inlineData": {"mimeType": MIME.get(rp.suffix.lower(), "image/png"), "data": b64}}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--output", required=True)
    ap.add_argument("--ref", action="append", default=[], help="Personen-Referenz (Likeness Claus)")
    ap.add_argument("--brand", action="append", default=[], help="Marken-Referenz (KI-AffAIrs-Logo)")
    args = ap.parse_args()

    key = load_key()
    parts = []
    for r in args.ref:
        parts.append(inline_part(r))
    for b in args.brand:
        parts.append(inline_part(b))

    instr = ""
    if args.ref:
        instr += (
            f"The first {len(args.ref)} attached image(s) are the EXACT likeness of the real man named "
            "Claus who appears in the scene: same face, same hairstyle, same identity, photorealistic, "
            "never a robot, never caricatured. "
        )
    if args.brand:
        pos = "next" if args.ref else "attached"
        instr += (
            f"The {pos} {len(args.brand)} image(s) show the KI AffAIrs brand logo: a hexagonal emblem "
            "with the letters 'KI' inside it in cyan-teal and orange. Reproduce this hexagonal KI emblem "
            "as a small, tasteful, glowing brand mark exactly where the prompt says (keep the letters 'KI' "
            "legible inside the hexagon, do not distort, never as a giant billboard). "
        )
    if instr:
        instr += "Now follow the scene prompt:\n\n"

    parts.append({"text": instr + args.prompt})

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-3.1-flash-image-preview:generateContent?key={key}"
    )
    body = {"contents": [{"parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "temperature": 1.0}}

    print(f"[gen_scene] person-refs={len(args.ref)} brand-refs={len(args.brand)} -> {args.output}")
    r = requests.post(url, json=body, timeout=180)
    if not r.ok:
        sys.exit(f"Gemini API error {r.status_code}: {r.text[:600]}")

    data = r.json()
    cps = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    img = next((p for p in cps if "inlineData" in p or "inline_data" in p), None)
    if not img:
        sys.exit(f"Gemini: keine Bilddaten. {str(data)[:600]}")
    inline = img.get("inlineData") or img.get("inline_data")
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(base64.b64decode(inline["data"]))
    print(f"OK saved {out} ({out.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
