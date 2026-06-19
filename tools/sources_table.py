"""Kompakte Tabelle der NotebookLM-Quellen aus einem `source list --json`-Dump.
Aufruf: python sources_table.py <json-datei>
Gibt je Zeile: INDEX | ID | STATUS | URL | TITLE(gekuerzt)
"""
import json
import sys

with open(sys.argv[1], "r", encoding="utf-8-sig") as f:
    data = json.load(f)

srcs = data.get("sources", [])
print(f"# {len(srcs)} Quellen in '{data.get('notebook_title')}'")
for s in srcs:
    url = s.get("url") or "NULL"
    title = (s.get("title") or "").replace("\n", " ")
    print(f"{s.get('index'):>3} | {s.get('id')} | {s.get('status'):<10} | {url[:70]:<70} | {title[:75]}")
