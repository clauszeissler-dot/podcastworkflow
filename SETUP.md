# SETUP — Podcast-Workflow auf einem neuen Gerät einrichten

> **An das Coding-Tool (Claude Code / Cursor / o. ä.), das diese Datei auf einem neuen Gerät liest:**
> Diese Datei ist die verbindliche Einrichtungs-Anleitung. Arbeite sie **von oben nach unten** ab.
> Ziel: Nach diesem Setup muss ein Mensch nur noch **die Accounts einmalig anmelden** (Logins im Browser),
> danach läuft der komplette Podcast-Workflow.
>
> **Inhaltlicher Single Source of Truth** für den Ablauf selbst ist `_WORKFLOW-UND-STATUS.md` (im selben Ordner).
> Diese SETUP.md erklärt nur die **Einrichtung** der Umgebung und das **Datei-Inventar**.
>
> Stand: 2026-06-13.

---

## 0) Was ist das hier? (Überblick in 6 Zeilen)

Eine halbautomatische Pipeline, die pro Podcast-Folge aus einem **NotebookLM-Notebook** zwei Audio-Episoden
(„Quicky" Mo + „Deep Dive" Do) erzeugt, sie transkribiert (**TurboScribe**), daraus Show-Notes/Blog-Post/LinkedIn-Posts
generiert, **Bilder/Thumbnails** rendert (Gemini Image) und auf **Blogger** + **Spotify** veröffentlicht.
Der Podcast heißt **KI AffAIrs** (Claus Zeißler). Folgen-Schema: `Staffel 03 / 03-0XX_<thema-slug>`.
Der detaillierte End-to-End-Ablauf steht in `_WORKFLOW-UND-STATUS.md`, Abschnitt 1.

---

## 1) System-Voraussetzungen (einmal pro Gerät installieren)

| Komponente | Zweck | Prüfen mit |
|---|---|---|
| **Python ≥ 3.10** | alle `tools/*.py`, NotebookLM-CLI | `python --version` |
| **Node.js + npm** (LTS) | Playwright-MCP (`npx`), Web-Frontend | `node --version` |
| **Google Chrome** | einmalige Browser-Logins (NotebookLM, TurboScribe, Blogger, Spotify) | im Startmenü |
| **ffmpeg + ffprobe** | nur für `Podcast Video/` (Video-Schnitt) | `ffmpeg -version` |
| **git** | Repo + NotebookLM-MCP klonen | `git --version` |

> **Windows-Hinweis (Bitdefender):** PowerShell-basierte pip-/scoop-Installs werden hier heuristisch geblockt.
> Installs **über Git-Bash** ausführen, nicht über PowerShell. (Siehe auch globale `CLAUDE.md`/`LEARNINGS.md`.)

---

## 2) Einrichtung Schritt für Schritt

### Schritt 2.1 — Python-Pakete für die Tools

Die Skripte in `tools/` brauchen nur zwei Drittanbieter-Pakete (Rest ist stdlib):

```bash
python -m pip install -r requirements.txt
```

(`requirements.txt` liegt im Repo-Root und enthält `requests` + `Pillow`.)

### Schritt 2.2 — NotebookLM-CLI + MCP-Server (eigene venv)

Die NotebookLM-Anbindung ist ein **separates Repo** und wird **nicht** in dieses Repo dupliziert. Klonen und einrichten:

```bash
git clone https://github.com/czrules11-ux/NotebookLM-Skill-MCP.git
cd NotebookLM-Skill-MCP
./setup.sh          # Git-Bash / macOS / Linux   (Windows-PowerShell: .\setup.ps1)
```

`setup.sh` legt eine isolierte venv an, installiert `notebooklm-py` (>=0.6,<0.7), `mcp[cli]`, `pydantic`,
**Playwright-Chromium** und generiert eine fertige `.mcp.json` mit absoluten Pfaden.
> Bei Bitdefender-Block: **`setup.sh` in Git-Bash** statt `setup.ps1`.

### Schritt 2.3 — API-Key für Bildgenerierung hinterlegen

`tools/gen_scene.py` und `tools/gen_image_fixed.py` lesen `GOOGLE_AI_KEY` aus einer `api_keys.env`.
Lege die Datei an einem der gesuchten Orte an (Reihenfolge wie im Code):

```
~/OneDrive/Dokumente/Claude/Projects/Bild Skill/api_keys.env
~/OneDrive/Documents/Claude/Projects/Bild Skill/api_keys.env
~/OneDrive/Claude/Projects/Bild Skill/api_keys.env
```

Inhalt (Werte selbst eintragen — **niemals committen**):

```
GOOGLE_AI_KEY=<dein Google-AI-Studio-Key>
# optional, nur falls OpenAI-Fallback genutzt wird:
OPENAI_API_KEY=<dein OpenAI-Key>
```

> Alternativ ist `.env.example` im Repo-Root die Vorlage — kopiere sie nach `.env` und trage die Werte ein,
> wenn du die Keys lieber projektlokal hältst (dann `--key`/Env-Var-Pfad im Tool entsprechend setzen).

### Schritt 2.4 — MCP-Server in diesem Projekt aktivieren

Kopiere `.mcp.json.example` (Repo-Root) nach `.mcp.json` und passe die **absoluten Pfade** an dein Gerät an.
Benötigt werden zwei Server:

- **`notebooklm`** → `command` = die `python.exe` der venv aus Schritt 2.2, `args` = `…/NotebookLM-Skill-MCP/mcp-server/server.py`,
  `env.NOTEBOOKLM_DOWNLOAD_DIR` = ein beschreibbarer Download-Ordner.
- **`playwright`** → `npx @playwright/mcp@latest` mit `--user-data-dir` auf ein **eigenes** Chrome-User-Data-Verzeichnis
  (für die eingeloggten Browser-Sessions von TurboScribe/Blogger).

Danach Coding-Tool im Repo-Ordner **neu starten** und beide Server bestätigen.

### Schritt 2.5 — Accounts einmalig anmelden (der einzige manuelle Rest)

Siehe Tabelle in Abschnitt **3**. Kernschritt NotebookLM:

```bash
# in der NotebookLM-venv:
.venv/Scripts/python.exe -m notebooklm login --browser chrome   # Windows
# .venv/bin/python -m notebooklm login --browser chrome         # macOS/Linux
# Prüfen:
.venv/Scripts/python.exe -m notebooklm auth check --test        # erwartet: Authenticated
```

TurboScribe, Blogger und Spotify werden über den Playwright-Browser **einmal interaktiv eingeloggt**
(Cookies bleiben im `--user-data-dir` erhalten).

---

## 3) Accounts & Secrets — was ein Mensch einmalig einrichtet

> **Keiner dieser Werte liegt im Repo.** Alle Secret-Dateien sind per `.gitignore` ausgeschlossen.
> Auf einem neuen Gerät müssen sie neu eingetragen / neu eingeloggt werden.

| Dienst | Art | Wie einrichten | Wofür im Workflow |
|---|---|---|---|
| **Google / NotebookLM** | Browser-Login (Cookie-Profil) | `notebooklm login --browser chrome` → speichert `~/.notebooklm/profiles/<p>/storage_state.json` | Audio Overviews + Reports erzeugen |
| **Google AI (Gemini)** | API-Key `GOOGLE_AI_KEY` | Key in `api_keys.env` (Abschnitt 2.3) | Bilder/Thumbnails via `gen_scene.py` |
| **OpenAI** *(optional)* | API-Key `OPENAI_API_KEY` | Key in `api_keys.env` | Bild-Fallback `gen_image_fixed.py` |
| **TurboScribe** | Browser-Login | einmal im Playwright-Browser einloggen | Audio → Transkript |
| **Blogger** | MCP `mcp__blogger__*` (Google-OAuth) | Blogger-MCP im Coding-Tool einrichten/autorisieren | Blog-Post veröffentlichen (DE-Blog `7960190015368829692`) |
| **Spotify for Creators** | Browser-Login | einmal im Playwright-Browser einloggen (nur manuell, keine API) | Audio + Beschreibung hochladen |
| **xAI Grok** *(optional)* | API-Key `XAI_API_KEY` (Env-Var) | `setx XAI_API_KEY <key>` | nur `Podcast Video/video_producer.py` |

> **Stamm-Account** für alle Google-Dienste & TurboScribe: `cz.rules11@googlemail.com`.
> Login-Sessions (besonders NotebookLM) laufen nach Wochen ab → bei Auth-Fehler `login` erneut ausführen.

---

## 4) Datei-Inventar — was liegt im Repo (und was bewusst nicht)

Die **Podcast-Pipeline ist das Repo-Root**. Die drei Satelliten liegen unter `satelliten/`.
**Bewusst ausgeschlossen** (per `.gitignore`, nur lokal): Audio (`*.m4a`/`*.mp3`), Video (`video_output/`),
`node_modules/`, `dist/`, alle Secret-Dateien. **Bilder sind bewusst enthalten** (als Referenz/Learning).

> Hinweis zur Herkunft: Auf dem Original-Arbeitsgerät liegen diese Teile getrennt unter
> `C:\Users\czeis\OneDrive\Claude Code\` (`Podcast-Pipeline/`, `Podcast Video/`, `KI Affairs Pod Web/`,
> `KI Affairs Podcast/`). Im Repo sind sie zu einem Monorepo zusammengeführt.

### 4.1 Repo-Root — der Kern-Workflow

```
podcastworkflow/
├─ README.md                   ← Einstieg/Übersicht
├─ SETUP.md                    ← diese Datei
├─ _WORKFLOW-UND-STATUS.md     ← Single Source of Truth: Ablauf, Status, Gotchas, Resume-Punkt
├─ requirements.txt            ← Python-Deps der Tools (requests, Pillow)
├─ .env.example                ← Secret-Vorlage (GOOGLE_AI_KEY etc.)
├─ .mcp.json.example           ← MCP-Server-Vorlage (notebooklm, playwright)
├─ tools/                      ← 10 Python-Tools (Code) + _learnings_append.md (Wissen)
│   ├─ gen_scene.py            Bild mit Personen- + Marken-Referenz (GOOGLE_AI_KEY, requests)
│   ├─ gen_image_fixed.py      Bild-Generator mit Fallback (requests, Pillow)
│   ├─ probe_duration.py       Audiodauer ohne Abhängigkeiten (stdlib)
│   ├─ chapter_timings.py      Kapitelmarken (stdlib)
│   ├─ curate.py               Quellen klassifizieren/löschen (stdlib)
│   ├─ sources_table.py        Quellen-Tabelle (stdlib)
│   ├─ faq_extract.py          FAQ aus Transkript (stdlib)
│   ├─ fix_timed.py            getimte Transkripte fixen (stdlib)
│   ├─ verify_desc.py          Beschreibungen prüfen (stdlib)
│   ├─ verify_geo.py           GEO-Bausteine prüfen (stdlib)
│   └─ _learnings_append.md    Bild-/Prompt-Lehren (siehe Abschnitt 5)
├─ prompts/                    ← 5 Prompt-Templates (Code)
│   ├─ quicky-montag.txt
│   ├─ deep-dive-donnerstag.txt
│   ├─ show-notes-generator.txt
│   ├─ blog-post-generator.txt
│   └─ blog-post-generator-notebooklm.txt
├─ assets/                     ← Referenzbilder (~19 MB): 2 Claus-Headshots (Likeness) + 3 ChatGPT-Bilder
├─ Staffel 03/                 ← Episoden-Content OHNE Audio (Bilder/Transkripte/Beschreibungen/Blog)
│   ├─ 03-008_Human-Consent-Standard/
│   ├─ 03-009_Deepfake-Gesetz/        (Bilder + Transkripte; Audio nur lokal)
│   └─ 03-010_KI-Warnungen-Risiko/    (Bilder + Transkripte; Audio nur lokal)
└─ satelliten/                 ← siehe 4.2
```

> **Medien-Politik im Repo:** Bilder (`.png`/`.jpg`) sind enthalten (Learning/Referenz).
> Audio (`*.m4a`) und Video (`video_output/`) sind ausgeschlossen — sie bleiben auf dem Arbeitsgerät bzw.
> werden pro Folge neu erzeugt. Keine Einzeldatei über GitHubs 100-MB-Limit; kein Git LFS nötig.

### 4.2 `satelliten/` — alles drum herum

| Pfad im Repo | Inhalt | Bewertung |
|---|---|---|
| `satelliten/rss/` | RSS-Feeds (`de/en/tg_rss.xml`) + 3 Übersichts-`.xlsx` | Publishing-Output/Tracking |
| `satelliten/podcast-video/` | `video_producer.py` + `VIDEO_ANLEITUNG.md` (xAI Grok) | Code drin; `video_output/` ausgeschlossen |
| `satelliten/pod-web/` | Vite/React/Supabase-Website (eigene `.env.example`) | `node_modules/`, `dist/`, `.env` ausgeschlossen |
| **extern** | `NotebookLM-Skill-MCP` (MCP-Server + CLI) | **Eigenes Repo** (`czrules11-ux/NotebookLM-Skill-MCP`) → klonen, nicht duplizieren (siehe §2.2) |

### 4.2 Satelliten-Ordner (gehören thematisch dazu)

| Ordner | Inhalt | Größe | Bewertung |
|---|---|---|---|
| `KI Affairs Podcast/` | RSS-Feeds (`de/en/tg_rss.xml`) + 3 Übersichts-`.xlsx` | ~2 MB | Publishing-Output/Tracking, kein Code |
| `Podcast Video/` | `video_producer.py` + `VIDEO_ANLEITUNG.md` + `video_output/` | Code winzig, `video_output/` ~160 MB | Code ins Repo, gerenderte Videos ausschließen |
| `KI Affairs Pod Web/` | Vite/React/Supabase-Website | ~62 MB ohne `node_modules` (244 MB) | Eigenes Frontend; `node_modules/`, `dist/`, `.env` ausschließen |
| `NotebookLM-Skill-MCP/` | MCP-Server + CLI-Wrapper | — | **Eigenes Repo** (`czrules11-ux/NotebookLM-Skill-MCP`) → nur klonen, nicht duplizieren |

---

## 5) Wissens- & Lern-Dateien (vorhanden — bitte beachten)

Diese Dateien sind das „Gedächtnis" des Projekts und sollen vor Arbeit gelesen / nach Arbeit gepflegt werden:

| Datei | Ort | Inhalt |
|---|---|---|
| `_WORKFLOW-UND-STATUS.md` | `Podcast-Pipeline/` | **Wichtigste Datei.** Ablauf je Phase, Werkzeuge/Befehle, Gotchas, aktueller Status/Resume-Punkt je Folge |
| `tools/_learnings_append.md` | `Podcast-Pipeline/tools/` | Konkrete Bild-/Prompt-Lehren (Likeness, Logo-Farben, 4-Bilder-Muster, PYTHONIOENCODING) |
| `LEARNINGS.md` (global) | `C:\Users\czeis\.claude\LEARNINGS.md` | Geräte-/projektübergreifende Fehler- & Best-of-Lehren; per SessionStart-Hook geladen |
| `CLAUDE.md` (global) | `C:\Users\czeis\.claude\CLAUDE.md` | Stehende Verhaltensregeln (Shell/Bitdefender, Verifikation, Umlaute) |

> Bei Statusänderungen **immer** `_WORKFLOW-UND-STATUS.md` aktualisieren. Generalisierbare Lehren → `LEARNINGS.md`.

---

## 6) Verifikation — woran erkenne ich, dass alles steht?

Nach dem Setup diese Checks fahren (End-to-End-Beweis, kein „läuft vermutlich"):

```bash
# 1) Tools-Deps da?
python -c "import requests, PIL; print('tools-deps OK')"

# 2) NotebookLM eingeloggt?
<venv-python> -m notebooklm auth check --test          # erwartet: Authenticated

# 3) Audiodauer-Tool läuft (an einer vorhandenen .m4a)?
python tools/probe_duration.py "Staffel 03/03-010_KI-Warnungen-Risiko/audio/deep-dive.m4a"

# 4) Bildgenerator findet den Key? (erzeugt ein kleines Testbild)
set PYTHONIOENCODING=utf-8
python tools/gen_scene.py --output _test.png --prompt "simple test image, cyan hexagon on dark background"

# 5) MCP-Server sichtbar? -> im Coding-Tool: notebooklm + playwright als "connected" prüfen
```

Erst wenn 1–4 grün sind und die MCP-Server verbunden sind, ist die Einrichtung abgeschlossen.
Der eigentliche Folgen-Ablauf startet dann gemäß `_WORKFLOW-UND-STATUS.md`, Abschnitt 1.

---

## 7) Kurz-Gotchas (Details in `_WORKFLOW-UND-STATUS.md`, Abschnitt 3)

- **Shell:** Maschine läuft über PowerShell; Bitdefender blockt PowerShell-pip → Installs in **Git-Bash**.
- **NotebookLM strikt seriell** steuern (ein Login-Profil, sonst Deadlock). Nicht parallel/fan-out.
- **Bildtools** immer mit `PYTHONIOENCODING=utf-8`; keine doppelten Anführungszeichen im Prompt (bricht PS-Arg).
- **Blogger-MCP** erreicht nur **Live-Posts** (404 bei Entwürfen/geplanten) → geplante Posts nur im Editor.
- **gen_scene.py / Personen-Likeness:** Gefahr-/Angriffs-Sprache lässt das Bildmodell ablehnen → mild/positiv framen.
