export interface FAQItem {
  question: {
    de: string;
    en: string;
    tl: string;
  };
  answer: {
    de: string;
    en: string;
    tl: string;
  };
}

export const faqs: FAQItem[] = [
  {
    question: {
      de: 'Wie oft erscheinen neue Folgen?',
      en: 'How often are new episodes released?',
      tl: 'Gaano kadalas lumabas ang mga bagong episode?',
    },
    answer: {
      de: 'Jeden Montag um 10:00 Uhr erscheint ein Quickie (2-3 Minuten) und jeden Donnerstag um 10:00 Uhr eine volle Folge (12-25 Minuten).',
      en: 'Every Monday at 10:00 AM a Quickie (2-3 minutes) and every Thursday at 10:00 AM a full episode (12-25 minutes).',
      tl: 'Bawat Lunes ng 10:00 AM ay may Quickie (2-3 minuto) at bawat Huwebes ng 10:00 AM ay may buong episode (12-25 minuto).',
    },
  },
  {
    question: {
      de: 'Zu welchen Zeiten werden die Folgen veröffentlicht?',
      en: 'What times are episodes published?',
      tl: 'Anong oras inilalabas ang mga episode?',
    },
    answer: {
      de: 'Jeden Montag und Donnerstag um 10:00 Uhr CET.',
      en: 'Every Monday and Thursday at 10:00 AM Houston time.',
      tl: 'Bawat Lunes at Huwebes ng 10:00 AM oras ng Pilipinas.',
    },
  },
  {
    question: {
      de: 'Wie lang sind die Folgen?',
      en: 'How long are the episodes?',
      tl: 'Gaano kahaba ang mga episode?',
    },
    answer: {
      de: 'Quickies dauern 2-3 Minuten, volle Folgen 12-25 Minuten.',
      en: 'Quickies are 2-3 minutes, full episodes are 12-25 minutes.',
      tl: 'Ang mga Quickie ay 2-3 minuto, ang mga buong episode ay 12-25 minuto.',
    },
  },
  {
    question: {
      de: 'Für wen ist der Podcast geeignet?',
      en: 'Who is the podcast suitable for?',
      tl: 'Para kanino ang podcast?',
    },
    answer: {
      de: 'Für jeden, der sich für künstliche Intelligenz interessiert. Wir bieten eine ausgewogene Perspektive zwischen Fortschritt und Verantwortung.',
      en: 'For anyone interested in artificial intelligence. We offer a balanced perspective between progress and responsibility.',
      tl: 'Para sa sinumang interesado sa artificial intelligence. Nag-aalok kami ng balanseng pananaw sa pagitan ng pag-unlad at responsibilidad.',
    },
  },
  {
    question: {
      de: 'Kann ich Themenvorschläge einreichen?',
      en: 'Can I submit topic suggestions?',
      tl: 'Pwede ba akong mag-submit ng mga mungkahi sa paksa?',
    },
    answer: {
      de: 'Ja! Sende deine Vorschläge an info@kiaffairs-podcast.de',
      en: 'Yes! Send your suggestions to info@kiaffairs-podcast.de',
      tl: 'Oo! Ipadala ang iyong mga mungkahi sa info@kiaffairs-podcast.de',
    },
  },
  {
    question: {
      de: 'Gibt es Transkripte der Folgen?',
      en: 'Are there episode transcripts?',
      tl: 'May mga transcript ba ng mga episode?',
    },
    answer: {
      de: 'Nein, derzeit gibt es keine Transkripte. Es ist geplant, 2026 die Podcast-Produktion umzustellen und dann auch Transkripte anzubieten.',
      en: 'No, there are currently no transcripts. It is planned to restructure podcast production in 2026 and offer transcripts then.',
      tl: 'Hindi, wala pang mga transcript sa ngayon. Planado na baguhin ang produksyon ng podcast sa 2026 at mag-alok ng mga transcript pagkatapos.',
    },
  },
  {
    question: {
      de: 'In welchen Sprachen ist der Podcast verfügbar?',
      en: 'In which languages is the podcast available?',
      tl: 'Sa anong mga wika available ang podcast?',
    },
    answer: {
      de: 'Deutsch, Englisch und Filipino (Tagalog).',
      en: 'German, English, and Filipino (Tagalog).',
      tl: 'German, English, at Filipino (Tagalog).',
    },
  },
  {
    question: {
      de: 'Auf welchen Plattformen kann ich zuhören?',
      en: 'On which platforms can I listen?',
      tl: 'Sa anong mga platform ako makakarinig?',
    },
    answer: {
      de: 'Spotify, YouTube, Amazon Music und Apple Podcasts.',
      en: 'Spotify, YouTube, Amazon Music, and Apple Podcasts.',
      tl: 'Spotify, YouTube, Amazon Music, at Apple Podcasts.',
    },
  },
  {
    question: {
      de: 'Was ist der Unterschied zwischen Quickie und voller Folge?',
      en: 'What is the difference between Quickie and full episode?',
      tl: 'Ano ang pagkakaiba ng Quickie at buong episode?',
    },
    answer: {
      de: 'Quickies sind kurze News-Updates (2-3 Min), volle Folgen bieten tiefgehende Analysen (12-25 Min).',
      en: 'Quickies are short news updates (2-3 min), full episodes offer in-depth analysis (12-25 min).',
      tl: 'Ang mga Quickie ay maikling news updates (2-3 min), ang mga buong episode ay nag-aalok ng malalimang pagsusuri (12-25 min).',
    },
  },
  {
    question: {
      de: 'Wie bleibe ich auf dem Laufenden?',
      en: 'How do I stay updated?',
      tl: 'Paano ako manatiling updated?',
    },
    answer: {
      de: 'Abonniere unseren Newsletter, folge uns auf Social Media (X, Facebook, Instagram, YouTube) oder abonniere den Podcast auf deiner bevorzugten Plattform.',
      en: 'Subscribe to our newsletter, follow us on social media (X, Facebook, Instagram, YouTube), or subscribe to the podcast on your preferred platform.',
      tl: 'Mag-subscribe sa aming newsletter, i-follow kami sa social media (X, Facebook, Instagram, YouTube), o mag-subscribe sa podcast sa iyong paboritong platform.',
    },
  },
];
