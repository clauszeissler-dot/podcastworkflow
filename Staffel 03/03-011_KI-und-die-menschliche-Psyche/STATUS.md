# STATUS — Folge 035 „KI und die menschliche Psyche" (NB 03-011) — Audio/Content ✅ · Blog (Text+4 Bilder) ✅ · nur noch Blogger-Upload offen

**Autonomer Lauf, 19.06.2026.** Account: cz.rules11@googlemail.com.

## Fertig ✅
- **Quellen:** 40 → kuratiert → 38 `ready` (Müll raus + Lücken gefüllt). `delete_ids.txt`, `nachrecherche.md`.
- **Faktencheck (1.2b):** `faktencheck.md` — Blacklist in Audio-Prompts; im Audio + Content eingehalten (verifiziert: keine 300 Mrd / 67 % / „synthetische Kognition").
- **Audio:** `audio/quicky.m4a` (1:57) + `audio/deep-dive.m4a` (25:37). NotebookLM, Faktencheck-Blacklist beachtet.
- **Transkripte:** `transkript/` — quicky + deep-dive je plain + timed. TurboScribe Wal. **2/3 Transkriptionen** genutzt.
- **Content:** `podcast-beschreibung.txt` (Q035 + L035, Hooks/Insights/**Kapitel**/CTA), `linkedin-posts.md`. Nur belegte Zahlen (r=−0,68 MDPI, 8/10 Oxford, Fraunhofer-Autopilot), „Sully Sullenberger" korrigiert.

## QS-Notizen
- Deep-Dive-Audio nennt „24 % der US-Erwachsenen für emotionale Unterstützung" — **nicht in Whitelist** (George Mason war 53,6 %/80 %). Bewusst NICHT in den Content übernommen. Bei Bedarf vor Veröffentlichung verifizieren oder im Skript ersetzen.
- Reale Schadensfälle im Audio (Sewell Setzer/Character.AI, Pierre/Belgien) — belegt über jugendschutz.net/Common Sense Media.

## NEU 19.06. abends — Thumbnails fertig ✅
- `bilder/thumbnail-quicky.png` (Gehirn-Autopilot, orange) + `thumbnail-deepdive.png` (HITL-Kreislauf, cyan), 1280×720 via `tools/gen_thumb_openai.py`. API-Prompts gesichert. Gepusht.

## NEU 20.06. ✅
- **LinkedIn-Bild (035) generiert:** `bilder/linkedin.png` (1280×720, via gen_thumb_openai.py: Fachkraft im Autopilot-Modus mit gedimmtem Gehirn-Hologramm, Claus als Mentor, Cyan/Orange, Logo sauber). Likeness + Marke visuell geprüft.

## NEU 21.06. — Alle Bilder neu (gpt-image-2, keine Skyline) ✅
- **Thumbnails** (quicky/deepdive) behalten, nur Postprocessing `tools/fix_logo_headline.py`: Logo-Bug gefixt (transparentes Logo statt schwarzem Block) + Kernaussage-Headline: Quicky „DENKT KI FÜR DICH?", DeepDive „MENSCH AM STEUER". Rohbilder `_raw-*.png`.
- **LinkedIn neu** (`linkedin.png`): altes Bild (Fachkraft sitzt / Claus steht dahinter) wirkte wie Belästigung am Arbeitsplatz → ersetzt. Jetzt Claus allein + geteiltes Gehirn, Kernaussage „DIE AUTOPILOT-FALLE" prominent. Alt gesichert als `_v1-linkedin.png`.
- Logo-Root-Cause + Tools s. 036-STATUS / Memory [[podcast-workflow]].

## NEU 23.06. — Blog (Phase 3b) sauber NACHGEHOLT + Blog-Bilder vorbereitet
- **Befund (User-Frage):** Der bisherige `blogpost-blogger.html` war NICHT über NotebookLM erstellt (Phase 3b übersprungen) —
  es fehlten `blogpost-report-raw.md` + `blogpost.md`. Der Text nutzte den nachrecherche-Pool (r=−0,68/Microsoft-CMU/WEF/Fraunhofer)
  statt der NB-Quellen. Beide blacklist-sauber, aber nur der neue ist quellenverankert. Lehre in `~/.claude/LEARNINGS.md` eingetragen.
- **Nachgeholt:** NotebookLM-Report aus NB `d92a32f7-2bef-45fb-904f-0dacea8353b2` gezogen (38 Quellen `ready`, `ask --prompt-file`,
  KEIN `--new`) → `blogpost-report-raw.md` → bereinigt zu `blogpost.md` (quellenverankert, faktentreu: George Mason 53,6/80 %,
  JMIR g≈0,50, Freiburg & Heidelberg + Caveat, DAK, OUP 8/10; Blacklist vermieden).
- **`blogpost-blogger.html` NEU gebaut** (GEO-Design wie 036): Hero + TL;DR-Box + 3 Mythos-Checks + Pro-Checkliste + 4 Bild-Blöcke +
  Quellen + 6 FAQ (`<details>`) + JSON-LD FAQPage. Verifiziert: JSON-LD valide, 0 lange Gedankenstriche, Blacklist sauber, „KI AffAIrs" korrekt.
- **4 Blog-Bilder geplant + Prompts erstellt** (je aus dem Text vor dem Bild abgeleitet, einfache Bildsprache, KEIN Text, abwechslungsreiche Settings):
  `hero` (Claus + geteiltes Gehirn) · `therapeut` (Smartphone-Glühen, Konzept) · `maske` (Maske+Schaltkreise, Konzept) · `kontrolle` (Claus an Kontroll-Interface).
  API-Prompts: `bilder/_api-prompt-blog-*.txt` · ChatGPT-Prompts (mit Upload-Liste): `bilder/_chatgpt-prompt-blog-*.txt`.
- **Bilder-API blockte** mit `billing_hard_limit_reached` → Weg über ChatGPT/GPT-4o (User manuell).

## NEU 24.06. — Alle 4 Blog-Bilder fertig ✅ (manuell via ChatGPT, vom User abgenommen)
- `bilder/hero.png` (Claus + geteiltes Gehirn cyan/orange) · `therapeut.png` (Smartphone-Chat-Glühen, Konzept) ·
  `maske.png` (Maske halb Mensch/halb Schaltkreis, Konzept) · `kontrolle.png` (Claus an Kontroll-Interface).
  Alle 1672×941 (sauberes 16:9), kein Text, abwechslungsreiche Settings, Logo drauf. User: „passen alle".
  ChatGPT-Originale als `ChatGPT Image 24. Juni 2026, 00_20_*.png` im Ordner belassen (Backup).
- **Blog 035 ist damit inhaltlich + visuell KOMPLETT.**

## NEU 24.06. — Blog 035 LIVE ✅ + Text auf Brand Voice überarbeitet
- **Text-Überarbeitung (User-Wunsch 24.06.):** NotebookLM-Output war reiner Clickbait („Vergiss den Bullshit", „fliegt SOFORT raus", „ahnungslose Schläfer", „Wach auf oder verschwinde", „99 %/1 % der Macher"). `blogpost.md` + `blogpost-blogger.html` mit Skill `ki-affairs-brand-voice` neu gefasst: ruhig/fundiert, Du-Form, Held = Mittelständler, KI AffAIrs als Guide, Anker Human-in-the-Loop. Alle Whitelist-Zahlen unverändert (George Mason 53,6/80 %, JMIR g≈0,50, Freiburg/Heidelberg, DAK, Oxford 8/10). Keine langen Gedankenstriche, JSON-LD valide.
- **Bilder:** die 4 gestern (24.06. früh, via ChatGPT) abgenommenen Blog-Bilder genommen (hero/therapeut/maske/kontrolle), NICHT neu generiert (User-Entscheidung).
- **Veröffentlicht** über bestehenden Entwurf `4069301355051665834` (statt neu): 4 Bilder via Editor hochgeladen → `/s1672/`-Blogger-URLs ins HTML, HTML per CodeMirror-API gesetzt, Labels (Deskilling, Human-in-the-Loop, AI-Literacy, kritisches Denken, Mittelstand, KI AffAIrs) + Suchbeschreibung gesetzt, veröffentlicht.
- **LIVE + verifiziert:** https://kiaffairs.blogspot.com/2026/06/die-autopilot-falle-wie-unreflektierte.html — alle 4 Bilder laden (1672px), Brand-Voice-Text, TL;DR, 2 Mythos-Boxen, FAQ, Quellen, JSON-LD FAQPage valide, kein Clickbait.
- **Browser-Gotcha:** Bloggers HTML-Editor (CodeMirror) hängt nach programmatischem setValue gelegentlich bei „Wird geladen…"; Vorschau/Reload zeigt aber den korrekt gespeicherten Stand. Clipboard-Paste per `navigator.clipboard.readText` braucht `context.grantPermissions(['clipboard-read'])` (über `browser_run_code_unsafe`); `require`/`import` im evaluate-VM gesperrt.

## Offen
- [ ] **Test-Entwurf `6964638675636862885` (leer, „Unbenannt") löschen** — Automatisierung scheitert an Bloggers Hover-Checkbox/„Post verwerfen"-Flow (mehrfach versucht, greift nicht durch). Manuell: Postliste → Zeile überfahren → auswählen → „Post verwerfen". Harmlos (leer, nicht öffentlich).
- [ ] Upload YouTube/Spotify — durch User (neue Bilder verwenden)
