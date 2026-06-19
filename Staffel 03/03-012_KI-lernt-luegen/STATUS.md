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

## Offen (morgen, 20.06., neues Transkriptions-Limit)
- [ ] Deep-Dive (036) → TurboScribe → `transkript/deep-dive.txt` + timed → **L036-Beschreibung** + ggf. Deep-Dive-LinkedIn
- [ ] **LinkedIn-Bilder (035 + 036) generieren** — User-Entscheidung 19.06.: JA, beide (per gen_thumb_openai.py / API)
- [ ] **036-Quicky-Thumbnail Logo-Makel** (Text rendert „AFIAlrs" statt sauberem Hexagon): User entscheidet morgen, ob neu generieren
- [ ] Upload YouTube/Spotify/Blogger (durch User)
