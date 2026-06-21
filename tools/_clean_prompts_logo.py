#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Einmal-Skript: ersetzt die 'Logo malen'-Anweisung in den Bild-Prompts durch
eine Safe-Zone-Anweisung (Logo kommt jetzt per PIL-Compositing in gen_thumb_v2.py).
"""
from pathlib import Path

BASE = Path.home() / "Desktop/Claude/Code/podcastworkflow-cz/Staffel 03"

SAFE = ("Marke/Logo: Lasse die untere rechte Bildecke bewusst ruhig, dunkel und frei "
        "von Objekten, Symbolen, Emblemen und Text. Male dort selbst KEIN Logo, KEIN "
        "Hexagon und keine Buchstaben — an dieser Stelle wird nachträglich separat das "
        "echte KI-AffAIrs-Logo eingefügt.")

# (Datei, Liste der zu ersetzenden Original-Logo-Absaetze)
JOBS = [
    ("03-012_KI-lernt-luegen/bilder/_api-prompt-thumb-deepdive.txt", [
        "Marke: platziere das beigefügte KI-AffAIrs-Hexagon-Logo (Buchstaben KI in Cyan-Teal und Orange) klein, leuchtend und dezent unten rechts, unverzerrt und lesbar.",
    ]),
    ("03-012_KI-lernt-luegen/bilder/_api-prompt-linkedin.txt", [
        "Platziere das beigefügte KI-AffAIrs-Hexagon-Emblem (Buchstaben KI in Cyan-Teal und Orange) klein, leuchtend und dezent unten rechts, lesbar und unverzerrt.",
    ]),
    ("03-012_KI-lernt-luegen/bilder/_api-prompt-thumb-quicky-v2.txt", [
        "Marke: platziere das beigefügte KI-AffAIrs-Hexagon-Logo exakt wie in der Referenz als kleines, dezentes Emblem unten rechts. Übernimm das Logo unverändert als geometrische Hexagon-Form mit dem stilisierten KI-Zeichen; erfinde KEINE zusätzlichen Buchstaben, KEINEN verzerrten Text, keine Pseudo-Schrift im oder am Logo. Lieber eine reine, saubere Hexagon-Silhouette als falsch geschriebene Buchstaben.",
    ]),
    ("03-011_KI-und-die-menschliche-Psyche/bilder/_api-prompt-thumb-quicky.txt", [
        "Marke: platziere das beigefügte KI-AffAIrs-Hexagon-Logo (Buchstaben KI in Cyan-Teal und Orange) klein, leuchtend und dezent unten rechts, unverzerrt und lesbar.",
    ]),
    ("03-011_KI-und-die-menschliche-Psyche/bilder/_api-prompt-thumb-deepdive.txt", [
        "Marke: platziere das beigefügte KI-AffAIrs-Hexagon-Logo (Buchstaben KI in Cyan-Teal und Orange) klein, leuchtend und dezent unten rechts, unverzerrt und lesbar.",
    ]),
]

# Blog-Dateien: identischer Satz
BLOG = ("Platziere das beigefuegte KI-AffAIrs-Hexagon-Logo klein und dezent unten rechts, "
        "unveraendert als geometrische Form, ohne erfundene Buchstaben.")
for name in ["hero", "cost", "compliance", "trust"]:
    JOBS.append((f"03-012_KI-lernt-luegen/bilder/_api-prompt-blog-{name}.txt", [BLOG]))

for rel, originals in JOBS:
    p = BASE / rel
    txt = p.read_text(encoding="utf-8")
    hit = False
    for orig in originals:
        if orig in txt:
            txt = txt.replace(orig, SAFE)
            hit = True
    if hit:
        p.write_text(txt, encoding="utf-8")
        print(f"OK   {rel}")
    else:
        print(f"MISS {rel}  (Logo-Absatz nicht gefunden!)")

print("\n-- Verifikation: verbliebene 'platziere ... Logo'-Treffer --")
import subprocess
subprocess.run(["grep", "-rilE", "platziere.*logo|beigef.gte KI-AffAIrs-Hexagon-Logo klein",
                str(BASE / "03-012_KI-lernt-luegen/bilder"),
                str(BASE / "03-011_KI-und-die-menschliche-Psyche/bilder")])
