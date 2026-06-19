#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import io, sys, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

B = "C:/Users/czeis/OneDrive/Desktop/Claude Code/Podcast-Pipeline/Staffel 03"
files = [
    B + "/03-009_Deepfake-Gesetz/podcast-beschreibung.txt",
    B + "/03-010_KI-Warnungen-Risiko/podcast-beschreibung.txt",
]
for p in files:
    text = open(p, encoding="utf-8").read()
    parts = [x.strip() for x in re.split(r"(?=^Folge [QL]\d)", text, flags=re.M) if x.strip()]
    for ep in parts:
        first = ep.splitlines()[0]
        n = len(ep)
        kap = ep.count("\n00:00 ")
        chk = {
            "Kapitel": "Kapitel:" in ep,
            "00:00-Marken": ep.count(":") >= 5 and "Kapitel:" in ep,
            "LinkedIn": "linkedin.com/in/clauszeissler" in ep,
            "Beratung": "affairs-consulting.de" in ep,
            "NotebookLM": "NotebookLM" in ep,
            "Dash": ("–" in ep) or ("—" in ep),
        }
        status = "OK" if (n <= 3500 and chk["Kapitel"] and chk["LinkedIn"] and chk["Beratung"] and chk["NotebookLM"] and not chk["Dash"]) else "PRUEFEN"
        print(f"[{status}] {first}: {n} Zeichen | Kapitel={chk['Kapitel']} LinkedIn={chk['LinkedIn']} Beratung={chk['Beratung']} Hinweis={chk['NotebookLM']} Gedankenstrich={chk['Dash']}")
