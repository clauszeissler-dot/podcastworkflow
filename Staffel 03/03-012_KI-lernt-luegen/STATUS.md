# STATUS — Folge 036 „KI lernt lügen / Die große KI-Tool-Falle" (NB 03-012)

**Autonomer Lauf, 19.06.2026.** Account: cz.rules11@googlemail.com.
**Vorgabe:** wegen Free-Limit (3 Transkriptionen/Tag, heute durch 035+036-Quicky erschöpft) heute nur der **Quicky vollständig**.

## Fertig ✅
- **Quellen:** 44 → kuratiert → 37 `ready` (7 Müll raus: Cloudflare/404/error). `delete_ids.txt`.
- **Faktencheck (1.2b):** `faktencheck.md` — Blacklist (130 Mrd / „Spionage" / „Betrug" / OpenClaw-als-CLTR) in Audio-Prompts.
- **Quicky-Audio:** `audio/quicky.m4a` (1:58, „Manipulierte Benchmarks und explodierende KI Kosten").
- **Quicky-Transkript:** `transkript/quicky.txt` + `quicky-timed.txt`. TurboScribe Wal. **3/3 Limit erschöpft.**
- **Quicky-Content:** `podcast-beschreibung.txt` (Q036, Kapitel), `linkedin-posts.md`. Brand-Voice-Check bestanden.
- **Deep-Dive-Audio:** `audio/deep-dive.m4a` (14:12, „Warum KI Benchmarks Ihr Unternehmen täuschen") — **bereits generiert, transkriptionsbereit**.

## 🎯 Faktencheck-Erfolg (verifiziert im Quicky-Audio)
Die heiklen Modell-Claims wurden vom Audio korrekt entschärft:
- Opus 4.6/4.7 = „Reward-Hacking via geleakte git-History" (NICHT „Betrug zu 12 %")
- Fable 5 = „Jailbreak + US-Exportkontroll-Direktive" (NICHT „Spionage")
- keine „130 Mrd"; belegte Zahlen (1,2 Mio/+108 %, 5x CLTR, 35 Mio/7 %) korrekt.

## NEU 19.06. abends — Thumbnails fertig ✅
- `bilder/thumbnail-quicky.png` + `thumbnail-deepdive.png` (1280×720) via `tools/gen_thumb_openai.py` (gpt-image-1, Likeness+Logo). API-Prompts gesichert. Gepusht.

## NEU 20.06. — Deep-Dive transkribiert + L036 fertig ✅
- **Deep-Dive-Transkript:** `transkript/deep-dive.txt` + `deep-dive-timed.txt` (mit Sprecher-Labels Host/Cohost).
  TurboScribe war per Cloudflare-Bot-Block dicht → stattdessen **OpenAI `gpt-4o-transcribe-diarize`**
  (neues `tools/transcribe_openai.py`). Sprecher + genaue Zeitstempel, Glossar-Korrektur (KI AffAIrs etc.),
  Post-Merge auf genau 2 Sprecher. Eigennamen sauberer als TurboScribe.
- **L036-Deep-Dive-Beschreibung:** in `podcast-beschreibung.txt` ergänzt (Brand-Voice, Kapitel mit Zeitstempeln,
  nur Whitelist-Zahlen, BLACKLIST vermieden: Fable 5 = Exportkontrolle nicht Spionage, Opus = Reward-Hacking,
  OpenClaw separat von CLTR). Faktencheck-konform verifiziert.

## NEU 20.06. — restliche Schritte fertig ✅
- **LinkedIn-Bild (036) generiert:** `bilder/linkedin.png` (Claus wählt souverän die Tool-Karte mit Häkchen, zerfallender Pokal, Cyan-Kontrolle, Logo sauber). Likeness + Marke visuell geprüft. Prompt: `bilder/_api-prompt-linkedin.txt`.
- **036-Quicky-Thumbnail neu** (`bilder/thumbnail-quicky.png`): Logo-Makel behoben — Hexagon zeigt jetzt sauber „KI" statt „AFIAlrs". Alte Version gesichert als `_thumbnail-quicky-v1-logomakel.png`. Logo-Prompt entschärft (`_api-prompt-thumb-quicky-v2.txt`: kein Buchstaben-Rendering erzwingen).
- **Deep-Dive-LinkedIn-Post (L036):** in `linkedin-posts.md` ergänzt (Lösungs-Framework: 4 Auswahlkriterien, Brand Voice, Whitelist-Zahlen, faktencheck-konform).
- Sprecher-Labels im Deep-Dive-Transkript auf „Sprecher 1/2" normiert (User-Wunsch: korrekte 2-Sprecher-Zuordnung, Benennung egal).

## NEU 20.06. — Blog (Phase 3b) komplett gebaut ✅
- **Report via NotebookLM** (das „Woher-Ding"): `ask --prompt-file` auf NB e61f4cee (03-012) mit Blog-Prompt + Faktencheck-Whitelist/Blacklist → `blogpost-report-raw.md`. **Gotcha gefunden:** `ask --new` mit prompt-file abortet („Abort"); OHNE `--new` läuft es.
- **Bereinigt → `blogpost.md`**: NotebookLM-Citations + Conversation-Header raus, harte Terminal-Umbrüche entwrappt, „K I-Affairs" → „KI AffAIrs". Persona/Struktur kam schon aus dem Prompt (kein Brand-Voice-Drüberbügeln nötig).
- **`blogpost-blogger.html`**: GEO-Version im `.ki-post-wrapper`-Dark-Design (TL;DR-Box, 4 Mythos-Checks, Pro-Checkliste mit 4 Kriterien, Quellen, 6 grounded FAQ als `<details>` + JSON-LD FAQPage). Faktencheck verifiziert (Whitelist-Zahlen, Blacklist entschärft, 0 lange Gedankenstriche, JSON-LD valide).
- **4 Blog-Bilder** (konzeptionell, Tech-Noir, kein Porträt, nur Logo-Ref): `bilder/hero.png` (zerfallender Pokal), `cost.png` (Kostenexplosion), `compliance.png` (Waage+Schild+EU-Sterne), `trust.png` (Auswahl mit Häkchen). Visuell geprüft. Prompts: `bilder/_api-prompt-blog-*.txt`.

## NEU 20./21.06. — Bild-Qualität: Umstieg auf gpt-image-2 ✅ (PoC bestätigt)
- **Problem (User-Feedback):** alle bisherigen Bilder mit altem `gen_thumb_openai.py` = **gpt-image-1** → Likeness „plastisch"/Bart, Refs auf 1024px gestaucht, **Logo nie getroffen**.
- **Fix = neues `tools/gen_thumb_v2.py`** (gpt-image-2 + volle Refs + Logo-Compositing). PoC am Quicky-Thumbnail vom User als „viel besser" bestätigt. Finale Version mit Text: `bilder/_poc-image2/final-quicky-gptimage2-text.png` (Badge QUICKY + Headline „DIE KI-FALLE", Logo exakt, 16:9 ohne Abschnitt).
- Verifiziert: gpt-image-2 ohne `input_fidelity`; Safe-Zone im Prompt nötig (16:9-Crop schneidet oben/unten ~8 %); Text mitgenerierbar.

## ✅ GELÖST 21.06. — Abschneide-Problem (Kopf + Text) durch natives 16:9
- **Befund:** Erstes finales Bild schnitt Kopf/Stirn/Haar + oberen Text ab. **Ursache:** Tool erzeugte 3:2 (1536×1024) und croppte hart auf 16:9 → oben ~160px weg.
- **Lösung (umgesetzt):** `gpt-image-2` kann **`1792x1024` = natives 16:9 direkt** (verifiziert, Status 200). Tool-Default in `gen_thumb_v2.py` auf 1792×1024 umgestellt → nur noch 8px-Restcrop, nichts Wichtiges weg. Korrektes Ergebnis: `bilder/_poc-image2/quicky-16x9-nativ.png` (Kopf komplett, QUICKY + „DIE KI-FALLE" komplett, Logo exakt).
- Optionales Extra (nur falls Modell-Text mal verrutscht): Text per Pillow-Overlay NACH der Generierung — aktuell nicht nötig, native 16:9 reicht.

## NEU 21.06. — ALLE Bilder 035+036 neu generiert ✅ (gpt-image-2, keine Skyline)
- **Root-Cause Logo-Bug gefunden+gefixt:** `ki_affairs_logo_2048.png` ist **RGB OHNE Alpha** → Compositing klebte einen **schwarzen Block** ins Bild ("schlecht integriert"). Fix: `gen_thumb_v2.py` nutzt jetzt **`ki_affairs_logo_transparent_clean.png` (RGBA, echtes Alpha)**; `composite_logo` warnt bei fehlendem Alpha. (Repo-Logo-Default dauerhaft umgestellt.)
- **Konzeptbilder ohne Referenz:** `gen_thumb_v2.py` erweitert → bei 0 Refs `POST /v1/images/generations` (statt edits), `n` als Integer. So echte refless Konzeptbilder (kein Logo-als-Ref-Trick mehr).
- **Thumbnails (Skyline=keine):** behalten (Likeness gut), nur **Postprocessing** via neuem `tools/fix_logo_headline.py` (Eck-Scrim kaschiert alten Block + transparentes Logo + prominente **Headline**). Rohbilder als `_raw-*.png` gesichert.
  - 036 Quicky „DIE KI-FALLE" · 036 DeepDive „TOOLS RICHTIG WÄHLEN" · 035 Quicky „DENKT KI FÜR DICH?" · 035 DeepDive „MENSCH AM STEUER".
- **036 LinkedIn:** behalten (pass). **035 LinkedIn neu** (altes wirkte wie Belästigung am Arbeitsplatz → User-Stopp): Claus allein + geteiltes Gehirn, Kernaussage „DIE AUTOPILOT-FALLE" prominent.
- **036 Blog (User-Wunsch: Mischung Person/Konzept, schnell verständlich, KEIN Text):** `hero`+`trust` **mit Claus** neu, `cost`+`compliance` als **reine Konzepte** (explizit „keine Person/Silhouette" — alte hatten ungewollte Mantel-Silhouetten). Alle mit transparentem Logo.
- **Alte Versionen gesichert:** `_v1-*.png` (Bilder), `_raw-*.png` (Thumbnails ohne Overlay). Adversariale Multi-Agent-QA-Runde 1 (vor Fixes) hatte Silhouetten/Logo-Block/Fremdmarke korrekt geflaggt.
- [ ] **Restmakel (optional, niedrig):** 036 DeepDive-Thumb hat OpenAI-Blüten-Icon als Fremdmarke auf einer Tool-Karte + Mikro-Fantasietext „A!/M" — bei Bedarf neu.

## Offen — Blogger/Upload (durch User bzw. nach Bild-Neugenerierung)
- [ ] **Blogger-Test-Post `6964638675636862885` (Entwurf) aufräumen/löschen** — diente nur dem Bild-Upload (alte Bilder); s1600-URLs sind durch die Neugenerierung hinfällig.
- [ ] Blogger-Editor: NEUE Bilder hochladen → `/s1600/`-URLs in `blogpost-blogger.html` (lokale Platzhalter `bilder/*.png`) ersetzen; Datum + Suchbeschreibung; terminieren. Zugang = Browser-Editor über Account **clauszeissler@affairs-consulting.de** (authuser /u/1/); Blogger-MCP-Token ist 401 (abgelaufen).
- [ ] Upload YouTube/Spotify (durch User)
