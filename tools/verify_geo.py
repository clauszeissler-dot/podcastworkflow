#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re, json, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

p = "C:/Users/czeis/OneDrive/Desktop/Claude Code/Podcast-Pipeline/Staffel 03/03-010_KI-Warnungen-Risiko/blogpost-blogger.html"
html = open(p, encoding="utf-8").read()

dashes = [c for c in html if c in "–—"]
print("Gedankenstriche (-/--):", len(dashes))
print("Bytes:", len(html.encode("utf-8")))
for needle in ['<details class="ki-faq-item">', 'ki-tldr-row', 'class="ki-tldr"', 'src="bilder/', 'application/ld+json', '17. Juni 2026', 'KW25']:
    print(f"  '{needle}': {html.count(needle)}")

m = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
if not m:
    print("KEIN JSON-LD gefunden!")
else:
    try:
        data = json.loads(m.group(1))
        qs = data.get("mainEntity", [])
        print(f"JSON-LD VALIDE: @type={data.get('@type')}, Fragen={len(qs)}")
        for q in qs:
            print("   Q:", q["name"][:60])
    except Exception as e:
        print("JSON-LD PARSE-FEHLER:", e)
