# Podcast-Workflow — KI AffAIrs

Halbautomatische Pipeline, die pro Folge aus einem **NotebookLM**-Notebook zwei Audio-Episoden
(„Quicky" + „Deep Dive") erzeugt, sie über **TurboScribe** transkribiert, daraus Show-Notes,
Blog-Post und LinkedIn-Posts generiert, **Bilder/Thumbnails** rendert (Gemini Image) und auf
**Blogger** + **Spotify** veröffentlicht.

## Schnellstart auf einem neuen Gerät

Komplette, Schritt-für-Schritt-Einrichtung steht in **[`SETUP.md`](SETUP.md)**.
Kurzfassung:

1. Voraussetzungen installieren (Python ≥ 3.10, Node.js, Chrome, ffmpeg, git) — `SETUP.md` §1
2. `python -m pip install -r requirements.txt`
3. NotebookLM-MCP klonen + einrichten (`czrules11-ux/NotebookLM-Skill-MCP`) — `SETUP.md` §2.2
4. Secrets eintragen: `.env.example` → `.env` / `api_keys.env` — `SETUP.md` §2.3
5. `.mcp.json.example` → `.mcp.json`, Pfade anpassen — `SETUP.md` §2.4
6. **Accounts einmalig anmelden** (NotebookLM, TurboScribe, Blogger, Spotify) — `SETUP.md` §3
7. Verifikation fahren — `SETUP.md` §6

Danach läuft der Workflow. Der inhaltliche Ablauf je Folge steht in
**[`_WORKFLOW-UND-STATUS.md`](_WORKFLOW-UND-STATUS.md)**.

## Struktur

| Pfad | Inhalt |
|---|---|
| `_WORKFLOW-UND-STATUS.md` | Single Source of Truth: Ablauf, Status, Gotchas |
| `SETUP.md` | Einrichtung auf neuem Gerät + Datei-Inventar |
| `tools/` | Python-Tools (Bildgenerierung, Quellen-Kuration, Verifikation) |
| `prompts/` | Prompt-Templates für Audio, Show-Notes, Blog |
| `assets/` | Referenzbilder (Likeness + Logo) |
| `Staffel 03/` | Episoden-Content (Bilder + Transkripte; Audio bewusst ausgeschlossen) |
| `satelliten/rss/` | RSS-Feeds + Übersichts-Spreadsheets |
| `satelliten/podcast-video/` | Video-Producer (xAI Grok) + Anleitung |
| `satelliten/pod-web/` | Website (Vite/React/Supabase) |

> **Medien:** Bilder sind enthalten (Referenz/Learning). Audio (`*.m4a`) und gerenderte Videos
> sind per `.gitignore` ausgeschlossen — sie bleiben lokal bzw. werden pro Folge neu erzeugt.

## Accounts (einmalig)

Google/NotebookLM · Google AI (Gemini) · TurboScribe · Blogger · Spotify for Creators · optional xAI Grok.
Details und Setup je Dienst: `SETUP.md` §3. **Keine Secrets liegen im Repo.**
