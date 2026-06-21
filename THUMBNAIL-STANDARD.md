# Thumbnail- & Bild-Standard (Wiedererkennungswert)

**Ziel:** Jede Folge sofort als KI-AffAIrs-Podcast erkennbar. Erreicht durch einen **festen Marken-Rahmen** bei **freiem, thematischem Motiv**.

## Hybrid-Prinzip (festgelegt 21.06.2026)
| Ebene | Wie | Warum |
|---|---|---|
| **Badge** (QUICKY / DEEP DIVE) | **fest per Code** — `tools/thumb_template.py` | immer identisch → Wiedererkennung, kostenlos, Text korrekt |
| **Logo** | **fest per Code** — transparentes PNG unten rechts | Marke immer sauber |
| **Headline** (Kernaussage) | **nativ im KI-Motiv** generiert | verschmilzt mit Licht/Tiefe (nicht aufgeklebt) |
| **Motiv** (Claus + Szene) | KI-generiert (gpt-image-2), je Thema frei | Abwechslung, kreative Ideen (z. B. „Wer wird Millionär"-Quiz für Tool-Wahl) |

## Feste Spezifikation
- **Format:** 1280×720 (16:9), natives 16:9 generieren (`--size 1792x1024`).
- **Badge** (oben links, fester Abstand 3 %): dunkle rechteckige Metall-Plakette, **DIN Condensed Bold** (Versalien, leicht gesperrt), **linker Akzentbalken** + dünner Rand + dezenter Glow.
  - **QUICKY = Orange `#E97132`**, **DEEP DIVE = Cyan-Teal `#2EC4C6`**.
- **Headline** (rechte Bildhälfte / oben, native Generierung): 2–4 Wörter Kernaussage, große fette Schrift, weiß mit Markenfarb-Akzent + Glow, **korrekte deutsche Umlaute**, sonst kein weiterer Text.
- **Logo:** `Bild Assets/ki_affairs_logo_transparent_clean.png` (RGBA!), unten rechts, ~11,5 % Bildbreite.
- **Farb-Logik:** **Quicky = Orange (Alarm/Problem)**, **Deep Dive = Cyan (Lösung/Kontrolle)** — durchgängig.
- **Motiv:** Claus (Likeness aus `assets/000_PP-1`,`001_PP-2`), Tech-Noir „Dark-Tech Ruhrgebiet"/Blade-Runner-2049-Look, klar geschichtet. **Im Motiv-Prompt: KEIN QUICKY/DEEP-DIVE-Badge, KEIN Logo, KEINE realen Fremd-Markenlogos** (Badge/Logo kommen per Template; obere linke + untere rechte Ecke freihalten).

## Workflow (Reihenfolge)
1. **Motiv + Headline** generieren: `gen_thumb_v2.py` mit Headline im Prompt, **ohne** Badge/Logo, untere-rechte + obere-linke Ecke frei.
2. **Rahmen** setzen: `thumb_template.py --in motiv.png --out final.png --kind quicky|deepdive` → fester Badge + Logo.
   - Für Altbilder mit bereits eingebranntem Badge: `--cover-old` (dunkelt die Eckzone ab).

## Kosten-Regel
Nur **Motive** verbrauchen API-Credits. Badge/Logo/Headline-Textwechsel im Rahmen = **0 $**. Vor Neugenerierung immer prüfen, ob nur der Rahmen geändert werden muss.

## LinkedIn / Blog
- **LinkedIn:** gleicher Rahmen optional (Badge weglassbar), Kernaussage prominent, **nie** Konstellationen, die übergriffig wirken (kein „Person sitzt / zweite Person steht dahinter").
- **Blog-Bilder:** Mischung Person/Konzept, **kein Text** (Bildunterschrift + Fließtext erklären), Logo per Template.
