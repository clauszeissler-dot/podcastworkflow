// Translations extracted to separate file for code-splitting
// This allows the main bundle to stay smaller
export type Language = 'de' | 'en' | 'tl';

interface Translations {
  [key: string]: {
    de: string;
    en: string;
    tl: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': { de: 'Home', en: 'Home', tl: 'Home' },
  'nav.resources': { de: 'Ressourcen', en: 'Resources', tl: 'Mga Mapagkukunan' },
  'nav.episodes': { de: 'Folgen', en: 'Episodes', tl: 'Mga Episode' },
  'nav.blog': { de: 'Blog', en: 'Blog', tl: 'Blog' },
  'nav.faq': { de: 'FAQ', en: 'FAQ', tl: 'FAQ' },
  'nav.about': { de: 'Über mich', en: 'About', tl: 'Tungkol sa Akin' },
  'nav.newsletter': { de: 'Newsletter', en: 'Newsletter', tl: 'Newsletter' },
  'nav.contact': { de: 'Kontakt', en: 'Contact', tl: 'Kontak' },
  
  // Hero
  'hero.title': { de: 'KI AffAIrs', en: 'AI AffAIrs', tl: 'AI AffAIrs' },
  'hero.subtitle': { 
    de: 'Der Podcast zwischen Fortschritt und Verantwortung', 
    en: 'The Podcast Between Progress and Responsibility',
    tl: 'Ang Podcast sa Pagitan ng Pag-unlad at Responsibilidad'
  },
  'hero.cta': { de: 'Jetzt anhören', en: 'Listen Now', tl: 'Makinig Ngayon' },
  'hero.schedule': {
    de: 'Mo 10:00 Quickie • Do 10:00 Volle Folge',
    en: 'Mon 10:00 Quickie • Thu 10:00 Full Episode',
    tl: 'Lun 10:00 Quickie • Huw 10:00 Buong Episode'
  },

  // Episodes
  'episodes.title': { de: 'Aktuelle Folgen', en: 'Latest Episodes', tl: 'Mga Pinakabagong Episode' },
  'episodes.quickie': { de: 'Quickie', en: 'Quickie', tl: 'Quickie' },
  'episodes.full': { de: 'Volle Folge', en: 'Full Episode', tl: 'Buong Episode' },
  'episodes.share': { de: 'Teilen', en: 'Share', tl: 'Ibahagi' },
  'episodes.listen': { de: 'Anhören auf', en: 'Listen on', tl: 'Makinig sa' },

  // Blog
  'blog.title': { de: 'Blog', en: 'Blog', tl: 'Blog' },
  'blog.readMore': { de: 'Weiterlesen', en: 'Read More', tl: 'Magbasa Pa' },
  'blog.loading': { de: 'Laden...', en: 'Loading...', tl: 'Naglo-load...' },
  'blog.comingSoon': { 
    de: 'Der englische Blog ist in Arbeit - bald verfügbar!', 
    en: 'English blog coming soon - stay tuned!', 
    tl: 'Ang English blog ay paparating na!' 
  },

  // FAQ
  'faq.title': { de: 'Häufige Fragen', en: 'FAQ', tl: 'Mga Madalas Itanong' },

  // About
  'about.title': { de: 'Über mich', en: 'About Me', tl: 'Tungkol sa Akin' },
  'about.role': { de: 'Host & Gründer', en: 'Host & Founder', tl: 'Host at Tagapagtatag' },
  'about.tagline': { 
    de: 'Über 12 Jahre Personaldienstleistung | IHK-Prüfer | Zertifizierter AI-Consultant',
    en: '12+ years HR services | IHK Examiner | Certified AI Consultant',
    tl: '12+ taon sa HR services | IHK Examiner | Certified AI Consultant'
  },
  'about.origin': {
    de: 'Der Grundstein zu KI Affairs wurde im April 2025 durch die KI Schulung von Daniel Müller - u.a. Host des Podcast "Liebe Zeitarbeit" und Branchenexperte gelegt. Seitdem habe ich mich jeden Tag mehr mit KI beschäftigt.',
    en: 'The foundation for KI Affairs was laid in April 2025 through AI training by Daniel Müller - host of the podcast "Liebe Zeitarbeit" and industry expert. Since then, I have been engaging with AI more every day.',
    tl: 'Ang pundasyon ng KI Affairs ay inilatag noong Abril 2025 sa pamamagitan ng AI training ni Daniel Müller - host ng podcast na "Liebe Zeitarbeit" at eksperto sa industriya. Mula noon, mas lalo akong naging aktibo sa AI araw-araw.'
  },
  'about.bio': {
    de: 'Themen wie LLM-Brainrot oder der KI-zu-KI-Bias faszinierte mich und ich dachte: Das interessiert bestimmt nicht nur mich! Als Problemlöser will ich verstehen, wie die Dinge funktionieren und wo ihre Schwächen sind. Nur so kann ich vermeiden mir die Arbeit für die Lösung zwei mal zu machen. Wenn es dir auch so geht findest du in meinem Podcast genau die richtigen Themen.',
    en: 'Topics like LLM brainrot or AI-to-AI bias fascinated me and I thought: This surely isn\'t just interesting to me! As a problem solver, I want to understand how things work and where their weaknesses are. Only then can I avoid doing the work for a solution twice. If you feel the same way, you\'ll find exactly the right topics in my podcast.',
    tl: 'Ang mga paksang tulad ng LLM brainrot o AI-to-AI bias ay naging kawili-wili sa akin at naisip ko: Siguradong hindi lang ako ang interesado dito! Bilang isang problem solver, gusto kong maunawaan kung paano gumagana ang mga bagay at kung saan ang kanilang mga kahinaan. Sa ganitong paraan lamang maiiwasan kong gawin ang trabaho para sa solusyon ng dalawang beses. Kung ganoon din ang nararamdaman mo, mahahanap mo ang tamang mga paksa sa aking podcast.'
  },
  'about.speakingIntro': {
    de: 'Meine Begeisterung für KI holte mich zum Start von 2026 auch direkt auf die Bühne.',
    en: 'My enthusiasm for AI brought me directly to the stage at the start of 2026.',
    tl: 'Ang aking sigasig para sa AI ay nagdala sa akin direkta sa entablado sa simula ng 2026.'
  },
  'about.speakingEvent1': {
    de: 'Ich durfte vor ca. 30 Mitgliedern des AI Explorer Clubs des AI Training Institutes am 10.01.2026 in Hamburg einen Vortrag halten.',
    en: 'I had the opportunity to give a presentation to about 30 members of the AI Explorer Club at the AI Training Institute in Hamburg on January 10, 2026.',
    tl: 'Nagkaroon ako ng pagkakataon na magbigay ng presentasyon sa halos 30 miyembro ng AI Explorer Club sa AI Training Institute sa Hamburg noong Enero 10, 2026.'
  },
  'about.credentialsTitle': { de: 'Qualifikationen', en: 'Credentials', tl: 'Mga Kredensyal' },
  'about.credential1': { 
    de: 'Zertifizierter AI-Consultant (AI Training Institute)',
    en: 'Certified AI Consultant (AI Training Institute)',
    tl: 'Certified AI Consultant (AI Training Institute)'
  },
  'about.credential2': { 
    de: 'IHK-Prüfer (ehrenamtlich)',
    en: 'IHK Examiner (voluntary)',
    tl: 'IHK Examiner (boluntaryo)'
  },
  'about.credential3': { 
    de: 'In Weiterbildung: AI-Officer (TÜV Rheinland), Datenschutzbeauftragter (IHK)',
    en: 'In progress: AI Officer (TÜV Rheinland), Data Protection Officer (IHK)',
    tl: 'Kasalukuyang kinukuha: AI Officer (TÜV Rheinland), Data Protection Officer (IHK)'
  },
  'about.speakingCaption': {
    de: 'NotebookLM Vortrag beim AI Training Institute, Hamburg – 10. Januar 2026',
    en: 'NotebookLM presentation at AI Training Institute, Hamburg – January 10, 2026',
    tl: 'NotebookLM presentasyon sa AI Training Institute, Hamburg – Enero 10, 2026'
  },

  // Newsletter
  'newsletter.title': { de: 'Newsletter', en: 'Newsletter', tl: 'Newsletter' },
  'newsletter.subtitle': { 
    de: 'Bleibe auf dem Laufenden mit den neuesten KI-Themen', 
    en: 'Stay updated with the latest AI topics',
    tl: 'Manatiling updated sa mga pinakabagong paksa ng AI'
  },
  'newsletter.name': { de: 'Name (optional)', en: 'Name (optional)', tl: 'Pangalan (opsyonal)' },
  'newsletter.email': { de: 'E-Mail', en: 'Email', tl: 'Email' },
  'newsletter.language': { de: 'Sprache', en: 'Language', tl: 'Wika' },
  'newsletter.consent': { 
    de: 'Ich stimme der Datenschutzerklärung zu', 
    en: 'I agree to the privacy policy',
    tl: 'Sumasang-ayon ako sa patakaran sa privacy'
  },
  'newsletter.submit': { de: 'Abonnieren', en: 'Subscribe', tl: 'Mag-subscribe' },
  'newsletter.success': { 
    de: 'Erfolgreich angemeldet!', 
    en: 'Successfully subscribed!',
    tl: 'Matagumpay na nag-subscribe!'
  },

  // Contact
  'contact.title': { de: 'Kontakt', en: 'Contact', tl: 'Kontak' },
  'contact.email': { de: 'E-Mail', en: 'Email', tl: 'Email' },
  'contact.topics': { 
    de: 'Themenvorschläge?', 
    en: 'Topic suggestions?',
    tl: 'Mga mungkahi sa paksa?'
  },

  // Footer
  'footer.impressum': { de: 'Impressum', en: 'Legal Notice', tl: 'Legal Notice' },
  'footer.datenschutz': { de: 'Datenschutz', en: 'Privacy Policy', tl: 'Patakaran sa Privacy' },
  'footer.rights': { de: 'Alle Rechte vorbehalten', en: 'All rights reserved', tl: 'Lahat ng karapatan ay nakalaan' },

  // Cookie Consent
  'cookie.title': { de: 'Cookie-Einstellungen', en: 'Cookie Settings', tl: 'Mga Setting ng Cookie' },
  'cookie.description': { 
    de: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.', 
    en: 'We use cookies to improve your experience.',
    tl: 'Gumagamit kami ng cookies upang mapabuti ang iyong karanasan.'
  },
  'cookie.necessary': { de: 'Notwendig', en: 'Necessary', tl: 'Kinakailangan' },
  'cookie.necessaryDesc': { 
    de: 'Speichert Cookie-Einstellung und Sprachauswahl', 
    en: 'Stores cookie settings and language preference',
    tl: 'Nag-iimbak ng mga setting ng cookie at kagustuhan sa wika'
  },
  'cookie.analytics': { de: 'Analytics', en: 'Analytics', tl: 'Analytics' },
  'cookie.analyticsDesc': { 
    de: 'Plausible.io für Episode-Stats (DSGVO, keine IPs)', 
    en: 'Plausible.io for episode stats (GDPR compliant, no IPs)',
    tl: 'Plausible.io para sa mga stats ng episode (GDPR compliant, walang IPs)'
  },
  'cookie.marketing': { de: 'Marketing', en: 'Marketing', tl: 'Marketing' },
  'cookie.marketingDesc': { 
    de: 'Aktuell nicht genutzt. Für personalisierte Empfehlungen', 
    en: 'Not currently used. For personalized recommendations',
    tl: 'Hindi kasalukuyang ginagamit. Para sa personalized na mga rekomendasyon'
  },
  'cookie.acceptNecessary': { de: 'Nur Notwendige', en: 'Necessary Only', tl: 'Kinakailangan Lamang' },
  'cookie.acceptAll': { de: 'Alle akzeptieren', en: 'Accept All', tl: 'Tanggapin Lahat' },

  // Lead Magnet Section
  'leadMagnet.badge': {
    de: 'For Free',
    en: 'For Free',
    tl: 'Libre'
  },
  'leadMagnet.title': {
    de: 'KI-Prompts zum Sofort-Loslegen',
    en: 'AI Prompts to Get Started Now',
    tl: 'Mga AI Prompt para Magsimula Agad'
  },
  'leadMagnet.subtitle': {
    de: 'Copy & Paste ready. Kein Schnickschnack. Sofort nutzbar.',
    en: 'Copy & paste ready. No fluff. Use immediately.',
    tl: 'Handa nang i-copy at i-paste. Walang kalat. Gamitin agad.'
  },
  'leadMagnet.getPrompts': {
    de: 'Prompts holen',
    en: 'Get prompts',
    tl: 'Kunin ang mga prompt'
  },
  'leadMagnet.moreHint': {
    de: 'Willst du mehr KI-Tipps?',
    en: 'Want more AI tips?',
    tl: 'Gusto mo ng mas maraming AI tips?'
  },
  'leadMagnet.newsletterLink': {
    de: 'Zum Newsletter',
    en: 'Join the newsletter',
    tl: 'Sumali sa newsletter'
  },

  // Lead Magnet Cards
  'leadMagnet.buero.title': {
    de: '10 KI-Prompts fürs Büro',
    en: '10 AI Prompts for Office',
    tl: '10 AI Prompt para sa Opisina'
  },
  'leadMagnet.buero.description': {
    de: 'E-Mails, Meetings, Präsentationen – sofort produktiver mit diesen Prompts.',
    en: 'Emails, meetings, presentations – be instantly more productive with these prompts.',
    tl: 'Mga email, meeting, presentasyon – maging mas produktibo agad sa mga prompt na ito.'
  },
  'leadMagnet.zuhause.title': {
    de: '10 KI-Prompts für Zuhause',
    en: '10 AI Prompts for Home',
    tl: '10 AI Prompt para sa Bahay'
  },
  'leadMagnet.zuhause.description': {
    de: 'Reiseplanung, Rezepte, Entscheidungen – KI als Alltags-Helfer.',
    en: 'Travel planning, recipes, decisions – AI as your everyday helper.',
    tl: 'Pagpaplano ng biyahe, mga recipe, desisyon – AI bilang katulong sa araw-araw.'
  },
  'leadMagnet.kinder.title': {
    de: '10 KI-Prompts mit Kindern',
    en: '10 AI Prompts with Kids',
    tl: '10 AI Prompt kasama ang mga Bata'
  },
  'leadMagnet.kinder.description': {
    de: 'Lernen, Spielen, Entdecken – KI sinnvoll für Familien nutzen.',
    en: 'Learn, play, discover – use AI meaningfully for families.',
    tl: 'Matuto, maglaro, tuklasin – gamitin ang AI nang makabuluhan para sa mga pamilya.'
  },

  // Lead Magnet Modal
  'leadMagnet.modal.subtitle': {
    de: 'Wie möchtest du die Prompts erhalten?',
    en: 'How would you like to receive the prompts?',
    tl: 'Paano mo gustong matanggap ang mga prompt?'
  },
  'leadMagnet.modal.notionTitle': {
    de: 'In Notion öffnen',
    en: 'Open in Notion',
    tl: 'Buksan sa Notion'
  },
  'leadMagnet.modal.notionDesc': {
    de: 'Sofort lesen und kopieren – direkt im Browser',
    en: 'Read and copy instantly – right in your browser',
    tl: 'Basahin at kopyahin agad – directo sa browser'
  },
  'leadMagnet.modal.pdfTitle': {
    de: 'Als PDF per E-Mail',
    en: 'PDF via email',
    tl: 'PDF sa email'
  },
  'leadMagnet.modal.pdfDesc': {
    de: 'Zum Speichern und Offline-Nutzen',
    en: 'Save and use offline',
    tl: 'I-save at gamitin offline'
  },
  'leadMagnet.modal.or': {
    de: 'oder',
    en: 'or',
    tl: 'o'
  },
  'leadMagnet.modal.emailPlaceholder': {
    de: 'Deine E-Mail-Adresse',
    en: 'Your email address',
    tl: 'Ang iyong email address'
  },
  'leadMagnet.modal.send': {
    de: 'Senden',
    en: 'Send',
    tl: 'Ipadala'
  },
  'leadMagnet.modal.privacy': {
    de: 'Wir nutzen deine E-Mail nur zum Versand des PDFs und für unseren Newsletter. Du kannst dich jederzeit abmelden.',
    en: 'We only use your email to send the PDF and for our newsletter. You can unsubscribe at any time.',
    tl: 'Ginagamit lang namin ang iyong email para ipadala ang PDF at para sa newsletter. Maaari kang mag-unsubscribe anumang oras.'
  },
  'leadMagnet.modal.invalidEmail': {
    de: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    en: 'Please enter a valid email address.',
    tl: 'Mangyaring maglagay ng tamang email address.'
  },
  'leadMagnet.modal.error': {
    de: 'Da ist etwas schiefgelaufen. Bitte versuche es erneut.',
    en: 'Something went wrong. Please try again.',
    tl: 'May nangyaring mali. Mangyaring subukan muli.'
  },
  'leadMagnet.modal.successTitle': {
    de: 'PDF ist unterwegs!',
    en: 'PDF is on its way!',
    tl: 'Paparating na ang PDF!'
  },
  'leadMagnet.modal.successDesc': {
    de: 'Prüfe dein Postfach – die Prompts kommen in wenigen Minuten an.',
    en: 'Check your inbox – the prompts will arrive in a few minutes.',
    tl: 'Tingnan ang iyong inbox – ang mga prompt ay darating sa ilang minuto.'
  },

  // SEO/GEO Tool
  'leadMagnet.seogeo.title': {
    de: 'SEO & GEO Analyse for free',
    en: 'SEO & GEO Analysis for free',
    tl: 'SEO at GEO Analysis nang libre'
  },
  'leadMagnet.seogeo.description': {
    de: 'Gib deine Website ein und erhalte sofort eine Basis-Analyse. Die vollständige SEO- & GEO-Auswertung bekommst du per E-Mail – natürlich for free.',
    en: 'Enter your website and get an instant basic analysis. The full SEO & GEO report is sent to your email – for free, of course.',
    tl: 'Ilagay ang iyong website at makakuha agad ng pangunahing pagsusuri. Ang buong SEO at GEO report ay ipapadala sa iyong email – libre, syempre.'
  },
  'leadMagnet.seogeo.cta': {
    de: 'Jetzt analysieren',
    en: 'Analyze now',
    tl: 'Suriin ngayon'
  },
};
