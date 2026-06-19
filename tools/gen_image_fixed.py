#!/usr/bin/env python3
"""
gen_image.py — KI AffAIrs Imagery Skill, Direct-API-Image-Generation.

Erzeugt ein Bild direkt über die Image-Generation-API des gewählten Anbieters.
Den Prompt baut der Cowork-Skill (also Claude) und übergibt ihn diesem Skript.
LEARNINGS.md wurde vorher von Claude gelesen und ist im Prompt eingeflossen.

Generatoren:
  - nano_banana   : Google Gemini 3.1 Flash Image (Logo-Reference unterstützt)
  - gpt_image     : OpenAI gpt-image-2 (höhere Texttreue, keine Logo-Reference)

Verwendung:
  python gen_image.py \\
      --generator nano_banana \\
      --prompt "A dystopian cyberpunk..." \\
      --aspect 16:9 \\
      --logo /path/to/logo.png \\
      --output /path/to/out.png

Abhängigkeiten:
  pip install requests pillow --break-system-packages

API-Keys werden aus der Datei "api_keys.env" im selben Verzeichnis gelesen.
Falls eine ".api_keys.env" im Workspace-Ordner existiert, hat die Vorrang.
"""

import argparse
import base64
import os
import sys
from pathlib import Path

import requests
from PIL import Image
from io import BytesIO


# =============================================================================
# Helper — API-Keys aus .env-Datei lesen
# =============================================================================

def load_keys():
    """
    Lade Keys aus api_keys.env. Sucht in folgender Reihenfolge:
      1. $KI_AFFAIRS_WORKSPACE/api_keys.env (oder .api_keys.env)
      2. Cowork-Workspace-Mount via $COWORK_WORKSPACE
      3. Häufige Standard-Workspace-Pfade (OneDrive Dokumente/Documents)
      4. Aktuelles Arbeitsverzeichnis (cwd)
      5. Skill-Asset-Pfad (Fallback)

    Das deckt sowohl direkten CLI-Aufruf als auch Aufruf aus verschiedenen
    Cowork-Sessions ab, ohne dass eine Env-Var gesetzt werden muss.
    """
    here = Path(__file__).parent.resolve()
    candidates = []

    def add(folder):
        if folder:
            folder = Path(folder)
            candidates.append(folder / "api_keys.env")
            candidates.append(folder / ".api_keys.env")

    # 1. Explizit gesetzter Workspace
    add(os.environ.get("KI_AFFAIRS_WORKSPACE"))
    add(os.environ.get("COWORK_WORKSPACE"))

    # 2. Häufige Standard-Workspaces (Claus-Setup)
    home = Path.home()
    add(home / "OneDrive" / "Dokumente" / "Claude" / "Projects" / "Bild Skill")
    add(home / "OneDrive" / "Documents" / "Claude" / "Projects" / "Bild Skill")
    add(home / "Dokumente" / "Claude" / "Projects" / "Bild Skill")
    add(home / "Documents" / "Claude" / "Projects" / "Bild Skill")

    # 3. Cowork-Mount-Pfade im Sandbox (Linux VM)
    for mnt_pattern in [
        "/sessions/*/mnt/Bild Skill",
        "/sessions/*/mnt/Bild_Skill",
    ]:
        import glob
        for path in glob.glob(mnt_pattern):
            add(path)

    # 4. Aktuelles Arbeitsverzeichnis
    add(Path.cwd())

    # 5. Skill-Asset-Pfad (Fallback)
    add(here)

    keys = {}
    src = None
    for path in candidates:
        if path.exists():
            for line in path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    k, v = line.split("=", 1)
                    keys[k.strip()] = v.strip().strip('"').strip("'")
            src = path
            break

    return keys, src


def require_key(keys, name, generator):
    val = keys.get(name, "").strip()
    if not val:
        sys.exit(
            f"\nFEHLER: API-Key '{name}' nicht gesetzt — wird für "
            f"Generator '{generator}' gebraucht.\n\n"
            f"Lösung: Datei 'api_keys.example.env' im Skill-Asset-Verzeichnis\n"
            f"umbenennen zu 'api_keys.env' und {name} eintragen.\n\n"
            f"Anleitung siehe Kommentare in api_keys.example.env.\n"
        )
    return val


# =============================================================================
# Generator 1 — Nano Banana 2 (Google Gemini 3.1 Flash Image)
# =============================================================================

def gen_nano_banana(prompt: str, output: Path, logo: Path | None, api_key: str):
    """
    Ruft Gemini 3.1 Flash Image API.
    Logo-Reference: optional, als zweites Image im 'parts'-Array.
    Aspect Ratio: wird per Prompt-Hint und/oder generationConfig gesteuert.
    """
    print(f"[Nano Banana 2] Generating image (logo reference: {bool(logo)})…")

    parts = []
    if logo and logo.exists():
        logo_b64 = base64.b64encode(logo.read_bytes()).decode("ascii")
        parts.append({
            "inlineData": {
                "mimeType": "image/png",
                "data": logo_b64,
            }
        })
        instruction = (
            "Use the attached image as the reference for the KI AffAIrs brand "
            "logo. Place the logo small, distant, and unobtrusive in the scene "
            "as described in the prompt below. Do NOT spell out the wordmark "
            "as readable text — let the reference image speak for itself.\n\n"
        )
    else:
        instruction = ""

    parts.append({"text": instruction + prompt})

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-3.1-flash-image-preview:generateContent?key={api_key}"
    )
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "temperature": 1.0,
        },
    }

    r = requests.post(url, json=body, timeout=120)
    if not r.ok:
        sys.exit(f"Gemini API error {r.status_code}: {r.text[:500]}")

    data = r.json()
    cand_parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    img_part = next(
        (p for p in cand_parts if "inlineData" in p or "inline_data" in p),
        None,
    )
    if not img_part:
        sys.exit(f"Gemini: Keine Bilddaten in der Antwort. Full response: {data}")

    inline = img_part.get("inlineData") or img_part.get("inline_data")
    img_bytes = base64.b64decode(inline["data"])
    output.write_bytes(img_bytes)
    print(f"✓ Saved: {output}  ({output.stat().st_size / 1024:.1f} KB)")


# =============================================================================
# Generator 2 — gpt-image-2 (OpenAI)
# =============================================================================

SIZES_GPT = {
    "16:9": "1536x1024",
    "1:1": "1024x1024",
    "9:16": "864x1536",
    "4:5": "1024x1280",
}

def gen_gpt_image(prompt: str, output: Path, aspect: str, quality: str, api_key: str):
    """
    Ruft OpenAI gpt-image-2.
    Keine Logo-Reference — Brand wird per textfreier Hinweis (Hexagon-Form +
    Farbschema) in den Prompt eingebaut (Skill-Logik, nicht hier).
    """
    size = SIZES_GPT.get(aspect, "1024x1024")
    print(f"[gpt-image-2] Generating image (size {size}, quality {quality})…")

    url = "https://api.openai.com/v1/images/generations"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    body = {
        "model": "gpt-image-2",
        "prompt": prompt,
        "size": size,
        "quality": quality,
        "n": 1,
    }

    r = requests.post(url, headers=headers, json=body, timeout=120)
    if not r.ok:
        sys.exit(f"OpenAI API error {r.status_code}: {r.text[:500]}")

    data = r.json()
    b64 = data.get("data", [{}])[0].get("b64_json")
    if not b64:
        sys.exit(f"OpenAI: Keine Bilddaten in der Antwort. Full response: {data}")

    img_bytes = base64.b64decode(b64)
    output.write_bytes(img_bytes)
    print(f"✓ Saved: {output}  ({output.stat().st_size / 1024:.1f} KB)")


# =============================================================================
# Main
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--generator", required=True, choices=["nano_banana", "gpt_image"])
    parser.add_argument("--prompt", required=True, help="Vollständiger Englischer Bild-Prompt (vom Skill gebaut)")
    parser.add_argument("--aspect", default="16:9", choices=list(SIZES_GPT.keys()))
    parser.add_argument("--logo", default=None, help="Pfad zum Brand-Logo (nur Nano Banana)")
    parser.add_argument("--quality", default="standard", choices=["standard", "high"], help="Nur gpt-image-2")
    parser.add