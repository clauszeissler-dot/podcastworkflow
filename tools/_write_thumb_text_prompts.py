#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Schreibt Thumbnail-Prompts mit NATIV integrierter Headline (statt Pillow-Overlay)."""
from pathlib import Path
B = Path.home() / "Desktop/Claude/Code/podcastworkflow-cz/Staffel 03"
D11 = B / "03-011_KI-und-die-menschliche-Psyche/bilder"
D12 = B / "03-012_KI-lernt-luegen/bilder"

CLAUS = ("Die beigefügten Fotos zeigen einen echten Mann namens Claus, Mitte 40, kurze dunkle Haare, "
         "gepflegter Dreitagebart, dunkler Blazer. Übernimm sein Gesicht, seine Proportionen und seine "
         "Identität exakt und konsistent, fotorealistisch, eine echte Person, niemals ein Roboter, niemals karikiert.")
LOGO = ("Marke/Logo: Lasse die untere rechte Bildecke ruhig, dunkel und frei von Objekten und Text. Male "
        "dort selbst KEIN Logo und keine Buchstaben — dort wird separat das echte KI-AffAIrs-Logo eingefügt.")
STYLE = ("Stil: Tech-Noir, Dark-Tech Ruhrgebiet, fotorealistisch wie Blade Runner 2049, dramatisches Rim-Light, "
         "volumetrischer Dunst, hoher Detailgrad, Querformat 16:9.")

def textblock(plakette_wort, plakette_farbe, headline, head_farbe, head_pos):
    return (
        f"Text im Bild (sauber und exakt geschrieben, KEINE Pseudo-Buchstaben, KEINE falschen Zeichen):\n"
        f"1) Oben links eine dunkle, rechteckige Metall-Plakette mit dem {plakette_farbe}farbenen Wort "
        f"«{plakette_wort}» in fetten Großbuchstaben, perfekt lesbar.\n"
        f"2) Eine GROSSE, prominente Marketing-Headline «{headline}» — fett, klar, in {head_farbe} mit weißem "
        f"Kern und dunklem Rand für Kontrast, professionell als kinoreifer Grafik-Text {head_pos} ins Thumbnail "
        f"integriert (NICHT flach aufgeklebt, sondern mit Bild-Licht, Glow und Tiefe verschmelzend). "
        f"Exakt diese Schreibweise Wort für Wort, inklusive korrekter deutscher Umlaute, große Schrift, "
        f"auf einen Blick lesbar. Sonst KEIN weiterer Text."
    )

PROMPTS = {
 D11/"_api-prompt-thumb-quicky-text.txt": "\n\n".join([
   "Erzeuge ein fotorealistisches, kinoreifes YouTube-Thumbnail im Querformat 16:9. " + CLAUS,
   ("Szene mit klarer Aktion: Claus steht rechts im Bild und hält mit wachem, alarmiertem Ausdruck ein "
    "leuchtend-oranges Hologramm eines menschlichen Gehirns in seiner offenen Hand. Die eine Hälfte pulsiert "
    "lebendig mit neuronalen Funken, die andere Hälfte erstarrt zu einem kühlen, mechanischen Autopilot-"
    "Schaltkreis. Hintergrund: dunkler High-Tech-Raum mit orangem Dunst. Farb-Dominanz kräftiges Orange "
    "(#E97132), minimale cyan-türkise Akzente."),
   textblock("QUICKY", "orange", "DENKT KI FÜR DICH?", "kräftigem Orange/Weiß", "oben rechts / rechte Bildhälfte"),
   LOGO, STYLE]),
 D11/"_api-prompt-thumb-deepdive-text.txt": "\n\n".join([
   "Erzeuge ein fotorealistisches, kinoreifes YouTube-Thumbnail im Querformat 16:9. " + CLAUS,
   ("Szene mit klarer Aktion: Claus steht links im Bild, souverän und ruhig, halb der Kamera zugewandt, und "
    "justiert mit einer Hand ein stabil leuchtendes Hologramm, das einen geschlossenen Kreislauf zwischen einem "
    "menschlichen Gehirn und einem KI-Knoten zeigt (Human-in-the-Loop). Der Mensch hat sichtbar die Kontrolle. "
    "Hintergrund: dunkler High-Tech-Raum mit feinen cyan-türkisen Linien. Farb-Dominanz kühles Cyan-Teal "
    "(#2EC4C6), gezielte orange Akzente am KI-Element."),
   textblock("DEEP DIVE", "cyan-türkis", "MENSCH AM STEUER", "kräftigem Cyan-Teal/Weiß", "oben rechts / rechte Bildhälfte"),
   LOGO, STYLE]),
 D12/"_api-prompt-thumb-deepdive-text.txt": "\n\n".join([
   "Erzeuge ein fotorealistisches, kinoreifes YouTube-Thumbnail im Querformat 16:9. " + CLAUS,
   ("Szene mit klarer Aktion: Claus steht links im Bild, souverän und analytisch, und wählt mit einer Hand "
    "gezielt aus mehreren schwebenden, holografischen KI-Tool-Karten genau die EINE Karte mit klarem grünem "
    "Häkchen aus; die anderen Karten zeigen kleine orange Warnsymbole. Die Tool-Karten tragen NUR abstrakte, "
    "generische Symbole (Sechsecke, Kreise, Netzknoten) — KEINE realen Marken-/Firmenlogos, KEINE Buchstaben "
    "auf den Karten. Hintergrund: dunkler High-Tech-Raum, feine cyan-türkise Linien. Farb-Dominanz kühles "
    "Cyan-Teal (#2EC4C6), gezielte orange Akzente."),
   textblock("DEEP DIVE", "cyan-türkis", "TOOLS RICHTIG WÄHLEN", "kräftigem Cyan-Teal/Weiß", "oben rechts / rechte Bildhälfte"),
   LOGO, STYLE]),
}
for p, txt in PROMPTS.items():
    p.write_text(txt + "\n", encoding="utf-8")
    print(f"OK {p.parent.parent.name}/{p.name}")
