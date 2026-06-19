"""Klassifiziert NotebookLM-Quellen in KEEP/DELETE anhand von URL-Mustern (Off-Topic-Cluster).
Aufruf: python curate.py <source-list-json> <delete-ids-out.txt>
Off-Topic fuer Folge 03-010 (globales KI-Framework/Cybersicherheit/Unternehmens-Guidelines + AJ-Ironie):
Disney/Sora, Netflix-Entertainment, Boersen/Aktien, Social-Noise, schwache AJ-Tangenten.
"""
import json
import sys

DELETE_PATTERNS = [
    "disney", "sora", "netflix",
    "spotify", "open.spotify", "marketbeat", "ts2.tech", "ainvest", "devere-group",
    "tickeron", "247wallst", "brewmarkets", "morningstar", "sezarro",
    "cnbc.com", "reuters.com", "x.com/", "instagram.com", "reddit.com", "youtube.com",
    "community.openai", "camera-uk", "jworld.ch", "kettner-edelmetalle",
    "cnn.com", "nytimes.com", "fortune.com", "bloomberg.com", "finance.yahoo", "almcorp",
]

with open(sys.argv[1], "r", encoding="utf-8-sig", errors="replace") as f:
    data = json.load(f)

keep, delete = [], []
for s in data.get("sources", []):
    url = (s.get("url") or "").lower()
    title = (s.get("title") or "").replace("\n", " ")[:70]
    hit = next((p for p in DELETE_PATTERNS if p in url), None)
    (delete if hit else keep).append((s.get("id"), hit, (s.get("url") or "NULL")[:60], title))

print(f"=== KEEP ({len(keep)}) ===")
for id_, _, url, title in keep:
    print(f"KEEP  {url:<60} | {title}")
print(f"\n=== DELETE ({len(delete)}) ===")
for id_, hit, url, title in delete:
    print(f"DEL[{hit}]  {url:<60} | {title}")

with open(sys.argv[2], "w", encoding="utf-8") as f:
    for id_, *_ in delete:
        f.write(id_ + "\n")
print(f"\n{len(delete)} Lösch-IDs geschrieben nach {sys.argv[2]}")
