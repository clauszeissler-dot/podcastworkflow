#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bereinigt die per browser_evaluate(filename) als JSON-String-Literal
gespeicherten timed-Transkripte: Quotes + literale \\n -> echtes Format."""
import json, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

B = "C:/Users/czeis/OneDrive/Desktop/Claude Code/Podcast-Pipeline/Staffel 03"
files = [
    B + "/03-009_Deepfake-Gesetz/transkript/deep-dive-timed.txt",
    B + "/03-010_KI-Warnungen-Risiko/transkript/deep-dive-timed.txt",
]
for p in files:
    raw = open(p, encoding="utf-8").read().strip()
    text = raw
    if raw.startswith('"'):
        text = json.loads(raw)
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(text + "\n")
    marks = sum(1 for ln in text.splitlines() if ln.startswith("["))
    print(f"{p.split('/')[-3]}: {len(text)} chars, {marks} Zeitmarken-Zeilen")
