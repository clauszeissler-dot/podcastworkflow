#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrahiert die grounded FAQ-Antworten aus den NotebookLM-ask-JSONs,
entfernt Zitat-Marker [n] und whitespace-normalisiert."""
import json, re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

B = "C:/Users/czeis/OneDrive/Desktop/Claude Code/Podcast-Pipeline/Staffel 03/03-010_KI-Warnungen-Risiko/faq"
for i in range(1, 7):
    p = f"{B}/q{i}.json"
    try:
        d = json.load(open(p, encoding="utf-8"))
    except Exception as e:
        print(f"=== Q{i} === LESEFEHLER: {e}\n")
        continue
    if isinstance(d, dict) and d.get("error"):
        print(f"=== Q{i} === FEHLER-JSON: {d}\n")
        continue
    ans = d.get("answer") if isinstance(d, dict) else None
    if ans is None:
        print(f"=== Q{i} === KEINE 'answer', keys={list(d.keys()) if isinstance(d,dict) else type(d)}\n")
        continue
    ans = re.sub(r"\[\d+\]", "", ans)
    ans = re.sub(r"\s+", " ", ans).strip()
    nrefs = len(d.get("references", []) or [])
    print(f"=== Q{i} === ({nrefs} refs)")
    print(ans)
    print()
