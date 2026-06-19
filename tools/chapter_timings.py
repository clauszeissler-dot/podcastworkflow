#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Schaetzt Kapitel-Timestamps fuer eine Podcast-Deep-Dive-Folge.
Annahme: konstante Sprechrate -> Zeit ~ Zeichenposition / Gesamtzeichen * Audiodauer.
Anker = eindeutige Substrings aus dem (gestrippten) Transkript.
Rundet auf 15-Sekunden-Schritte. Erstes Kapitel immer 00:00.
"""
import sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

def fmt(sec):
    sec = int(round(sec / 15.0) * 15)
    return f"{sec // 60:02d}:{sec % 60:02d}"

def timings(path, duration, anchors):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    n = len(text)
    out = []
    for i, (sub, title) in enumerate(anchors):
        if i == 0:
            t = 0.0
        else:
            pos = text.find(sub)
            if pos < 0:
                out.append(f"  !! ANKER NICHT GEFUNDEN: {sub!r}")
                continue
            t = pos / n * duration
        out.append(f"{fmt(t)} {title}")
    return out

BASE = "C:/Users/czeis/OneDrive/Desktop/Claude Code/Podcast-Pipeline/Staffel 03"

NB09 = (
    BASE + "/03-009_Deepfake-Gesetz/transkript/deep-dive.txt",
    1198.2,
    [
        ("", "Das fehlende Puzzleteil von Montag"),
        ("Stell dir vor, du wachst an einem ganz normalen Dienstagmorgen", "Der Deepfake-Albtraum und die juristische Luecke"),
        ("Das Bundesjustizministerium hat da jetzt reagiert", "Neues Strafrecht: der Paragraf 201b"),
        ("Spezifisch geht es da um den Artikel 50", "EU AI Act, Artikel 50 und die 15-Millionen-Falle"),
        ("Die erste Schicht ist die Einbettung von Metadaten", "Warum simple Labels scheitern: der Multi-Layer-Ansatz"),
        ("Die zweite Sicherheitsschicht sind verwobene Wasserzeichen", "Unsichtbare Wasserzeichen und der Durable-Credentials-Trick"),
        ("Nehmen wir mal die Acme Corp", "Das Acme-Corp-Szenario in der Praxis"),
        ("Remove AI Watermarks", "Die ehrliche Grenze der Technik"),
        ("kommen wir zu unserem KI-Affairs Praxistipp", "Der Praxistipp der Woche"),
        ("Wenn wir das also mal zusammenfassen", "Fazit und Ausblick"),
    ],
)

NB10 = (
    BASE + "/03-010_KI-Warnungen-Risiko/transkript/deep-dive.txt",
    1666.4,
    [
        ("", "Das Drei-Millionen-Euro-Szenario"),
        ("Bedrohungslage hat sich da", "KI ist der Hacker: die neue Bedrohungslage"),
        ("das eigentliche trojanische Pferd", "Das trojanische Pferd: deine eigene KI"),
        ("Noch viel gravierender wird es bei Data Poisoning", "Data Poisoning: die uebermalte Fahrbahn"),
        ("regelrechter Regulierungs-Tsunami", "Der Regulierungs-Tsunami und die EU-Timeline"),
        ("denk an den EU-AI-Act als das rechtliche Fundament", "Drei Zahnraeder: EU AI Act, NIST, ISO 42001"),
        ("willkommen beim Liability-Attribution-Problem", "Der blinde Fleck: Agentic AI und die Haftung"),
        ("Singapur und deren Infocom Media Development Authority", "Singapurs Blaupause: Agent Identity Cards"),
        ("AI Security Posture Management", "Zero Trust und das Governance-Gremium"),
        ("Der Praxistipp lautet, wartet nicht auf 2027", "Praxistipp der Woche und Ausblick"),
    ],
)

for label, (path, dur, anchors) in [("03-009 DEEP DIVE (19:58)", NB09), ("03-010 DEEP DIVE (27:46)", NB10)]:
    print("=" * 60)
    print(label)
    print("=" * 60)
    for line in timings(path, dur, anchors):
        print(line)
    print()
