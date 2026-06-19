#!/usr/bin/env python3
"""
=============================================================================
AI Video Producer - Grok Imagine API (xAI)
=============================================================================
Erstellt aus einem Blog-Skript automatisch ein YouTube Short Video.

Workflow:
1. Szenen-Definitionen mit optimierten Video-Prompts (Englisch)
2. Parallele Video-Generierung via xAI Grok Imagine API
3. Automatischer Zusammenschnitt via ffmpeg

Voraussetzungen:
- pip install xai-sdk --break-system-packages
- export XAI_API_KEY="dein-api-key"
- ffmpeg muss installiert sein

Autor: KI Affairs Consulting
=============================================================================
"""

import asyncio
import os
import sys
import time
import subprocess
import httpx
from pathlib import Path
from datetime import timedelta
from dataclasses import dataclass, field
from typing import Optional

# ============================================================================
# KONFIGURATION
# ============================================================================

OUTPUT_DIR = Path("./video_output")
CLIPS_DIR = OUTPUT_DIR / "clips"
FINAL_OUTPUT = OUTPUT_DIR / "final_video.mp4"

# Grok Imagine Video Einstellungen
MODEL = "grok-imagine-video"
RESOLUTION = "720p"
ASPECT_RATIO = "9:16"  # YouTube Shorts / Vertical
DEFAULT_DURATION = 10   # Sekunden pro Clip (Max 15)

# API Polling
POLL_INTERVAL = 5       # Sekunden zwischen Status-Checks
POLL_TIMEOUT = 600      # Max 10 Minuten pro Video

# Parallelität: Wie viele Videos gleichzeitig generieren
MAX_CONCURRENT = 3


# ============================================================================
# SZENEN-DEFINITIONEN
# ============================================================================
# Jede Szene: max 10 Sekunden Video
# Prompt-Struktur: [Camera] + [Subject/Action] + [Environment] + [Style/Mood]
#
# Cinematographie-Prinzipien:
# - Establishing shots für Kontext
# - Medium shots für Erklärungen
# - Close-ups für emotionale Beats
# - Dynamische Kamerabewegungen für Energie
# - Konsistenter visueller Stil: dark tech, cinematic, moody lighting
# ============================================================================

@dataclass
class Scene:
    """Eine Video-Szene mit Prompt und Metadaten."""
    id: int
    title: str           # Szenen-Titel (intern)
    prompt: str           # Englischer Video-Prompt für Grok Imagine
    duration: int = 10    # Dauer in Sekunden (1-15)
    text_overlay: str = ""  # Optionaler Text fürs Overlay (deutsch)
    section: str = ""     # Blog-Abschnitt


SCENES = [
    # =========================================================================
    # HOOK / INTRO (0:00 - 0:20)
    # =========================================================================
    Scene(
        id=1,
        title="Hook - Fossile Architekturen",
        section="Hook",
        duration=10,
        prompt=(
            "Slow dolly forward through a dark, abandoned server room with "
            "flickering fluorescent lights. Dusty old mainframe computers line "
            "the walls, cables tangled and fraying. Atmosphere of technological "
            "decay. Cinematic lighting with volumetric fog, cool blue and amber "
            "tones. 4K quality, shallow depth of field, film grain."
        ),
        text_overlay="Wir ruhen uns auf Architekturen aus, die im Kern fossil sind.",
    ),
    Scene(
        id=2,
        title="Hook - Hardware-Transformation",
        section="Hook",
        duration=10,
        prompt=(
            "Dramatic crane shot rising from ground level, revealing a massive "
            "futuristic data center at night. Glowing LED panels, holographic "
            "displays, and autonomous robots moving between server racks. "
            "Neon blue and electric purple lighting reflecting on glossy floors. "
            "Cinematic, epic scale, wide angle lens, moody atmosphere."
        ),
        text_overlay="Die Hardware-Welt transformiert sich in Lichtgeschwindigkeit.",
    ),

    # =========================================================================
    # MOORES LAW (0:20 - 0:50)
    # =========================================================================
    Scene(
        id=3,
        title="Moores Law - Debatte",
        section="Moores Law",
        duration=10,
        prompt=(
            "Split-screen composition: on the left side, a corporate boardroom "
            "with an older executive clinging to printed charts showing upward "
            "curves. On the right, a modern tech lab with holographic declining "
            "graphs. Dramatic side lighting, cinematic color grading with warm "
            "amber left and cold blue right. Medium shot, static camera, "
            "tension and contrast."
        ),
        text_overlay="Intel klammert sich an Moores Law. Nvidia hat es für tot erklärt.",
    ),
    Scene(
        id=4,
        title="Moores Law - Transistor-Kosten",
        section="Moores Law",
        duration=10,
        prompt=(
            "Extreme close-up macro shot of a silicon wafer being manufactured "
            "in a semiconductor cleanroom. Intricate circuit patterns visible "
            "under harsh UV lighting. Slow tracking shot across the wafer surface. "
            "Ultra-detailed, scientific precision, cool white and blue tones, "
            "shallow depth of field. Factory robots in background out of focus."
        ),
        text_overlay="Ein 5nm-Node kostet 500 Millionen Dollar.",
    ),
    Scene(
        id=5,
        title="Moores Law - Intensivstation",
        section="Moores Law",
        duration=10,
        prompt=(
            "Conceptual scene: a giant glowing microchip lying on a hospital bed "
            "in an ICU room, connected to monitors showing flatline-like graphs. "
            "Medical equipment and IV drips surround it. Dramatic low-key lighting, "
            "green and blue monitor glow in a dark room. Eye-level medium shot, "
            "slow zoom in. Surreal but photorealistic, cinematic mood."
        ),
        text_overlay="Moores Law liegt schwer verwundet auf der Intensivstation.",
    ),

    # =========================================================================
    # NEUROMORPHIC COMPUTING (0:50 - 1:20)
    # =========================================================================
    Scene(
        id=6,
        title="SNNs - Gehirn vs Maschine",
        section="Neuromorphic Computing",
        duration=10,
        prompt=(
            "Split visual: left side shows a glowing, pulsing human brain with "
            "visible neural pathways firing electrical signals in warm golden "
            "light. Right side shows a rigid circuit board with harsh geometric "
            "patterns in cold blue. Slow morph transition between both. "
            "Dark background, volumetric lighting, macro perspective, "
            "cinematic quality, shallow depth of field."
        ),
        text_overlay="Das Gehirn zeigt, wie Effizienz wirklich geht.",
    ),
    Scene(
        id=7,
        title="SNNs - Spiking Neural Networks",
        section="Neuromorphic Computing",
        duration=10,
        prompt=(
            "Abstract visualization of neural spikes traveling through a 3D "
            "network of glowing nodes. Pulses of light cascade through pathways "
            "in rapid succession, some paths lighting up and others staying dark. "
            "Deep space-like dark background with bioluminescent colors: cyan, "
            "magenta, gold. Slow camera orbit around the network. "
            "Futuristic, scientific visualization style."
        ),
        text_overlay="Spiking Neural Networks: 5,6x weniger Energie, doppelt so robust.",
    ),
    Scene(
        id=8,
        title="SNNs - Adversarial Attack",
        section="Neuromorphic Computing",
        duration=10,
        prompt=(
            "POV shot from inside an autonomous car. Through the windshield, "
            "a road scene with a stop sign that glitches and distorts like a "
            "corrupted digital image. Red warning indicators flash on the "
            "dashboard HUD display. Dramatic, tense atmosphere. Night scene "
            "with rain on windshield, headlights illuminating the road. "
            "Cinematic, high tension, film noir lighting."
        ),
        text_overlay="Adversarial Attacks: Das System erkennt den Baum nicht mehr.",
    ),

    # =========================================================================
    # QUANTENCOMPUTING (1:20 - 1:50)
    # =========================================================================
    Scene(
        id=9,
        title="Quantum - Photonische Architektur",
        section="Quantencomputing",
        duration=10,
        prompt=(
            "Sweeping dolly shot through a futuristic photonic quantum computer "
            "facility. Beams of colorful laser light travel through transparent "
            "optical waveguides on pristine silicon chips. No bulky cooling "
            "equipment visible. Clean, bright laboratory environment with "
            "white surfaces and prismatic light reflections. "
            "Wide angle, cinematic, awe-inspiring scale."
        ),
        text_overlay="Photonisches Quantencomputing bei Raumtemperatur.",
    ),
    Scene(
        id=10,
        title="Quantum - Switchless",
        section="Quantencomputing",
        duration=10,
        prompt=(
            "Close-up tracking shot of light particles traveling through "
            "a transparent optical chip. No mechanical switches visible. "
            "Pure passive components guide photons through channels. "
            "Ethereal glow, prismatic color spectrum, rainbow refractions "
            "on surfaces. Dark background with the chip as sole light source. "
            "Ultra-clean, minimalist, scientific beauty. Shallow depth of field."
        ),
        text_overlay="Switchless: Weniger Fehlerquellen, Millionen von Qubits.",
    ),

    # =========================================================================
    # EFTQC (1:50 - 2:00)
    # =========================================================================
    Scene(
        id=11,
        title="EFTQC - Im Dreck der Realität",
        section="EFTQC",
        duration=10,
        prompt=(
            "Dramatic low angle shot of a quantum computer circuit board being "
            "assembled in a gritty, industrial workshop setting - not a sterile "
            "lab. Sparks, tools, and coffee cups nearby. Raw, real-world "
            "engineering atmosphere. Warm tungsten workshop lighting mixed with "
            "cool blue from holographic diagnostic displays. "
            "Cinematic, handheld feel, slight camera movement. Gritty realism."
        ),
        text_overlay="Lösungen, die jetzt im Dreck der Realität funktionieren.",
    ),

    # =========================================================================
    # CHECKLISTE / ZUSAMMENFASSUNG (2:00 - 2:20)
    # =========================================================================
    Scene(
        id=12,
        title="Checkliste - Action Items",
        section="Zusammenfassung",
        duration=10,
        prompt=(
            "Bird's eye view of a modern executive desk. A hand places glowing "
            "holographic checklist items onto the surface one by one. Each item "
            "illuminates as it's placed. Clean, professional environment. "
            "Warm ambient lighting from desk lamp, cool blue glow from "
            "holographic elements. Overhead static camera, objects appearing "
            "in sequence. Premium, corporate-futuristic aesthetic."
        ),
        text_overlay="Die Macher-Checkliste für die nächste Dekade.",
    ),

    # =========================================================================
    # ABSCHLUSS / CTA (2:20 - 2:30)
    # =========================================================================
    Scene(
        id=13,
        title="Outro - Forward Looking",
        section="Abschluss",
        duration=10,
        prompt=(
            "Epic crane shot rising from a single person standing at a "
            "crossroads, pulling back to reveal two paths: one leading to a "
            "decaying old factory, the other to a gleaming futuristic city "
            "skyline on the horizon. Golden hour sunset lighting. The person "
            "faces the futuristic path. Cinematic wide angle, dramatic scale, "
            "inspirational mood, warm and cool tones contrasting."
        ),
        text_overlay="Die nächsten 5 Jahre gehören den intelligenten Architekturen.",
    ),
]


# ============================================================================
# VIDEO-GENERIERUNG
# ============================================================================

async def generate_single_video(
    scene: Scene,
    api_key: str,
    semaphore: asyncio.Semaphore,
) -> Optional[Path]:
    """Generiert ein einzelnes Video über die Grok Imagine API."""
    
    async with semaphore:
        output_path = CLIPS_DIR / f"scene_{scene.id:02d}.mp4"
        
        if output_path.exists():
            print(f"  [✓] Szene {scene.id} bereits vorhanden, überspringe.")
            return output_path
        
        print(f"  [→] Szene {scene.id}: {scene.title}")
        print(f"      Prompt: {scene.prompt[:80]}...")
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        }
        
        payload = {
            "model": MODEL,
            "prompt": scene.prompt,
            "duration": scene.duration,
            "aspect_ratio": ASPECT_RATIO,
            "resolution": RESOLUTION,
        }
        
        async with httpx.AsyncClient(timeout=30) as client:
            # Step 1: Starte Generierung
            try:
                resp = await client.post(
                    "https://api.x.ai/v1/videos/generations",
                    headers=headers,
                    json=payload,
                )
                resp.raise_for_status()
                request_id = resp.json()["request_id"]
                print(f"      Request ID: {request_id}")
            except Exception as e:
                print(f"  [✗] Szene {scene.id} - Fehler beim Start: {e}")
                return None
            
            # Step 2: Poll für Ergebnis
            start_time = time.time()
            while True:
                elapsed = time.time() - start_time
                if elapsed > POLL_TIMEOUT:
                    print(f"  [✗] Szene {scene.id} - Timeout nach {POLL_TIMEOUT}s")
                    return None
                
                await asyncio.sleep(POLL_INTERVAL)
                
                try:
                    status_resp = await client.get(
                        f"https://api.x.ai/v1/videos/{request_id}",
                        headers=headers,
                    )
                    status_resp.raise_for_status()
                    data = status_resp.json()
                except Exception as e:
                    print(f"      Polling-Fehler: {e}, versuche erneut...")
                    continue
                
                status = data.get("status", "")
                has_video = "video" in data and "url" in data.get("video", {})

                if has_video:
                    # API returns video object directly when done (HTTP 200, no status field)
                    video_url = data["video"]["url"]
                    duration = data["video"].get("duration", "?")
                    print(f"  [✓] Szene {scene.id} fertig! ({duration}s, {elapsed:.0f}s Wartezeit)")

                    # Video herunterladen
                    try:
                        dl_resp = await client.get(video_url, timeout=120)
                        dl_resp.raise_for_status()
                        output_path.write_bytes(dl_resp.content)
                        print(f"      Gespeichert: {output_path}")
                        return output_path
                    except Exception as e:
                        print(f"  [✗] Szene {scene.id} - Download-Fehler: {e}")
                        return None

                elif status == "done":
                    # Alternative: some responses may use status field
                    video_url = data.get("video", {}).get("url", "")
                    if video_url:
                        duration = data.get("video", {}).get("duration", "?")
                        print(f"  [✓] Szene {scene.id} fertig! ({duration}s, {elapsed:.0f}s Wartezeit)")
                        try:
                            dl_resp = await client.get(video_url, timeout=120)
                            dl_resp.raise_for_status()
                            output_path.write_bytes(dl_resp.content)
                            print(f"      Gespeichert: {output_path}")
                            return output_path
                        except Exception as e:
                            print(f"  [✗] Szene {scene.id} - Download-Fehler: {e}")
                            return None

                elif status in ("expired", "failed"):
                    print(f"  [✗] Szene {scene.id} - Request {status}")
                    return None

                elif status == "pending":
                    mins = int(elapsed // 60)
                    secs = int(elapsed % 60)
                    print(f"      Szene {scene.id} verarbeitet... ({mins}:{secs:02d})")

                else:
                    # Log full response for debugging unknown states
                    print(f"      Szene {scene.id} - Status: '{status}', Keys: {list(data.keys())}")


async def generate_all_videos(api_key: str) -> list[Path]:
    """Generiert alle Szenen-Videos parallel (mit Limit)."""
    
    print("\n" + "=" * 70)
    print("PHASE 1: VIDEO-GENERIERUNG via Grok Imagine API")
    print("=" * 70)
    print(f"  Szenen: {len(SCENES)}")
    print(f"  Parallele Requests: {MAX_CONCURRENT}")
    print(f"  Auflösung: {RESOLUTION} ({ASPECT_RATIO})")
    print(f"  Modell: {MODEL}")
    print()
    
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    
    tasks = [
        generate_single_video(scene, api_key, semaphore)
        for scene in SCENES
    ]
    
    results = await asyncio.gather(*tasks)
    
    # Filtere erfolgreiche Videos
    successful = [p for p in results if p is not None]
    failed = len(results) - len(successful)
    
    print(f"\n  Ergebnis: {len(successful)}/{len(SCENES)} Videos generiert")
    if failed:
        print(f"  ⚠ {failed} Videos fehlgeschlagen")
    
    return successful


# ============================================================================
# VIDEO-ZUSAMMENSCHNITT (ffmpeg)
# ============================================================================

def stitch_videos(clip_paths: list[Path]) -> Path:
    """Schneidet alle Clips zu einem Video zusammen."""
    
    print("\n" + "=" * 70)
    print("PHASE 2: VIDEO-ZUSAMMENSCHNITT via ffmpeg")
    print("=" * 70)
    
    if not clip_paths:
        print("  Keine Clips zum Zusammenschneiden!")
        sys.exit(1)
    
    # Sortiere nach Szenen-Nummer
    clip_paths.sort(key=lambda p: p.name)
    
    # Erstelle ffmpeg concat-Datei
    concat_file = OUTPUT_DIR / "concat_list.txt"
    with open(concat_file, "w") as f:
        for clip in clip_paths:
            f.write(f"file '{clip.resolve()}'\n")
    
    print(f"  Clips: {len(clip_paths)}")
    for cp in clip_paths:
        print(f"    → {cp.name}")
    
    # -------------------------------------------------------------------------
    # Schritt 1: Alle Clips normalisieren (gleiche Codecs, Framerate, Größe)
    # -------------------------------------------------------------------------
    print("\n  [1/3] Normalisiere Clips...")
    normalized_dir = OUTPUT_DIR / "normalized"
    normalized_dir.mkdir(exist_ok=True)
    
    normalized_paths = []
    for clip in clip_paths:
        norm_path = normalized_dir / clip.name
        cmd = [
            "ffmpeg", "-y", "-i", str(clip),
            "-vf", "scale=720:1280:force_original_aspect_ratio=decrease,"
                   "pad=720:1280:(ow-iw)/2:(oh-ih)/2:black",
            "-r", "30",
            "-c:v", "libx264", "-preset", "medium", "-crf", "23",
            "-c:a", "aac", "-b:a", "128k", "-ar", "44100",
            "-shortest",
            str(norm_path),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            normalized_paths.append(norm_path)
            print(f"    ✓ {clip.name}")
        else:
            print(f"    ✗ {clip.name}: {result.stderr[:200]}")
    
    # -------------------------------------------------------------------------
    # Schritt 2: Concat-Datei für normalisierte Clips
    # -------------------------------------------------------------------------
    print("\n  [2/3] Erstelle Concat-Liste...")
    norm_concat = OUTPUT_DIR / "norm_concat.txt"
    with open(norm_concat, "w") as f:
        for np in normalized_paths:
            f.write(f"file '{np.resolve()}'\n")
    
    # -------------------------------------------------------------------------
    # Schritt 3: Zusammenschnitt mit Crossfade-Übergängen
    # -------------------------------------------------------------------------
    print("\n  [3/3] Schneide Videos zusammen...")
    
    if len(normalized_paths) < 2:
        # Nur ein Clip - einfach kopieren
        subprocess.run([
            "ffmpeg", "-y", "-i", str(normalized_paths[0]),
            "-c", "copy", str(FINAL_OUTPUT),
        ], capture_output=True)
    else:
        # Einfacher Concat (zuverlässigster Ansatz)
        cmd = [
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0",
            "-i", str(norm_concat),
            "-c:v", "libx264", "-preset", "medium", "-crf", "21",
            "-c:a", "aac", "-b:a", "128k",
            "-movflags", "+faststart",
            str(FINAL_OUTPUT),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"  ✗ Fehler beim Zusammenschnitt: {result.stderr[:300]}")
            sys.exit(1)
    
    # Video-Info ausgeben
    probe_cmd = [
        "ffprobe", "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        str(FINAL_OUTPUT),
    ]
    probe_result = subprocess.run(probe_cmd, capture_output=True, text=True)
    
    duration_str = "unbekannt"
    size_str = "unbekannt"
    if probe_result.returncode == 0:
        import json
        info = json.loads(probe_result.stdout)
        dur = float(info.get("format", {}).get("duration", 0))
        size = int(info.get("format", {}).get("size", 0))
        duration_str = f"{int(dur // 60)}:{int(dur % 60):02d}"
        size_str = f"{size / 1024 / 1024:.1f} MB"
    
    print(f"\n  ✓ FERTIG!")
    print(f"    Datei:  {FINAL_OUTPUT}")
    print(f"    Dauer:  {duration_str}")
    print(f"    Größe:  {size_str}")
    
    return FINAL_OUTPUT


# ============================================================================
# TEXT-OVERLAY SKRIPT (Optional - für nachträgliche Untertitelung)
# ============================================================================

def generate_overlay_script() -> Path:
    """Generiert ein ffmpeg-Overlay-Skript für Text-Einblendungen."""
    
    script_path = OUTPUT_DIR / "add_overlays.sh"
    
    lines = ["#!/bin/bash", "# Text-Overlay Skript (optional)", ""]
    lines.append(f'INPUT="{FINAL_OUTPUT}"')
    lines.append(f'OUTPUT="{OUTPUT_DIR / "final_with_text.mp4"}"')
    lines.append("")
    
    # Berechne Zeitstempel pro Szene
    current_time = 0
    drawtext_filters = []
    
    for scene in SCENES:
        if scene.text_overlay:
            start = current_time
            end = current_time + scene.duration
            # Escape-Sonderzeichen für ffmpeg drawtext
            text = scene.text_overlay.replace("'", "\\'").replace(":", "\\:")
            drawtext_filters.append(
                f"drawtext=text='{text}'"
                f":fontsize=28:fontcolor=white:borderw=2:bordercolor=black"
                f":x=(w-text_w)/2:y=h-100"
                f":enable='between(t,{start},{end})'"
            )
        current_time += scene.duration
    
    if drawtext_filters:
        vf = ",".join(drawtext_filters)
        lines.append(f'ffmpeg -y -i "$INPUT" -vf "{vf}" \\')
        lines.append('  -c:v libx264 -preset medium -crf 21 \\')
        lines.append('  -c:a copy "$OUTPUT"')
    
    lines.append("")
    lines.append('echo "Text-Overlays hinzugefügt: $OUTPUT"')
    
    script_path.write_text("\n".join(lines))
    os.chmod(script_path, 0o755)
    
    return script_path


# ============================================================================
# SZENEN-ÜBERSICHT
# ============================================================================

def print_scene_overview():
    """Gibt eine Übersicht aller Szenen aus."""
    
    print("\n" + "=" * 70)
    print("SZENEN-ÜBERSICHT")
    print("=" * 70)
    
    total_duration = 0
    current_section = ""
    
    for scene in SCENES:
        if scene.section != current_section:
            current_section = scene.section
            print(f"\n  ┌─ {current_section.upper()}")
        
        print(f"  │ Szene {scene.id:2d} │ {scene.duration:2d}s │ {scene.title}")
        if scene.text_overlay:
            print(f"  │          │     │ 📝 \"{scene.text_overlay[:60]}\"")
        total_duration += scene.duration
    
    print(f"\n  └─ GESAMT: {total_duration}s ({total_duration // 60}:{total_duration % 60:02d})")
    print(f"     Szenen: {len(SCENES)}")
    print(f"     Format: {ASPECT_RATIO} @ {RESOLUTION}")


# ============================================================================
# MAIN
# ============================================================================

async def main():
    """Hauptprogramm."""
    
    print("=" * 70)
    print("AI VIDEO PRODUCER - Grok Imagine API")
    print("Blog: Quanten-Sprünge, Hirn-Chips und das Märchen von Moores Ende")
    print("=" * 70)
    
    # Prüfe API Key
    api_key = os.environ.get("XAI_API_KEY")
    if not api_key:
        print("\n⚠ FEHLER: XAI_API_KEY nicht gesetzt!")
        print("  export XAI_API_KEY='dein-api-key'")
        print("\n  Zeige nur Szenen-Übersicht...\n")
        print_scene_overview()
        
        # Generiere trotzdem die Hilfsdateien
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        CLIPS_DIR.mkdir(parents=True, exist_ok=True)
        overlay_script = generate_overlay_script()
        
        print(f"\n  Overlay-Skript erstellt: {overlay_script}")
        print("\n  Setze deinen API-Key und starte erneut!")
        return
    
    # Erstelle Verzeichnisse
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    CLIPS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Szenen-Übersicht
    print_scene_overview()
    
    # Phase 1: Videos generieren
    clip_paths = await generate_all_videos(api_key)
    
    if not clip_paths:
        print("\n✗ Keine Videos generiert. Abbruch.")
        return
    
    # Phase 2: Zusammenschnitt
    final = stitch_videos(clip_paths)
    
    # Bonus: Overlay-Skript
    overlay_script = generate_overlay_script()
    
    print("\n" + "=" * 70)
    print("FERTIG!")
    print("=" * 70)
    print(f"  Video:          {final}")
    print(f"  Overlay-Skript: {overlay_script}")
    print(f"\n  Optional: Text-Overlays hinzufügen mit:")
    print(f"  bash {overlay_script}")


if __name__ == "__main__":
    asyncio.run(main())
