# Blog-Upload Folge 035 — Übergabe (manuell in Blogger)

Quelle: `blogpost-blogger.html` (fertige GEO-HTML im `.ki-post-wrapper`-Dark-Design, gleiche Vorlage wie 036). Faktencheck-konform (nur Whitelist-Zahlen, Blacklist vermieden), Brand Voice geprüft, JSON-LD valide, WEF-Zahl gegen Primärquelle verifiziert. Account-Editor: **clauszeissler@affairs-consulting.de** (authuser /u/1/), deutscher Blog (ID 7960190015368829692).

## 1. Blogger-Felder
- **Post-Titel:** Die Autopilot-Falle: Wie unreflektierte KI dein Team stumpf macht
- **Suchbeschreibung** (rechte Seitenleiste → „Suchbeschreibung"): *Deskilling durch KI ist real: Häufige, unreflektierte KI-Nutzung schwächt das kritische Denken. So schützt du die Kompetenz deines Teams mit Human-in-the-Loop statt Verbot.*
- **Labels:** Deskilling, Human-in-the-Loop, AI-Literacy, kritisches Denken, Mittelstand, KI AffAIrs
- **Datum:** terminieren auf **Mi, 24.06.2026** (passt zum Footer/Meta im HTML).

## 2. Upload in 5 Schritten
1. Blogger → **Neuer Beitrag** → Titel eintragen.
2. Oben links Stift-Icon → auf **„HTML-Ansicht"** umschalten.
3. Kompletten Inhalt aus `blogpost-blogger.html` **einfügen**.
4. Zurück zur **Verfassen-Ansicht**: die Bilder per Drag & Drop an die markierten Stellen ziehen (Platzhalter `bilder/*.png` ersetzen). Blogger hostet sie selbst (`/s1600/`-URLs).
5. **Zuletzt** das JSON-LD prüfen (Abschnitt 4) — danach NICHT mehr in die Verfassen-Ansicht zurück.

## 3. ⚠️ Bilder — noch offen (Entscheidung nötig)
Folge 035 hat **keine eigenen Blog-Bilder** (anders als 036). Das HTML referenziert 2 Platzhalter:
| # | Datei | Stelle | Motiv |
|---|-------|--------|-------|
| 1 | `bilder/hero.png` | ganz oben (Hero) | geteiltes Gehirn-Hologramm: eine Hälfte lebendig, eine als Autopilot-Schaltkreis |
| 2 | `bilder/neuro.png` | Abschnitt „Use it or lose it" | Gehirn, halb lebendiges Neuronennetz, halb erstarrter Schaltkreis |

**Optionen:**
- **A — neu generieren (empfohlen):** 2 Konzept-Bilder nach neuem Standard (Tech-Noir, kein Text, kein Porträt, Logo per Template), ~0,80 $. Sauberste Variante.
- **B — vorhandenes wiederverwenden:** das 035-LinkedIn-Motiv (Claus + geteiltes Gehirn) als Hero — hat aber Headline-Text drauf, daher nicht ideal als Blog-Hero.
- **C — nur 1 Hero:** `neuro.png`-Block aus dem HTML entfernen, nur ein Hero-Bild.

→ Sag mir A/B/C, dann ziehe ich die Bilder entsprechend.

## 4. Quick-Übersicht & FAQ — wie aufgebaut/einzubinden
Identisch zum 036-Standard (siehe `03-012/BLOG-UPLOAD-036.md`):
- **Quick-Übersicht („Auf einen Blick"):** Fakten-Box direkt nach dem Intro, vor dem ersten `<h2>`, 6 Zeilen Schlüssel→Wert (`<div class="ki-tldr">`). Nur Whitelist-Zahlen.
- **FAQ — 2 Teile:** (a) sichtbar 6 aufklappbare `<details>` am Ende; (b) unsichtbar das `<script type="application/ld+json">` FAQPage. **Blogger strippt `<script>` in der Verfassen-Ansicht** → JSON-LD im HTML-Modus einfügen und danach nicht zurückwechseln. Sichtbarer Text und JSON-LD sind wortgleich.

## Faktencheck-Notiz (verifiziert)
Nur Whitelist/Nachrecherche-Zahlen: r = −0,68 (Societies/MDPI), 8 von 10 Schüler UK (OUP), Fraunhofer-Autopilot-Falle, 319 Wissensarbeiter (Microsoft/CMU), WEF 39 %/59 % bis 2030 (gegen Primärquelle geprüft). **Vermieden** (Blacklist): „300 Mrd weltweit", „71 %", „67 % Mitarbeiterbindung", „synthetische Kognition".
