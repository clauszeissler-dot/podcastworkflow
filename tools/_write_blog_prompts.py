#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
D = Path.home() / "Desktop/Claude/Code/podcastworkflow-cz/Staffel 03/03-012_KI-lernt-luegen/bilder"

NO_LOGO = ("Marke/Logo: Lasse die untere rechte Bildecke ruhig und frei. Male dort selbst KEIN Logo "
           "und keine Buchstaben — dort wird separat das echte KI-AffAIrs-Logo eingefügt.")
NO_TEXT = "Text im Bild: KEIN Text, keine Buchstaben, keine Pseudo-Schrift, keine Zahlen."
ONE_PERSON = ("WICHTIG: Es ist NUR EINE EINZIGE Person im Bild (Claus). KEINE weitere Person, KEINE "
              "zusätzliche Silhouette, KEINE Mantelfigur, KEINE Schattengestalt.")
NO_PERSON = ("WICHTIG: ABSOLUT KEINE Person im Bild — keine Menschen, keine Silhouette, keine Mantelfigur, "
             "keine Schattengestalt, keine Hand. Reines Konzeptbild ohne jede Figur.")
CLAUS = ("Die beigefügten Fotos zeigen einen echten Mann namens Claus, Mitte 40, kurze dunkle Haare, "
         "gepflegter Dreitagebart, dunkler Blazer. Übernimm sein Gesicht und seine Identität exakt und "
         "konsistent, fotorealistisch, eine echte Person, niemals ein Roboter, niemals karikiert.")
STYLE = "Stil: Tech-Noir, Dark-Tech Ruhrgebiet, fotorealistisch wie Blade Runner 2049, dramatisches Rim-Light, volumetrischer Dunst, hoher Detailgrad. Querformat 16:9."

PROMPTS = {
 "hero": "\n\n".join([
   "Fotorealistisches, kinoreifes Querformat 16:9 im Tech-Noir-Stil (Dark-Tech Ruhrgebiet, Blade Runner 2049). " + CLAUS,
   "Szene (einfach, auf einen Blick verständlich): Claus steht links im Bild, souverän, mit skeptisch-prüfendem Ausdruck, und blickt auf eine große, glänzende holografische KI-Bestenliste mit einem leuchtenden goldenen Pokal und einer großen Nummer 1. Doch das Hologramm bekommt sichtbar Risse und zerfällt an den Rändern in digitale Glitch-Bruchstücke — die scheinbar perfekte Bestnote entlarvt sich als Fassade. Cyan-türkise Gitterlinien (#2EC4C6) treffen auf orange Energierisse (#E97132).",
   NO_TEXT, NO_LOGO, ONE_PERSON, STYLE]),
 "trust": "\n\n".join([
   "Fotorealistisches, kinoreifes Querformat 16:9 im Tech-Noir-Stil (Dark-Tech Ruhrgebiet, Blade Runner 2049). " + CLAUS,
   "Szene (einfach, auf einen Blick verständlich): Claus steht rechts im Bild, souverän und konzentriert, und wählt mit einer Hand gezielt aus mehreren schwebenden, holografischen KI-Tool-Karten genau die EINE Karte aus, die ein klares, leuchtend grünes Häkchen trägt. Die anderen Karten erscheinen neutral oder mit kleinen orangen Warnsymbolen. Die Botschaft: souveräne, geprüfte Auswahl statt blindem Ranking-Vertrauen. Dominanz kühles Cyan-Teal (#2EC4C6) für Klarheit, ruhiger grüner Akzent am Häkchen, dezente orange Akzente (#E97132).",
   NO_TEXT, NO_LOGO, ONE_PERSON, STYLE]),
 "cost": "\n\n".join([
   "Fotorealistisches, kinoreifes Querformat 16:9 im Tech-Noir-Stil (Dark-Tech, Blade Runner 2049). Reines Konzeptbild.",
   "Szene (einfach, sofort verständlich): Ein holografisches Kosten-Diagramm schießt explosionsartig steil nach oben. Aus dem Diagramm lösen sich leuchtende digitale Tokens und Geldfragmente, die wie Geld verbrennen. Unter der Wasserlinie deutet ein großer Eisberg an, dass nur die Spitze sichtbar ist (versteckte Kosten). Dominanz warnendes Orange (#E97132) für die Kostenexplosion, mit cyan-türkisen Akzenten (#2EC4C6) für den Eisberg unter Wasser. Volumetrischer Dunst, dramatisches Licht.",
   NO_TEXT, NO_LOGO, NO_PERSON, STYLE]),
 "compliance": "\n\n".join([
   "Fotorealistisches, kinoreifes Querformat 16:9 im Tech-Noir-Stil (Dark-Tech, Blade Runner 2049). Reines Konzeptbild.",
   "Szene (einfach, sofort verständlich): Zentral schwebt als Hologramm eine glänzende Justitia-Waage neben einem leuchtenden Schutzschild-Symbol, sauber umgeben von einem geschlossenen Kreis aus zwölf gleichmäßig angeordneten EU-Sternen als feine Lichtpunkte. Die Komposition strahlt rechtliche Klarheit und Schutz aus. Dominanz kühles Cyan-Teal (#2EC4C6) für Klarheit und Kontrolle, gezielte orange Akzente (#E97132). Volumetrischer Dunst, dramatisches Rim-Light.",
   NO_TEXT, NO_LOGO, NO_PERSON, STYLE]),
}

for name, txt in PROMPTS.items():
    p = D / f"_api-prompt-blog-{name}.txt"
    p.write_text(txt + "\n", encoding="utf-8")
    print(f"OK {p.name} ({len(txt)} chars)")
