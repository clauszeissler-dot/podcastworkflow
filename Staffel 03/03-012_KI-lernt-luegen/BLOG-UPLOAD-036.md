# Blog-Upload Folge 036 — Übergabe (manuell in Blogger)

Quelle: `blogpost-blogger.html` (fertige GEO-HTML im `.ki-post-wrapper`-Dark-Design). Account-Editor: **clauszeissler@affairs-consulting.de** (authuser /u/1/), deutscher Blog (ID 7960190015368829692).

## 1. Blogger-Felder
- **Post-Titel:** Die große KI-Tool-Falle: Warum Benchmarks dein Business zerstören
- **Suchbeschreibung** (rechte Seitenleiste → „Suchbeschreibung"): *99% der Firmen verbrennen Geld mit falschen KI-Tools. Bis zum 2. August 2026 drohen Millionenstrafen. Rette dein Business jetzt vor dem sicheren Absturz!*
- **Labels:** KI-Tool-Auswahl, Benchmarks, Total Cost of Ownership, EU AI Act, Mittelstand, KI AffAIrs
- **Datum:** terminieren auf **Do, 25.06.2026** (Deep-Dive-Tag), passend zum Footer im HTML.

## 2. Upload in 5 Schritten
1. Blogger → **Neuer Beitrag** → Titel eintragen.
2. Oben links Stift-Icon → auf **„HTML-Ansicht"** umschalten.
3. Kompletten Inhalt aus `blogpost-blogger.html` **einfügen**.
4. Zurück zur **Verfassen-Ansicht**: die **4 Bilder** per Drag & Drop an die markierten Stellen ziehen — die lokalen Platzhalter `bilder/*.png` ersetzen. Blogger hostet sie selbst (`/s1600/`-URLs).
5. **Zuletzt** das JSON-LD prüfen (Schritt 4 bei FAQ unten) — danach NICHT mehr in die Verfassen-Ansicht zurück.

### Bild-Reihenfolge / Einfügestellen
| # | Datei | Stelle im Text | Motiv |
|---|-------|----------------|-------|
| 1 | `bilder/hero.png` | ganz oben (Hero) | zerfallende Bestenliste = Benchmark-Illusion |
| 2 | `bilder/cost.png` | Abschnitt „Explodierende Kosten" | Kostenexplosion + Eisberg |
| 3 | `bilder/compliance.png` | Abschnitt „EU AI Act / Compliance" | Justitia + Schild + EU-Sterne |
| 4 | `bilder/trust.png` | Abschnitt „Pro-Checkliste / Lösung" | Hand wählt Karte mit Häkchen |

## 3. Quick-Übersicht („Auf einen Blick") — wie sie aussehen muss
Eine kompakte Fakten-Box **direkt nach dem Intro, vor dem ersten `<h2>`**. Format: Überschrift „Auf einen Blick" + **6 Zeilen Schlüssel → Wert** (`<div class="ki-tldr">` im HTML). Zweck: Leser UND KI-Suchsysteme erfassen die Kernfakten in 5 Sekunden (GEO).

| Schlüssel | Wert |
|---|---|
| Worum es geht | KI-Tools nach Praxis statt nach öffentlichen Benchmarks auswählen |
| Das Kernproblem | Benchmark-Illusion, Datenkontamination und Reward-Hacking verfälschen Rankings |
| Die vier Kriterien | Pilottest mit echten Daten, Total Cost of Ownership, Datenschutz/EU AI Act, harte Exit-Verträge |
| Echte Kosten | KI-native Apps im Schnitt ~1,2 Mio US-Dollar/Jahr, +108 % zum Vorjahr (Zylo) |
| Rechtlicher Stichtag | Hochrisiko-Frist 2. August 2026 (Verschiebung geplant, noch nicht sicher) |
| Strafrahmen | bis 35 Mio € oder 7 % vom weltweiten Jahresumsatz (EU AI Act, Art. 99) |

**Regel für künftige Folgen:** immer 5–6 Zeilen, nur **Whitelist-Zahlen** (faktencheck-konform), keine Blacklist-Claims. Werte = die zentralen Fakten der Folge, knapp.

## 4. FAQ — wie sie einzubinden ist (2 Teile!)
Die FAQ besteht aus **zwei Teilen**, die beide rein müssen:

**a) Sichtbar — aufklappbare Fragen** (`<div class="ki-faq">` mit 6 × `<details><summary>…`): stehen am Ende vor dem Footer. 6 Fragen:
1. Warum sind öffentliche KI-Benchmarks für die Tool-Auswahl ungeeignet?
2. Was kostet ein KI-Tool wirklich?
3. Welche Strafen drohen nach dem EU AI Act?
4. Was bedeutet Reward-Hacking bei KI-Modellen?
5. Warum sind harte Exit-Verträge bei KI-Anbietern so wichtig?
6. Wie wählt man KI-Tools richtig aus?

**b) Unsichtbar — JSON-LD für SEO** (`<script type="application/ld+json">` mit `"@type":"FAQPage"`): ganz am Ende. Das ist der Teil, der bei Google **Rich Results / FAQ-Snippets** und Sprachassistenten-Antworten erzeugt.

**WICHTIG (Blogger-Falle):** Bloggers **Verfassen-Ansicht strippt `<script>`-Tags**. Deshalb:
- Das JSON-LD **im HTML-Modus** einfügen und danach **NICHT** mehr in die Verfassen-Ansicht zurückwechseln (sonst wird es gelöscht).
- Die 6 Fragetexte müssen **wortgleich** im sichtbaren `<details>` UND im JSON-LD stehen (sind sie bereits).
- Test nach Veröffentlichung: Google Rich Results Test (search.google.com/test/rich-results) auf die Post-URL → muss „FAQPage" erkennen.

**Regel für künftige Folgen:** immer 5–6 grounded FAQ, jede Antwort nur mit belegten (Whitelist-)Fakten; sichtbarer Text und JSON-LD synchron halten.
