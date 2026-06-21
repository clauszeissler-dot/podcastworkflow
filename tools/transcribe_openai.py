#!/usr/bin/env python3
"""
transcribe_openai.py — Podcast-Transkription via OpenAI (Ersatz fuer TurboScribe).

Nutzt gpt-4o-transcribe-diarize: liefert Sprechererkennung UND genaue Zeitstempel
(start/end je Segment) nativ. Faellt fuer reine Wort-Zeitstempel optional auf whisper-1.

Erzeugt (wie der bisherige TurboScribe-Workflow) zwei Dateien pro Audio:
  <ziel>.txt        — Plain-Transkript (Sprecher als Absatzwechsel)
  <ziel>-timed.txt  — (M:SS) [SPRECHER] Satz   je Zeile

Audio > 25 MB wird vorab per ffmpeg auf 16 kHz Mono-MP3 komprimiert (API-Limit).

Key: OPENAI_API_KEY aus ~/Documents/Claude/Projects/Bild Skill/api_keys.env (Mac)
oder Umgebungsvariable OPENAI_API_KEY (gleiche Mechanik wie gen_thumb_openai.py).

Aufruf:
  python3 tools/transcribe_openai.py <audio.m4a> <ziel-basis-ohne-endung> [--speakers Name1 Name2]
Beispiel:
  python3 tools/transcribe_openai.py "Staffel 03/03-012.../audio/deep-dive.m4a" \
      "Staffel 03/03-012.../transkript/deep-dive"
"""
import os, sys, json, subprocess, tempfile, argparse, base64, mimetypes
from pathlib import Path
import requests

# Feste NotebookLM-Stimmen (ueber alle Folgen identisch) -> erzwingt genau 2 Sprecher.
# Reihenfolge entspricht den Namen in DEFAULT_SPEAKERS.
REF_DIR = Path(__file__).resolve().parent / "refs"
DEFAULT_REFERENCES = [REF_DIR / "notebooklm_host.wav", REF_DIR / "notebooklm_cohost.wav"]
DEFAULT_SPEAKERS = ["Sprecher 1", "Sprecher 2"]

# Eigennamen-Glossar: diarize-Modelle unterstuetzen KEINEN prompt-Bias (API 400),
# daher deterministische Post-Korrektur haeufiger Verhoerer der Marke/Begriffe.
# (Regex, case-insensitive; Reihenfolge = Anwendungsreihenfolge.)
GLOSSARY = [
    (r"\bcarri[eè]re[ -]?fairs\b", "KI AffAIrs"),
    (r"\bcarrier[ -]?affairs\b", "KI AffAIrs"),
    (r"\bKIFERS\b", "KI AffAIrs"),
    (r"\bKIFERS?\b", "KI AffAIrs"),
    (r"\bKI[ -]?erf[aä]hrst\b", "KI AffAIrs"),
    (r"\bKI[ -]?Affairs\b", "KI AffAIrs"),
    (r"\bKI[ -]?Affär[ts]?\b", "KI AffAIrs"),
    (r"\bK[aä]fers\b", "KI AffAIrs"),
    (r"\bClode\b", "Claude"),
    (r"\bClaus Zeiss?ler\b", "Claus Zeißler"),
    (r"\bWarnbr[ie]n[gk][ -]?[ae]nlage\b", "Warnblinkanlage"),
    (r"\bSeeltr\b|\bC-L-T-R\b", "CLTR"),
]

KEY_CANDIDATES = [
    Path.home() / "Documents" / "Claude" / "Projects" / "Bild Skill" / "api_keys.env",
    Path.home() / "Dokumente" / "Claude" / "Projects" / "Bild Skill" / "api_keys.env",
    Path.home() / "OneDrive" / "Claude" / "Projects" / "Bild Skill" / "api_keys.env",
    Path.home() / ".config" / "ki-affairs" / "api_keys.env",
]
MAX_BYTES = 25 * 1024 * 1024
API_URL = "https://api.openai.com/v1/audio/transcriptions"


def load_key(name="OPENAI_API_KEY"):
    if os.environ.get(name):
        return os.environ[name]
    for p in KEY_CANDIDATES:
        if p.exists():
            for line in p.read_text().splitlines():
                if line.strip().startswith(name):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit(f"FEHLER: {name} nicht gefunden in {[str(p) for p in KEY_CANDIDATES]}")


def ensure_under_limit(audio: Path) -> Path:
    """Gibt einen Pfad <= 25 MB zurueck; komprimiert bei Bedarf per ffmpeg."""
    if audio.stat().st_size <= MAX_BYTES:
        return audio
    tmp = Path(tempfile.gettempdir()) / (audio.stem + "_16k.mp3")
    print(f"  Audio {audio.stat().st_size/1e6:.1f} MB > 25 MB -> ffmpeg 16 kHz Mono-MP3 ...")
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(audio), "-ac", "1", "-ar", "16000",
         "-b:a", "64k", str(tmp)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    print(f"  -> {tmp.stat().st_size/1e6:.1f} MB")
    if tmp.stat().st_size > MAX_BYTES:
        sys.exit("FEHLER: Audio auch nach Komprimierung > 25 MB. Bitte splitten.")
    return tmp


def fmt_ts(seconds: float) -> str:
    s = int(round(seconds))
    return f"{s // 60}:{s % 60:02d}"


def data_url(path: Path) -> str:
    mime = mimetypes.guess_type(str(path))[0] or "audio/wav"
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"


def transcribe(audio: Path, key: str, speaker_names, reference_clips) -> dict:
    upload = ensure_under_limit(audio)
    data = [
        ("model", "gpt-4o-transcribe-diarize"),
        ("response_format", "diarized_json"),
        ("chunking_strategy", "auto"),
    ]
    # Sprecher-Referenzen erzwingen genau diese N Sprecher (gegen Ueber-Diarisierung).
    if reference_clips:
        for name in speaker_names:
            data.append(("known_speaker_names[]", name))
        for clip in reference_clips:
            data.append(("known_speaker_references[]", data_url(Path(clip))))
    with open(upload, "rb") as f:
        files = {"file": (upload.name, f, "application/octet-stream")}
        r = requests.post(API_URL, headers={"Authorization": f"Bearer {key}"},
                          data=data, files=files, timeout=600)
    if r.status_code != 200:
        sys.exit(f"OpenAI API error {r.status_code}: {r.text[:900]}")
    return r.json()


def merge_to_named(segs, allowed):
    """Fehl-Splits (IDs ausserhalb 'allowed') auf den zeitlich naechsten
    benannten Sprecher mappen. Nutzt zeitliche Kontinuitaet: ein faelschlich
    abgespaltenes Segment liegt fast immer mitten in einer Passage des realen
    Sprechers. Gibt (bereinigte_segs, anzahl_gemerged) zurueck."""
    allow = set(allowed)
    named_idx = [i for i, s in enumerate(segs) if s.get("speaker") in allow]
    if not named_idx:
        return segs, 0
    merged = 0
    for i, s in enumerate(segs):
        if s.get("speaker") in allow:
            continue
        # naechstes benanntes Segment (zeitlich/Index-Naehe)
        nearest = min(named_idx, key=lambda j: abs(j - i))
        s["speaker"] = segs[nearest]["speaker"]
        merged += 1
    return segs, merged


def apply_glossary(text: str) -> str:
    import re
    for pat, repl in GLOSSARY:
        text = re.sub(pat, repl, text, flags=re.IGNORECASE)
    return text


def write_outputs(resp: dict, base: Path, allowed=None, single_speaker=False):
    segs = resp.get("segments") or []
    if not segs:
        sys.exit(f"FEHLER: keine Segmente in Antwort. Keys: {list(resp.keys())}")
    if single_speaker:
        # Quicky: garantiert 1 Sprecher -> alle Segmente auf ein Label normieren.
        label = (allowed or ["Sprecher"])[0]
        for s in segs:
            s["speaker"] = label
        allowed = None  # kein Merge noetig
    fixes = 0
    for s in segs:
        orig = s.get("text", "")
        new = apply_glossary(orig)
        if new != orig:
            fixes += 1
        s["text"] = new
    if fixes:
        print(f"  Glossar-Korrektur: {fixes} Segmente angepasst")
    if allowed:
        before = sorted({s.get("speaker") for s in segs})
        segs, merged = merge_to_named(segs, allowed)
        if merged:
            print(f"  Post-Merge: {merged} Fehl-Split-Segmente auf {allowed} gemappt "
                  f"(vorher: {', '.join(before)})")
    timed = base.with_name(base.name + "-timed.txt")
    plain = base.with_name(base.name + ".txt")
    with open(timed, "w", encoding="utf-8") as f:
        for s in segs:
            spk = s.get("speaker", "?")
            f.write(f"({fmt_ts(s.get('start', 0))}) [{spk}] {s.get('text','').strip()}\n")
    # Plain: bei Sprecherwechsel neuer Absatz, sonst zusammenhaengend
    lines, cur, last = [], [], None
    for s in segs:
        spk = s.get("speaker", "?")
        if spk != last and cur:
            lines.append(" ".join(cur)); cur = []
        cur.append(s.get("text", "").strip()); last = spk
    if cur:
        lines.append(" ".join(cur))
    plain.write_text("\n\n".join(lines) + "\n", encoding="utf-8")
    speakers = sorted({s.get("speaker", "?") for s in segs})
    print(f"  geschrieben: {plain.name} + {timed.name} "
          f"({len(segs)} Segmente, Sprecher: {', '.join(speakers)})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("base", help="Ziel-Basispfad ohne Endung (z. B. .../transkript/deep-dive)")
    ap.add_argument("--mode", choices=["deepdive", "quicky"], default="deepdive",
                    help="deepdive = 2 feste Sprecher (m+w), quicky = genau 1 Sprecher")
    ap.add_argument("--speakers", nargs="*", default=None,
                    help="Sprechernamen ueberschreiben (Default je nach Modus)")
    ap.add_argument("--references", nargs="*", default=None,
                    help="Referenz-Audioclips 1.2-10s (Default: tools/refs NotebookLM-Stimmen)")
    ap.add_argument("--save-json", help="rohe API-Segmente zusaetzlich als JSON ablegen")
    a = ap.parse_args()
    audio = Path(a.audio)
    if not audio.exists():
        sys.exit(f"FEHLER: Audio nicht gefunden: {audio}")
    # Feste Sprecherzahl je Format (User-Vorgabe): Quicky = 1, Deep Dive = 2 (m+w).
    if a.mode == "quicky":
        refs, names, single = [], (a.speakers or ["Sprecher"])[:1], True
    else:
        refs = a.references or [str(p) for p in DEFAULT_REFERENCES if p.exists()]
        names = a.speakers or DEFAULT_SPEAKERS[:len(refs)]
        single = False
    key = load_key()
    mode = (f"Deep Dive / {len(refs)} feste Sprecher ({', '.join(names)})"
            if not single else f"Quicky / 1 Sprecher ({names[0]})")
    print(f"Transkribiere {audio.name} via gpt-4o-transcribe-diarize [{mode}] ...")
    resp = transcribe(audio, key, names, refs)
    if a.save_json:
        Path(a.save_json).write_text(json.dumps(resp, ensure_ascii=False, indent=1), encoding="utf-8")
    write_outputs(resp, Path(a.base), allowed=names, single_speaker=single)


if __name__ == "__main__":
    main()
