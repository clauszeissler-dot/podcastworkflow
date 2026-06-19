// Podcast-Faktencheck — Claude-Code-Workflow-Referenzimplementierung (Phase 1.2b)
// Aufruf:  Workflow({ scriptPath: "tools/factcheck-workflow.js", args: CLAIMS })
//   CLAIMS = [{ id: "035-1", text: "53,6% nutzen KI ... (George Mason 2025)" }, ...]
//   Eine Behauptung = ein Eintrag. IDs frei (z.B. "<folge>-<n>").
// Ergebnis: { verdicts, whitelist, blacklist, hohes_risiko } — daraus faktencheck.md bauen.
// Prinzip: 1 adversarischer Web-Pruefer je Claim, parallel; Reddit/Boulevard zaehlt NICHT.

export const meta = {
  name: 'podcast-faktencheck',
  description: 'Adversarischer Faktencheck der Folgen-Behauptungen gegen Primaerquellen (Standard-Phase 1.2b)',
  phases: [{ title: 'Faktencheck', detail: 'ein Web-Pruefer je Behauptung' }],
}

const VERDICT = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    behauptung: { type: 'string' },
    status: { type: 'string', enum: ['bestaetigt', 'teilweise', 'unbelegt', 'widerlegt'] },
    primaerquelle_gefunden: { type: 'boolean' },
    beleg: { type: 'string' },
    korrektur: { type: 'string' },
    risiko_im_podcast: { type: 'string', enum: ['niedrig', 'mittel', 'hoch'] },
    anmerkung: { type: 'string' },
  },
  required: ['id', 'behauptung', 'status', 'primaerquelle_gefunden', 'beleg', 'korrektur', 'risiko_im_podcast', 'anmerkung'],
  additionalProperties: false,
}

const CLAIMS = Array.isArray(args) ? args : []
if (!CLAIMS.length) { log('Keine CLAIMS uebergeben — args = [{id, text}, ...] erwartet.'); return { verdicts: [] } }

phase('Faktencheck')
const verdicts = (await parallel(CLAIMS.map(c => () =>
  agent(
    `Du bist ein adversarischer Faktenpruefer fuer einen deutschen KI-Podcast (KI AffAIrs). Pruefe EINE Behauptung streng gegen Primaerquellen.

BEHAUPTUNG [${c.id}]:
${c.text}

VORGEHEN:
1. Lade Web-Tools: ToolSearch query "select:WebSearch,WebFetch".
2. Suche die ORIGINAL-Primaerquelle (Studie, Behoerde, Fachjournal, Gesetzestext). Pruefe: existiert die Quelle? Stimmt die Zahl exakt? Stimmt das Jahr? Deckt die Quelle die Aussage — oder ist sie verkuerzt/fehlattribuiert?

STRENGE REGELN:
- Reddit, Boulevard, Marketing-Blogs, KI-generierte Artikel, Vendor-PR zaehlen NICHT als Beleg.
- Default Skepsis: exakte Zahl + Quelle nicht serioes bestaetigt => status "unbelegt", nicht "bestaetigt".
- Aussagen ueber Firmen/Produkte/Personen besonders kritisch (Rufschaden-/Haftungsrisiko).
- risiko_im_podcast = Schaden fuer die Glaubwuerdigkeit, wenn ungeprueft gesendet.

Gib NUR das strukturierte Verdict zurueck. Deutsche Umlaute korrekt.`,
    { label: `check:${c.id}`, phase: 'Faktencheck', agentType: 'general-purpose', schema: VERDICT }
  ).then(v => v ? { ...v, id: v.id || c.id } : null)
))).filter(Boolean)

const whitelist = verdicts.filter(v => v.status === 'bestaetigt' || v.status === 'teilweise')
const blacklist = verdicts.filter(v => v.status === 'unbelegt' || v.status === 'widerlegt')
log(`Faktencheck: ${verdicts.length}/${CLAIMS.length} geprueft — whitelist=${whitelist.length}, blacklist=${blacklist.length}, hochrisiko=${verdicts.filter(v=>v.risiko_im_podcast==='hoch').length}`)

return {
  verdicts,
  whitelist: whitelist.map(v => v.id),
  blacklist: blacklist.map(v => v.id),
  hohes_risiko: verdicts.filter(v => v.risiko_im_podcast === 'hoch').map(v => v.id),
}
