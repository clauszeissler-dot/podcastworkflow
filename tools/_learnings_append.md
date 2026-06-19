
---

## Ergänzt 2026-06-01 — Deepfake-Post (KW24) aus Claude Code, ~3 Iterationen

### 2026-06-01 · Direkter API-Weg & gen_image.py-Bugs
**Beobachtung:** Bilder direkt per Bash aus Claude Code erzeugt. nano_banana (gemini-3.1-flash-image-preview) läuft zuverlässig. Zwei Bugs in gen_image.py: (1) Erfolgs-print mit ✓ / … crasht auf Windows-cp1252-Konsole NACH dem Speichern (Bild ist trotzdem gespeichert). (2) gpt_image schickt `response_format: b64_json` → OpenAI 400 (Parameter existiert nicht mehr); zudem Größe `1536x864` ungültig für gpt-image-2 (nur 1024x1024 / 1536x1024 / 1024x1536).
**Konsequenz:** Immer mit `PYTHONIOENCODING=utf-8` aufrufen. In gpt_image: `response_format` entfernen, 16:9 → 1536x1024. (Der Bild-Skill-Ordner war read-only → Fixes liefen über eine Kopie unter Podcast-Pipeline/tools.)
**Status:** offen — Original-gen_image.py patchen, sobald Ordner beschreibbar

### 2026-06-01 · Personen-Referenz (neues Tool gen_scene.py)
**Beobachtung:** gen_image.py behandelt jede Referenz als „Logo" — für ein echtes Gesicht falsch. Neues Script `…\Podcast-Pipeline\tools\gen_scene.py` trennt `--ref` (Personen-Likeness) und `--brand` (Logo). Mit ZWEI sauberen, echten frontalen Headshots (NICHT dem Collage-Charakterbogen — Collage-Risiko: Generator baut ein Raster nach) war die Likeness vom User bestätigt („trifft mich").
**Konsequenz:** Für Person-in-Szene gen_scene.py nutzen, 2 klare Headshots als --ref; Person und Logo getrennt instruieren.
**Status:** in Praxis bestätigt

### 2026-06-01 · Likeness läuft auf Nebenfiguren über (Doppel-Person)
**Beobachtung:** Bei mehreren Personen + Personen-Referenz bekam auch eine Nebenfigur das Gesicht der Hauptperson (Person doppelt im Bild, stehende Version zusätzlich „entfremdet").
**Konsequenz:** Im Prompt explizit: „exactly ONE person matches the reference, do not duplicate the face." Nebenpersonen klar anders beschreiben (Geschlecht, Haare, Brille, Alter, Kleidung).
**Status:** in SKILL.md aufnehmen

### 2026-06-01 · Blickrichtung & verwaiste Props
**Beobachtung:** Personen starrten „ins Leere", ein Laptop/Stuhl stand verwaist → wirkte, als fehle jemand.
**Konsequenz:** Blick der Personen explizit auf das relevante Element (Schild/Hologramm) richten. Props (Laptop, Tablet, Stuhl) immer mit aktiv nutzender Person belegen („actively typing on the laptop and looking at the shield").
**Status:** in SKILL.md aufnehmen

### 2026-06-01 · Logo-Farben & Bildtiefe
**Beobachtung:** Das KI-Hexagon verlor in einem Bild die Farbe (nur Cyan, Orange weg) = entfremdet. Default-Szenen wirkten flacher/detailärmer als die Manus-Vorlagen.
**Konsequenz:** Logo immer „in its ORIGINAL two colors, cyan-teal WITH orange accents, NOT monochrome" anfordern. Tiefe explizit verlangen: foreground/midground/background, Serverracks, volumetric light, layered depth, atmospheric perspective.
**Status:** in SKILL.md aufnehmen

### 2026-06-01 · „KI"-Hexagon statt Wordmark + Motiv-Dopplung im Set
**Beobachtung:** Das KI-Hexagon-Emblem (nur die 2 Buchstaben „KI") rendert per --brand-Referenz legibel und on-brand (im Schild, als Badge, in der Ecke). Der volle Wordmark „AffAIrs" bleibt unzuverlässig. Das große Hexagon zweimal prominent (Icon-Badge + Trust-Schild) wirkte als Dopplung.
**Konsequenz:** Marke über das KI-Hexagon einbauen, nicht über den Wordmark. Pro 4er-Set das große Hexagon nur EINMAL prominent (Icon), sonst klein/dezent (Trust-Schild → Häkchen + kleines Logo).
**Status:** in SKILL.md aufnehmen

### 2026-06-01 · 4-Bilder-pro-Post-Muster (wie Manus kw-Sets)
**Beobachtung:** Manus liefert pro Post 4 Bilder (kw24: hero/compliance/icon/trust = 2 cinematic Szenen + 1 Infografik + 1 Icon-Grafik). Halb-Infografik-Text klappt bei WENIGEN kurzen Labels sauber (EU AI ACT / ARTIKEL 50 / KENNZEICHNUNGSPFLICHT / PROVIDER WASSERZEICHEN / DEPLOYER OFFENLEGUNG / COMPLIANT); dichte Rechtsklauseln meiden.
**Konsequenz:** Standard pro Blog-Post = 4 Bilder, gemappt auf die Abschnitte; Person als roter Faden ab und zu, Logo „immer mal" dezent. Dieser Post brauchte ~3 Runden — mit diesen Lessons nächstes Mal idealerweise 1.
**Status:** Workflow-Standard
