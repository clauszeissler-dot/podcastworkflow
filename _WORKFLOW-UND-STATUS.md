# Podcast-Pipeline — Workflow & Status (portable Doku)

> **Zweck dieser Datei:** Single Source of Truth IM Projektordner, damit jede Claude-/Agent-Instanz
> (Claude Code, VS Code, etc.) den Stand und den Ablauf findet — unabhängig vom internen Gedächtnis.
> Bei Statusänderungen IMMER hier UND im internen Memory nachziehen.
> Stand: 2026-06-13 (Folge 34 / 03-010: 2 Podcast-Thumbnails + LinkedIn-Bild erzeugt, Spotify-Upload-Paket gebündelt.
> Laut User ist Folge 33 „KI-Content" komplett live (Quicky + Deep Dive + Blog). Vorher: 03-008-Thumbnails (07.06.).).

---

## 0) Wo liegt das „Gedächtnis"?

- **Internes Auto-Memory (Claude Code):** `C:\Users\czeis\.claude\projects\C--Users-czeis-OneDrive-Desktop-Claude-Code\memory\`
  - `MEMORY.md` = Index (wird bei Sessionstart automatisch geladen)
  - Resume-Stand: `project_notebooklm_podcast_automation.md`, `project_notebooklm_setup_state.md`
  - Technik-Refs: `reference_notebooklm_cli_vs_mcp.md`, `reference_turboscribe_browser_workflow.md`, `reference_blogger_publish_workflow.md`, `reference_image_skill.md`
- **WICHTIG:** Dieses Memory ist an den **cwd-Pfad** gebunden. Eine Claude-Instanz, die in einem ANDEREN
  Verzeichnis startet, sieht es NICHT. Für volle Kontinuität Claude Code mit cwd =
  `C:\Users\czeis\OneDrive\Desktop\Claude Code` öffnen — oder eben diese portable Datei lesen.

---

## 1) Der End-to-End-Workflow (pro Folge)

Folgen-Schema: Staffel 03, `03-0XX_<thema-slug>`. Pro Folge ein NotebookLM-Notebook (legt der User an).
Ordnerstruktur je Folge: `Staffel 03\03-0XX_<slug>\` mit `audio\`, `transkript\`, `bilder\`,
`beschreibung-quicky.md`, `beschreibung-deepdive.md`, `blogpost.md`, `linkedin-posts.md`,
`podcast-beschreibung.txt` (NEU, s. Phase 3c).

### Phase 1 — automatisierbar (NotebookLM-CLI, strikt seriell)
1. Neues Notebook erkennen (User stellt es bereit).
2. Quellen prüfen/kuratieren — nur seriöse/öffentliche Quellen (kein Boulevard), Lücken via Research
   nachziehen. Bei gravierender Lücke Episoden-Pipeline neu starten.
2b. **Faktencheck (adversarisch — STANDARD-PFLICHT ab 2026-06-19).** Prompt: `prompts\faktencheck.txt`.
   Aus dem NotebookLM-Briefing alle prüfbaren Zahlen/Studien/Fristen ziehen; pro Behauptung EIN
   unabhängiger Web-Prüfer gegen die ORIGINAL-Primärquelle (Reddit/Boulevard/Vendor-PR zählt NICHT;
   im Zweifel „unbelegt"). Ergebnis = Ampel + **WHITELIST** (belegte Fakten) + **BLACKLIST**
   (falsch/unbelegt/zu scharf) → in den Folge-Ordner als `faktencheck.md`.
   - **BLACKLIST geht zwingend als „NICHT erwähnen"-Block in beide Audio-Prompts** (Schritt 3), damit
     NotebookLM falsche Zahlen gar nicht erst spricht. **WHITELIST** liefert die Hook-/Pill-/Insight-Zahlen.
   - Claude-Code-Referenzimplementierung: `tools\factcheck-workflow.js` (1 Agent je Claim, parallel,
     strukturierte Verdicts). Begründung: hat real die widerlegte „130 Mrd"-Zahl + zwei Marketing-Fakes
     („300 Mrd weltweit", „67 % Mitarbeiterbindung") vor Veröffentlichung abgefangen.
3. **2 Audio Overviews** aus DEMSELBEN Notebook/denselben Quellen (Audio-Prompt um BLACKLIST aus 2b ergänzen):
   - **Mo „Quicky"**: `generate audio --prompt-file prompts\quicky-montag.txt --format brief --language de` (ggf. `--length short`)
   - **Do „Deep Dive"**: `generate audio --prompt-file prompts\deep-dive-donnerstag.txt --format deep-dive --language de` (ggf. `--length long`)
4. Beide Audios downloaden → `audio\quicky.m4a`, `audio\deep-dive.m4a`.
   (Download liefert `.mp3`-Endung, Inhalt ist real M4A/MP4 → als `.m4a` ablegen.)

### Phase 2 — Transkription
**STANDARD ab 2026-06-20: OpenAI `gpt-4o-transcribe-diarize` (automatisierbar, kein Limit).**
- Tool: `python3 tools/transcribe_openai.py <audio.m4a> <ziel-basis> --mode {quicky|deepdive}`
  (braucht `requests`; läuft mit `~/Desktop/Claude/Code/podcast-thumbnail/.venv/bin/python`).
  Key = OPENAI_API_KEY (gleiche Quelle wie `gen_thumb_openai.py`, `~/Documents/Claude/Projects/Bild Skill/api_keys.env`).
- Liefert **Sprecher + genaue Zeitstempel** (start/end je Segment) → `<ziel>.txt` (plain) + `<ziel>-timed.txt`
  (`(M:SS) [Sprecher] Satz`). Feste Sprecherzahl je Format (User-Vorgabe): **Quicky = 1 Sprecher**,
  **Deep Dive = 2 (1 m + 1 w)**. Referenzen `tools/refs/notebooklm_{host,cohost}.wav` (NotebookLM-Stimmen,
  konstant über alle Folgen) erzwingen die 2 Sprecher; Post-Merge räumt Über-Diarisierung auf.
  Eigennamen-Glossar (KI AffAIrs, Modelle, CLTR …) korrigiert Verhörer im Tool.
- **Gotchas (verifiziert):** Audio-Limit 25 MB → Tool komprimiert vorab per ffmpeg auf 16 kHz Mono-MP3.
  Referenzclips müssen **1,2–10,0 s** sein. Diarize-Modelle akzeptieren **keinen `prompt`** (→ Glossar als
  Post-Processing). Über-Diarisierung der synthetischen NotebookLM-Stimmen ist normal → Referenzen+Merge nötig.
- **Fallback TurboScribe (Browser, isolierter Playwright-Server `playwright-nlm`, eingeloggt cz.rules11):**
  Free-Tarif 3 Transkriptionen/Tag, max. 30 Min/Datei, Werbe-Zeilen strippen. **ACHTUNG: TurboScribe steht
  hinter einem Cloudflare-Bot-Block** — die Automatisierung hängt in der „Sicherheitsüberprüfung"; der User
  muss die Challenge ggf. manuell im Browser durchklicken. Wal-Modus (🐳) = beste Qualität.
- Dauer vorab prüfen: `python3 tools/probe_duration.py <pfad.m4a>`.

### Phase 3 — automatisierbar (Content)
> **Faktencheck-Gate (Phase 2b):** ALLE Content-Artefakte (Show-Notes, Blog, LinkedIn, Podcast-
> Beschreibung) verwenden ausschließlich WHITELIST-Zahlen aus `faktencheck.md`. BLACKLIST-Aussagen
> sind tabu; bei „teilweise"-Fakten die dort notierte Präzisierung übernehmen (z. B. Quelle/Stichprobe nennen).
- **3a Show-Notes:** `prompts\show-notes-generator.txt` auf die Transkripte → erzeugt BEIDE
  Beschreibungen (Quicky-Teaser + Deep-Dive). → `beschreibung-quicky.md`, `beschreibung-deepdive.md`.
- **3b Blog-Post:** als NotebookLM-Report (`prompts\blog-post-generator-notebooklm.txt`), dann von
  Claude per Brand-Voice-Skill + NotebookLM-Chat (Faktencheck gegen Halluzination) reviewt → `blogpost.md`
  → gestylter `.ki-post-wrapper`-Post → Blogger. Optional GEO-Bausteine (Auf-einen-Blick, FAQ-Dropdown,
  Quellen, JSON-LD-FAQPage).
- **3c Podcast-Beschreibung (NEU, Standard ab 2026-06-02):** `podcast-beschreibung.txt` (oder .docx)
  im Folge-Ordner mit der fertigen Podcast-Beschreibung inkl. Verlinkungen:
  - die beiden Beschreibungen (Quicky + Deep Dive),
  - bei externem Material: die Quell-Links,
  - **LinkedIn-Seite** des Users + **Unternehmensseite** mit aufführen.
- **3d Bilder:** 4er-Set pro Post via `tools\gen_scene.py` (Person-Likeness + Logo getrennt).
  - **STANDARD (User-Vorgabe 2026-06-13): Zu JEDEM generierten Bild zusätzlich einen copy-paste-fertigen ChatGPT-Image-Prompt
    liefern** (deutsch), damit der User das Bild alternativ in ChatGPT/GPT-4o erzeugen kann. Der Prompt geht davon aus, dass der
    User diese Referenzen selbst hochlädt: **Logo** (`OneDrive\Bilder\KI AffAIrs\ki_affairs_logo_transparent_clean.png`),
    **Detailbild** + **Profilansichten** von Claus (`assets\000_PP-1`, `001_PP-2`, `OneDrive\Bilder\KI AffAIrs\IMG_50xx.jpg`,
    `ChatGPT Image …png`) und **optional die Skyline** (`OneDrive\Bilder\KI AffAIrs\dortmund_skyline_ki_affairs_logo.png`).
    Der Prompt muss diese Referenzen explizit ansprechen, mild/positiv framen (Safety-Filter), Badge-Text buchstabengenau,
    Farben #2EC4C6 cyan / #E97132 orange, Logo dezent unten rechts, 16:9. → ablegen als `bilder\_chatgpt-prompt-<name>.txt`.
- **3e LinkedIn-Set (STANDARD ab Folge 035, User-Vorgabe 2026-06-21): pro Folge IMMER 3 Beiträge + 3 Bilder.**
  - **3 Beiträge** in `linkedin-posts.md` (Brand-Voice-Skill, nur Whitelist-Zahlen):
    1. **Quicky** (Montag, Alarm/Problem) · 2. **Deep Dive** (Donnerstag, Lösung) · 3. **Blog-Teaser** (Mittwoch, verweist auf den Blog).
  - **3 Bilder** (16:9, je Beitrag eins): `bilder\linkedin-quicky.png`, `linkedin-deepdive.png`, `linkedin-blog.png`.
    - Quicky/Deep Dive: mit Claus-Likeness + prominenter Kernaussage-Headline (Quicky orange, Deep Dive cyan).
    - **Blog-Bild = festes Blog-Setting** (Tech-Noir-Konzept, KEIN Porträt, KEIN Text; Bildunterschrift + Blog erklären).
  - Logo NIE vom Modell malen lassen → per `tools\thumb_template.py` / `fix_logo_headline.py` (transparentes Logo, fester DIN-Badge). Siehe `THUMBNAIL-STANDARD.md`.
- **3f Podcast-Thumbnails (ab Folge 32):** 2 Thumbnails (Quicky + Deep Dive) via `tools\gen_scene.py`, **16:9**,
  mit Claus-Likeness (`assets\000_PP-1`+`001_PP-2`) + KI-Hexagon-Logo dezent + Badge-Label „QUICKY"/„DEEP DIVE".
  Farblogik: Quicky = Orange/Dringlichkeit (Problem), Deep Dive = Cyan/menschliche Kontrolle (Lösung). Kurze
  Labels rendert der Generator i. d. R. sauber, **Kunstwörter aber Spelling explizit erzwingen** (sonst
  Verstümmelung wie „GEICKY"); je weniger Fremdtext im Bild, desto sicherer. → `bilder\thumbnail-quicky.png`, `thumbnail-deepdive.png`.

### Phase 4 — Veröffentlichung
- **Blog:** Blogger (DE-Blog 7960190015368829692). Bilder im Editor hochladen → gehostete /s1600/-URLs.
- **Spotify Creators (geplant, NUR Browser — keine API/MCP):** Audio + Beschreibung hochladen. TODO.

---

## 2) Werkzeuge & Befehle

- **NotebookLM-CLI (venv):** `"C:/Users/czeis/notebooklm-mcp-venv/Scripts/python.exe" -m notebooklm <cmd>`
  - Befehle: `create`, `list`, `delete -n <NB> -y`, `source add <URL> -n <NB>`, `source wait`,
    `generate audio "<prompt>" -n <NB> --format [brief|deep-dive] --language de --wait`,
    `download audio "<pfad>" -n <NB> --force`, `ask "<frage>" -n <NB> --json`.
  - Login läuft ~täglich ab → `python -m notebooklm login` (meldet meist sofort „Already logged in").
  - **Steuerung NUR via CLI, NICHT MCP** (MCP-Server-Deadlock am Login-Profil). **Strikt seriell**,
    nie parallel/fan-out (Profil-Lock).
- **TurboScribe:** isolierter Playwright-Server, eingeloggt als cz.rules11@googlemail.com. Wal-Modus,
  Deutsch. Signierte TXT-Download-URL per `curl.exe -sL -o ziel.txt "<URL>"` (oder Invoke-WebRequest).
- **Blogger:** MCP `mcp__blogger__*` (User-Scope). Bild-MCP/-Skill NICHT vorhanden → Bilder via Browser-Editor.
- **Bilder:** `tools\gen_scene.py` (nano_banana). Immer `PYTHONIOENCODING=utf-8`.

---

## 3) Wichtige Gotchas (verifiziert)

- **Shell:** Diese Maschine läuft über PowerShell. Venv-Python direkt aufrufen ist OK.
  `Start-Process` und Hintergrund-`http.server` vermeiden (EPERM/abgelehnt). Multi-line-Python an
  `python -c` quotet schlecht → lieber kleine `.py`-Datei schreiben und mit Pfad-Arg aufrufen.
- **Lokales Rendern:** NICHT gegen das echte Chrome-Profil (Playwright bootet `--user-data-dir`,
  Timeout + fremde proctor.io-Verbindung → Bitdefender-Block). Stattdessen HTML per `document.write`
  in die isolierte Playwright-Instanz injizieren ODER Blogger-Vorschau-iframe-URL
  `kiaffairs.blogspot.com/b/blog-preview?token=…` direkt als Top-Level öffnen.
- **Blogger-API (MCP):** `get_post`/`update_post` liefern **404 bei Entwürfen UND geplanten Posts** →
  MCP erreicht nur LIVE-Posts. Geplante/Entwurf-Posts NUR über den Editor bearbeiten.
- **Blogger-Editor:** HTML-Ansicht-Textarea `textarea[jsname="bqeLof"]` — `.value` programmatisch
  setzen wird beim Speichern IGNORIERT (eigenes Editor-Modell). Editor-**Speichern/Terminieren erhält**
  geladenes `<script>`/`<details>`/Style verbatim. → Inhalts-Update an geplantem Post =
  `create_post(draft)` → Editor terminieren → alten Post verwerfen.
- **Terminieren:** rechtes Panel „Veröffentlicht am" → „Datum und Uhrzeit festlegen" → Kalender + Uhrzeit
  (30-Min-Raster) → oben „Veröffentlichen" → „Bestätigen" (= Warteschlange, nicht sofort live).
- **Verwerfen:** Postliste → „Postliste verwalten" → Checkbox je Zeile → Toolbar-Papierkorb → bestätigen.
  Bei gleichnamigen Posts Checkbox-Zuordnung per DOM (Checkbox → nächster `a[href*=post/edit/<ID>]`)
  verifizieren, NICHT auf Position verlassen.
- **Brand:** „K I-Affairs" mit Leerzeichen in Audio-Prompts ist ABSICHT (TTS-Aussprache). Blog: keine
  Gerüst-Labels im Live-Text, keine Gedankenstriche als Verbinder.

---

## 4) Aktueller Status

> **RESUME-PUNKT (Stand 2026-06-13):** Heute Arbeit an **Folge 34 = 03-010 „KI-Warnungen & Risiko"**:
> 3 Bild-Assets via `tools\gen_scene.py` erzeugt + Spotify-Upload-Paket gebündelt → siehe Abschnitt „Folge 03-010" unten.
> Laut User-Angabe ist **Folge 33 „KI-Content"** komplett **live** (Quicky + Deep Dive + Blog). 03-010-Blog ist laut User
> bereits online (war 17.06. terminiert).
> **NEU 03-010 (2026-06-13):** `bilder\thumbnail-quicky.png` (Orange, Warn-Dreieck, Badge QUICKY) +
> `thumbnail-deepdive.png` (Cyan, Governance-Zahnräder + Zero-Trust-Shield, Badge DEEP DIVE) + `bilder\linkedin.png`
> (nächtl. Boardroom, autonomer KI-Agent + Governance-Panel) erstellt; `_SPOTIFY-UPLOAD.md` bündelt Audios + Titel +
> Beschreibungen (Q034/L034) + Cover für den manuellen Spotify-Upload.
> **OFFEN 03-010:** manueller Spotify-Upload beider Episoden (Login-Block); optional 1:1-Cover-Crops für Spotify-Episode-Art;
> User-Abnahme der 3 Bilder (Likeness) noch ausstehend.
> **OFFEN aus Vortagen:** 03-008-Pipeline komplett (außer Thumbnails); Spotify-Upload Vorfolgen; Deep-Dive-Show-Notes
> 03-009 optional.
> **TOOL-FIX (2026-06-13):** `gen_scene.py` KEY_CANDIDATES um realen Key-Pfad `~/OneDrive/Claude/Projects/Bild Skill/api_keys.env`
> ergänzt (lag NICHT unter `…/Dokumente/…`). Brand-Logo: `OneDrive/Bilder/KI AffAIrs/ki_affairs_logo_transparent_clean.png`.
> Python mit `requests`: das System-`python` (3.13), NICHT das notebooklm-venv.
> **SAFETY-LEHRE (gemini-3.1-flash-image):** Bei realer Personen-Likeness lehnt das Modell Prompts mit dichter
> Angriffs-/Gefahr-Sprache ab (`finishReason: IMAGE_OTHER`, nicht berechnet) — z. B. „attacker drones hammer firewall",
> „danger zone", „escalating risks unsupervised". Lösung: mild/positiv framen („alert symbol", „rising importance of AI
> safety", „governance brings order") wie die funktionierenden 03-008-Prompts. Diskriminierender Test: harmloser Prompt
> mit denselben Refs läuft sofort durch → isoliert Prompt-Inhalt vs. Likeness.

### Folge 03-008 „Human Consent Standard" (Folge 32, NB 3ba07034-3419-4de0-b9b7-64f574b461e2)
- **NEU 2026-06-07:** Ordner `Staffel 03\03-008_Human-Consent-Standard\bilder\` angelegt; zwei **Podcast-Thumbnails**
  via `tools\gen_scene.py` (16:9, Claus-Likeness aus `assets\000_PP-1` + `001_PP-2`, KI-Hexagon-Logo dezent unten rechts):
  - `thumbnail-quicky.png` — Orange-dominant, Claus drückt orangenen Not-Aus, Badge **QUICKY**. (v1 hatte
    Generator-Tippfehler „GEICKY" → neu erzeugt mit explizitem Spelling + Button ohne Aufschrift, jetzt korrekt.)
  - `thumbnail-deepdive.png` — Cyan-dominant (menschliche Kontrolle), Human-in-the-Loop-Cockpit, orange
    KI-Empfehlungs-Panels, Badge **DEEP DIVE**. Restpunkt: Panel-Fließtext ist Gibberish (Thumbnail-tauglich,
    optional neu mit reduzierten Labels „KI-EMPFEHLUNG"/„MENSCHLICHE FREIGABE").
  - Prompts gesichert: `bilder\_prompt-quicky.txt`, `_prompt-deepdive.txt`.
- **Inhalt (per NotebookLM `ask`):** Human Consent Standard = zwingende menschliche Aufsicht (Human Oversight) +
  informationelle Selbstbestimmung; EU AI Act + DSGVO → kein unkontrollierter KI-Letztentscheid, Entscheidungs-
  vorbehalt, Stopptaste/Eingriff bei Hochrisiko-KI; Schutz vor maschineller Fremdbestimmung.
- **Sonst noch nichts:** kein Audio/Transkript/Blog/Beschreibung — Folge steht erst am Pipeline-Anfang.

### Folge 03-009 „Deepfake-Gesetz" (NB 9faa2c5c)
- Quicky + Deep-Dive: Audio + Transkripte **fertig**; `beschreibung-quicky.md`, `blogpost.md`,
  `podcast-beschreibung.txt`, `linkedin-posts.md`, `bilder\linkedin.png` + 4er-Set **fertig**.
- Blog (GEO-Version) **geplant 10.06.2026 08:30** (Blogger DE, Post-ID 2399202157330639737, mit
  Auf-einen-Blick-Box, Quellen, FAQ-Dropdown, JSON-LD). Alter Post 8671 + GEO-Test-Entwürfe verworfen.
- **Offen:** `beschreibung-deepdive.md` (Deep-Dive-Show-Notes) optional; Spotify-Upload (manuell).

### Folge 03-010 „KI-Warnungen und Risiko" (NB 4d7d4b25-b648-482d-9fbf-71b93547fb96)
- Autonomer Lauf 2026-06-02. Winkel: globales KI-Sicherheits-/Ethik-Framework (EU AI Act + NIST +
  ISO 42001 + Singapur agentic), Ironie via Al Jazeera/Katar, Bogen global → Unternehmen → Abteilungen,
  Governance-First.
- **Quellen kuratiert:** 107 → 24 (44 Auto-Clean Müll/Fehler + 39 Off-Topic gelöscht; gelöschte URLs
  gesichert/wiederherstellbar — User hat „24 passen" abgenommen).
- **Fertig:** `audio\quicky.m4a` (1:45) + `deep-dive.m4a` (27:46); beide Transkripte; `blogpost.md`;
  `blogpost-blogger.html` (gestylt, 4 Bilder eingebettet); `beschreibung-quicky.md` + `beschreibung-deepdive.md`;
  `linkedin-posts.md`; `podcast-beschreibung.txt`; 4-Bilder-Set (`bilder\` hero/compliance/icon/trust).
- **Flags:** Quicky-AUDIO sagt „35 Mio für Hochrisiko" (Texte korrekt gestaffelt 35/7 Art.5 vs 15/3) →
  Audio nur bei User-Wunsch neu erzeugen. `trust.png` hat winzige Dashboard-Mikro-Texte (optional neu).
- **Blog FERTIG (2026-06-03):** GEO-Version terminiert für **17.06.2026 08:30** (Blogger DE,
  Post-ID **4782147833906333238**, Auf-einen-Blick-Box + Quellen + FAQ-Dropdown (6 grounded) + JSON-LD,
  4 Bilder als /s1600/-URLs, Suchbeschreibung im Editor-Feld gesetzt). `blogpost-blogger.html` = finale
  GEO-Version mit echten Bild-URLs, `blogpost-blogger-nogeo.html` = Backup. Dummy-Upload-Entwurf verworfen.
- **Bilder fertig (2026-06-13):** `bilder\thumbnail-quicky.png` + `thumbnail-deepdive.png` (16:9 Podcast-Thumbnails,
  Claus-Likeness + KI-Hexagon, Badges QUICKY/DEEP DIVE korrekt) + `bilder\linkedin.png`. Prompts gesichert
  (`bilder\_prompt-thumb-quicky.txt`, `_prompt-thumb-deepdive.txt`, `_prompt-linkedin.txt`).
- **ChatGPT-Prompts (2026-06-13, User-Standard):** zu allen drei Bildern je ein copy-paste-fertiger ChatGPT-Image-Prompt:
  `bilder\_chatgpt-prompt-thumb-quicky.txt`, `_chatgpt-prompt-thumb-deepdive.txt`, `_chatgpt-prompt-linkedin.txt`
  (mit Upload-Liste: Logo + Detailbild + Profilansichten, Skyline bei Deep Dive optional / bei LinkedIn ideal).
- **Spotify-Paket:** `_SPOTIFY-UPLOAD.md` im Folge-Ordner bündelt Audios + Titel + Beschreibungen (Q034/L034) + Cover.
- **Offen:** manueller Spotify-Upload beider Episoden (Login-Block); optional 1:1-Cover-Crops für Spotify-Episode-Art;
  Blog laut User bereits online.

### Neue Tools/Befunde (2026-06-02)
- `tools\probe_duration.py <m4a>` (Dauer ohne Deps), `tools\sources_table.py` + `tools\curate.py`
  (Quellen klassifizieren/löschen). NotebookLM-CLI läuft über PowerShell (venv-Python direkt).
- `source clean -y` entfernt Müll/Fehler; gezielt löschen per `source delete <id> -n <NB> -y`.
- gen_scene.py: KEINE doppelten Anführungszeichen im Prompt (bricht PowerShell-Arg-Übergabe).
- Out-File `-Encoding utf8` schreibt BOM → in Python mit `utf-8-sig` lesen.
