# AI Video Producer – Szenen-Breakdown & Anleitung

## Blog-Artikel → YouTube Short Video
**Artikel:** Quanten-Sprünge, Hirn-Chips und das Märchen von Moores Ende  
**Zielformat:** YouTube Short (9:16, 720p)  
**Zieldauer:** ~130 Sekunden (13 Szenen × 10s)  
**API:** xAI Grok Imagine Video (`grok-imagine-video`)

---

## Setup

### Voraussetzungen

```bash
# Python SDK
pip install xai-sdk httpx --break-system-packages

# ffmpeg (falls nicht vorhanden)
sudo apt install ffmpeg

# API Key setzen
export XAI_API_KEY="dein-xai-api-key"
```

### Starten

```bash
python video_producer.py
```

Das Skript:
1. Generiert 13 Video-Clips parallel über die Grok Imagine API
2. Normalisiert alle Clips auf einheitliches Format (720×1280, 30fps, H.264)
3. Schneidet alles per ffmpeg zu einem Video zusammen
4. Erstellt optional ein Overlay-Skript für deutsche Texteinblendungen

---

## Szenen-Übersicht

| # | Abschnitt | Dauer | Kamera / Stil | Inhalt |
|---|-----------|-------|---------------|--------|
| 1 | Hook | 10s | Slow dolly forward | Verlassener Serverraum, technologischer Verfall |
| 2 | Hook | 10s | Crane shot, aufsteigend | Futuristisches Rechenzentrum bei Nacht |
| 3 | Moores Law | 10s | Static, Split-Screen | Boardroom vs. Tech-Lab – Debatte Intel vs. Nvidia |
| 4 | Moores Law | 10s | Extreme Close-up, tracking | Silizium-Wafer-Fertigung im Reinraum |
| 5 | Moores Law | 10s | Medium shot, slow zoom | Microchip auf der Intensivstation (surreal) |
| 6 | Neuromorphic | 10s | Macro, split visual | Gehirn vs. Circuit Board – Morph-Übergang |
| 7 | Neuromorphic | 10s | Slow orbit | Abstrakte SNN-Visualisierung, Spike-Kaskaden |
| 8 | Neuromorphic | 10s | POV / First-person | Autonomes Fahren, glitchender Verkehrsschild |
| 9 | Quantum | 10s | Sweeping dolly | Photonisches Quantum-Labor, Laserlichtstrahlen |
| 10 | Quantum | 10s | Close-up tracking | Lichtpartikel in optischem Chip, switchless |
| 11 | EFTQC | 10s | Low angle, handheld | Quantum-Hardware in realer Werkstatt (gritty) |
| 12 | Zusammenfassung | 10s | Bird's eye, static | Holographische Checkliste auf Executive-Schreibtisch |
| 13 | Abschluss | 10s | Epic crane shot | Person am Scheideweg: alte Fabrik vs. Zukunftsstadt |

**Gesamtdauer: ~130 Sekunden** (2:10)

---

## Cinematographie-Konzept

### Visueller Stil (konsistent über alle Szenen)
- **Farbpalette:** Dunkelblau, Cyan, Amber, Electric Purple
- **Beleuchtung:** Cinematic, Low-Key, Volumetrischer Nebel
- **Ästhetik:** Dark-Tech meets Corporate-Futurismus
- **Qualität:** 4K-Look, Shallow Depth of Field, Film Grain

### Kamera-Strategien pro Abschnitt

| Abschnitt | Kamera-Prinzip | Warum |
|-----------|---------------|-------|
| Hook | Dolly + Crane | Energie aufbauen, Kontrast alt/neu |
| Moores Law | Static + Macro | Faktische Schwere, Details zeigen |
| Neuromorphic | Split + Orbit | Dualismus Natur/Technik visualisieren |
| Quantum | Sweeping + Tracking | Staunen, Faszination vermitteln |
| EFTQC | Handheld, Low Angle | Realismus, "Im Dreck"-Feeling |
| Zusammenfassung | Bird's Eye | Überblick, Ordnung, Action-Items |
| Abschluss | Epic Crane | Inspiration, Call-to-Action |

### Schnitt-Rhythmus
- **Hook (Szene 1-2):** Langsam → schneller werdend → Impact
- **Hauptteil (3-11):** Moderate Pace, jede Szene steht für sich
- **Outro (12-13):** Verlangsamen, epischer Abschluss

---

## Prompting Best Practices (angewandt)

Jeder Prompt folgt der Struktur:

```
[Camera Movement] + [Subject/Action] + [Environment] + [Lighting/Mood] + [Style]
```

### Beispiel (Szene 1):
```
Slow dolly forward           → Kamerabewegung
through a dark, abandoned    → Umgebung
server room                  → Subject
with flickering fluorescent  → Lichtdetails
lights. Dusty old mainframe  → Details
computers...                 
Cinematic lighting with      → Stil
volumetric fog, cool blue    
and amber tones. 4K quality, 
shallow depth of field,      → Technische Specs
film grain.
```

### Wichtige Regeln für Grok Imagine:
1. **Englische Prompts** liefern bessere Ergebnisse
2. **Eine Aktion pro Szene** – nicht zu viel reinpacken
3. **Kamerabegriffe** explizit nennen (dolly, crane, tracking, POV)
4. **Beleuchtung** immer beschreiben – ändert den Mood komplett
5. **Max 10s pro Clip** – optimaler Sweet Spot bei Grok
6. **Negative Prompts vermeiden** – nur beschreiben was man WILL

---

## Kosten-Schätzung

| Parameter | Wert |
|-----------|------|
| Clips | 13 |
| Dauer/Clip | 10s |
| Auflösung | 720p |
| Modell | grok-imagine-video |
| Geschätzte Kosten | ~$1-3 pro Video* |
| **Gesamt geschätzt** | **~$13-39** |

*Aktuelle Preise auf https://docs.x.ai/developers/models prüfen

---

## Nachbearbeitung (Optional)

### Text-Overlays hinzufügen
Das Skript generiert automatisch ein `add_overlays.sh`, das deutsche Untertitel per ffmpeg `drawtext` einblendet:

```bash
bash video_output/add_overlays.sh
```

### Musik/Voiceover hinzufügen
```bash
# Voiceover hinzufügen (separat aufgenommen)
ffmpeg -i final_video.mp4 -i voiceover.mp3 \
  -filter_complex "[0:a][1:a]amix=inputs=2:duration=longest" \
  -c:v copy final_with_voice.mp4

# Hintergrundmusik (leise)
ffmpeg -i final_video.mp4 -i bgmusic.mp3 \
  -filter_complex "[1:a]volume=0.15[bg];[0:a][bg]amix=inputs=2" \
  -c:v copy final_with_music.mp4
```

### Für YouTube Shorts optimieren
```bash
# Sicherstellen: 9:16, max 60s (oder 3min je nach Policy)
ffmpeg -i final_video.mp4 \
  -t 90 \
  -vf "scale=1080:1920" \
  -c:v libx264 -preset slow -crf 18 \
  -c:a aac -b:a 192k \
  youtube_short.mp4
```

---

## Anpassungen

### Andere Szenen-Längen
Im `video_producer.py` einfach `duration` pro Szene anpassen (1-15s möglich).

### Horizontales Format (16:9)
```python
ASPECT_RATIO = "16:9"
```
Und die ffmpeg-Normalisierung anpassen auf `1280:720`.

### Weniger/mehr Szenen
Einfach `SCENES`-Liste im Skript editieren. Szenen hinzufügen oder entfernen.
