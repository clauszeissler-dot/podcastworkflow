export interface Episode {
  number: string;
  type: 'full' | 'quickie';
  title: {
    de: string;
    en: string;
    tl: string;
  };
  description: {
    de: string;
    en: string;
    tl: string;
  };
  date: string;
  duration: string;
  links: {
    spotify: string;
    youtube: string;
    apple: string;
    amazon: string;
  };
}

// Helper to extract YouTube video ID from various URL formats
export const extractYoutubeId = (url: string): string => {
  // Handle youtu.be/ID format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];
  
  // Handle youtube.com/watch?v=ID format
  const longMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (longMatch) return longMatch[1];
  
  // Handle escaped backslashes
  const cleanUrl = url.replace(/\\/g, '');
  const cleanShortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (cleanShortMatch) return cleanShortMatch[1];
  
  return '';
};

// Helper to extract Spotify episode ID
export const extractSpotifyId = (url: string): string => {
  const match = url.replace(/\\/g, '').match(/episode\/([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
};

// Helper to extract Apple Podcasts episode ID  
export const extractAppleId = (url: string): string => {
  // Just return the clean URL for Apple Podcasts embeds
  return url.replace(/\\/g, '');
};

export const episodes: Record<'de' | 'en' | 'tl', Episode[]> = {
  de: [
    {
      number: '001',
      type: 'quickie',
      title: { de: 'Quicky LLM Brain Rot: Warum Social Media unsere KI-Zukunft vergiftet', en: '', tl: '' },
      description: { de: 'Die schockierende Wahrheit aus der KI-Forschung: Künstliche Intelligenz leidet unter irreversiblen kognitiven Schäden, dem „LLM Brain Rot", verursacht durch Social-Media-Daten.', en: '', tl: '' },
      date: '2025-10-27',
      duration: '1:49',
      links: {
        spotify: 'https://open.spotify.com/episode/0X2iTIeWPwpiTsE1NrAncd',
        youtube: 'https://youtu.be/FwcgfPN3HJE',
        apple: 'https://podcasts.apple.com/us/podcast/001-quicky-ki-brain-rot-warum-social-media-unsere-ki/id1848998799?i=1000733756926',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/bd758dcd-3cea-4d2d-8585-112556d9b148/ki-affairs-001-quicky-ki-brain-rot-warum-social-media-unsere-ki-zukunft-vergiftet-und-der-schaden-irreversibel-ist'
      }
    },
    {
      number: '001',
      type: 'full',
      title: { de: 'LLM Brain Rot: Warum Social Media unsere KI-Zukunft vergiftet', en: '', tl: '' },
      description: { de: 'Die schockierende Wahrheit aus der KI-Forschung: Künstliche Intelligenz leidet unter irreversiblen kognitiven Schäden, dem „LLM Brain Rot", verursacht durch Social-Media-Daten.', en: '', tl: '' },
      date: '2025-10-27',
      duration: '16:50',
      links: {
        spotify: 'https://open.spotify.com/episode/4T01aSiEsS7l6us0J8E2eM',
        youtube: 'https://youtu.be/fFihhtiYnx4',
        apple: 'https://podcasts.apple.com/us/podcast/001-ki-brain-rot-warum-social-media-unsere-ki-zukunft/id1848998799?i=1000733786327',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/ae664ce9-1d21-40cc-bcfd-ed2414512e3d/ki-affairs-001-ki-brain-rot-warum-social-media-unsere-ki-zukunft-vergiftet-und-der-schaden-irreversibel-ist'
      }
    },
    {
      number: '002',
      type: 'quickie',
      title: { de: 'Quicky KI-Assistenten in der Vertrauenskrise', en: '', tl: '' },
      description: { de: 'Die größte internationale Studie von EBU und BBC ist ein Weckruf: 45% aller KI-generierten Nachrichtenantworten sind fehlerhaft.', en: '', tl: '' },
      date: '2025-10-28',
      duration: '1:50',
      links: {
        spotify: 'https://open.spotify.com/episode/2zwVicbY4f5rvwkLWKWVc9',
        youtube: 'https://youtu.be/U2oz4h09VwM',
        apple: 'https://podcasts.apple.com/us/podcast/002-quicky-ki-assistenten-in-der-vertrauenskrise-warum/id1848998799?i=1000733846870',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/e5315a5e-0abd-45cb-9dcc-36d4871782ad/ki-affairs-002-quicky-ki-assistenten-in-der-vertrauenskrise-warum-45-fehlerquote-den-qualitätsjournalismus-und-unsere-prozesse-gefährden'
      }
    },
    {
      number: '002',
      type: 'full',
      title: { de: 'KI-Assistenten in der Vertrauenskrise', en: '', tl: '' },
      description: { de: 'Die größte internationale Studie von EBU und BBC ist ein Weckruf: 45% aller KI-generierten Nachrichtenantworten sind fehlerhaft.', en: '', tl: '' },
      date: '2025-10-28',
      duration: '18:22',
      links: {
        spotify: 'https://open.spotify.com/episode/4ASJ1JH8XtHH5iYRXjYHtA',
        youtube: 'https://youtu.be/fPjYlB_Jyx0',
        apple: 'https://podcasts.apple.com/us/podcast/002-ki-assistenten-in-der-vertrauenskrise-warum-45/id1848998799?i=1000733847028',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/6a07ba40-b611-4253-87b6-4a0e050ef10c/ki-affairs-002-ki-assistenten-in-der-vertrauenskrise-warum-45-fehlerquote-den-qualitätsjournalismus-und-unsere-prozesse-gefährden'
      }
    },
    {
      number: '003',
      type: 'quickie',
      title: { de: 'Quicky KI-zu-KI-Bias: Die neue Diskriminierung', en: '', tl: '' },
      description: { de: 'Eine brisante Studie enthüllt: LLMs bevorzugen systematisch KI-generierte Inhalte gegenüber menschlichen Texten.', en: '', tl: '' },
      date: '2025-10-30',
      duration: '2:31',
      links: {
        spotify: 'https://open.spotify.com/episode/2OiwiVgrYbcMGInSA4a1DC',
        youtube: 'https://youtu.be/8A6u-lYacJM',
        apple: 'https://podcasts.apple.com/us/podcast/003-quicky-ki-zu-ki-bias-die-neue-diskriminierung-die/id1848998799?i=1000734189076',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/b74ff089-7f51-46b4-9f30-e5e012aaa673/ki-affairs-003-quicky-ki-zu-ki-bias-die-neue-diskriminierung-die-unsere-wirtschaft-spaltet'
      }
    },
    {
      number: '003',
      type: 'full',
      title: { de: 'KI-zu-KI-Bias: Die neue Diskriminierung', en: '', tl: '' },
      description: { de: 'Eine brisante Studie enthüllt: LLMs bevorzugen systematisch KI-generierte Inhalte gegenüber menschlichen Texten.', en: '', tl: '' },
      date: '2025-10-30',
      duration: '23:31',
      links: {
        spotify: 'https://open.spotify.com/episode/27Vt4LnQflJHPWyodp67aZ',
        youtube: 'https://youtu.be/cKwOteRp02E',
        apple: 'https://podcasts.apple.com/us/podcast/003-ki-zu-ki-bias-die-neue-diskriminierung-die-unsere/id1848998799?i=1000734189209',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/ca256c9f-66e7-42bd-9814-ccf44185b80c/ki-affairs-003-ki-zu-ki-bias-die-neue-diskriminierung-die-unsere-wirtschaft-spaltet'
      }
    },
    {
      number: '004',
      type: 'quickie',
      title: { de: 'Quicky KI-Browser: 5 alarmierende Fakten', en: '', tl: '' },
      description: { de: 'Der Hype um KI-Browser verspricht Revolution – doch der Preis ist hoch: digitale Sicherheit und Privatsphäre.', en: '', tl: '' },
      date: '2025-11-06',
      duration: '2:12',
      links: {
        spotify: 'https://open.spotify.com/episode/0tOiohFod7stI0lKKDj7yk',
        youtube: 'https://youtu.be/aMhF-kVKgEY',
        apple: 'https://podcasts.apple.com/us/podcast/004-quicky-ki-browser-5-alarmierende-fakten-der-preis/id1848998799?i=1000735534452',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/a0fd5e3a-6325-4cc6-91f2-0c83fe700cab/ki-affairs-004-quicky-ki-browser-5-alarmierende-fakten-–-der-preis-der-bequemlichkeit'
      }
    },
    {
      number: '004',
      type: 'full',
      title: { de: 'KI-Browser: 5 alarmierende Fakten', en: '', tl: '' },
      description: { de: 'Der Hype um KI-Browser verspricht Revolution – doch der Preis ist hoch: digitale Sicherheit und Privatsphäre.', en: '', tl: '' },
      date: '2025-11-06',
      duration: '15:29',
      links: {
        spotify: 'https://open.spotify.com/episode/2hceAo4ejAzW1PLtpTtlwF',
        youtube: 'https://youtu.be/hoh_JebTolc',
        apple: 'https://podcasts.apple.com/us/podcast/004-ki-browser-5-alarmierende-fakten-der-preis-der/id1848998799?i=1000735534315',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/30cd384b-a04a-49ed-9498-b5df5e032688/ki-affairs-004-ki-browser-5-alarmierende-fakten-–-der-preis-der-bequemlichkeit'
      }
    },
    {
      number: '005',
      type: 'quickie',
      title: { de: 'Quicky KI lernt die Welt', en: '', tl: '' },
      description: { de: 'Vom Muster zum Verstand: Wie KI lernt, die Welt zu begreifen – der Weg zur nächsten Generation KI.', en: '', tl: '' },
      date: '2025-11-12',
      duration: '2:28',
      links: {
        spotify: 'https://open.spotify.com/episode/4lZLzCF8fWzYdA3OKZKvui',
        youtube: 'https://youtu.be/rAdwBID4n-s',
        apple: 'https://podcasts.apple.com/us/podcast/005-quicky-ki-lernt-die-welt-der-weg-zur-nächsten-generation/id1848998799?i=1000736398172',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/cb01c80e-b36c-45df-839b-ade25ca5557f/ki-affairs-005-quicky-ki-lernt-die-welt-der-weg-zur-nächsten-generation-ki'
      }
    },
    {
      number: '005',
      type: 'full',
      title: { de: 'KI lernt die Welt', en: '', tl: '' },
      description: { de: 'Vom Muster zum Verstand: Wie KI lernt, die Welt zu begreifen – der Weg zur nächsten Generation KI.', en: '', tl: '' },
      date: '2025-11-13',
      duration: '20:44',
      links: {
        spotify: 'https://open.spotify.com/episode/0qGQ8YgcrIA7CMOiierCD3',
        youtube: 'https://youtu.be/tZKUf5NZ00U',
        apple: 'https://podcasts.apple.com/us/podcast/005-ki-lernt-die-welt-der-weg-zur-nächsten-generation-ki/id1848998799?i=1000736564640',
        amazon: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b/episodes/f5a81c84-93cc-4d80-bfad-70c431969941/ki-affairs-005-ki-lernt-die-welt-der-weg-zur-nächsten-generation-ki'
      }
    }
  ],
  en: [
    {
      number: '001',
      type: 'quickie',
      title: { de: '', en: 'Quicky LLM Brain Rot: Why social media is poisoning our AI future', tl: '' },
      description: { de: '', en: 'The shocking truth from AI research: AI suffers from irreversible cognitive damage, known as "LLM brain rot," caused by social media data.', tl: '' },
      date: '2025-10-28',
      duration: '1:56',
      links: {
        spotify: 'https://open.spotify.com/episode/2Z1nvf8xT91zL8pLuAm5Ua',
        youtube: 'https://youtu.be/K77ZbWNkTkA',
        apple: 'https://podcasts.apple.com/us/podcast/001-quicky-llm-brain-rot-why-social-media-is-poisoning/id1849269877?i=1000733938094',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/ac14742d-fe44-4094-8578-08a08fb217e7/ai-affairs-001-quicky-llm-brain-rot-why-social-media-is-poisoning-our-ai-future-and-the-damage-is-irreversible'
      }
    },
    {
      number: '001',
      type: 'full',
      title: { de: '', en: 'LLM Brain Rot: Why social media is poisoning our AI future', tl: '' },
      description: { de: '', en: 'The shocking truth from AI research: AI suffers from irreversible cognitive damage, known as "LLM brain rot," caused by social media data.', tl: '' },
      date: '2025-10-28',
      duration: '22:00',
      links: {
        spotify: 'https://open.spotify.com/episode/44RSc38PEh6iKTsQM9X1ID',
        youtube: 'https://youtu.be/mk0S6g-Z58g',
        apple: 'https://podcasts.apple.com/us/podcast/001-llm-brain-rot-why-social-media-is-poisoning-our/id1849269877?i=1000733938173',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/00dca991-23e8-422e-a871-ae11512f7e27/ai-affairs-001-llm-brain-rot-why-social-media-is-poisoning-our-ai-future-and-the-damage-is-irreversible'
      }
    },
    {
      number: '002',
      type: 'quickie',
      title: { de: '', en: 'Quicky AI assistants in a crisis of confidence', tl: '' },
      description: { de: '', en: 'The largest international study by EBU and BBC is a wake-up call: 45% of all AI-generated news responses are incorrect.', tl: '' },
      date: '2025-10-28',
      duration: '1:46',
      links: {
        spotify: 'https://open.spotify.com/episode/5Hmb64hBrrXVO0AQVCgC2h',
        youtube: 'https://youtu.be/JHlW-rHO3Kk',
        apple: 'https://podcasts.apple.com/us/podcast/002-quicky-ai-assistants-in-a-crisis-of-confidence/id1849269877?i=1000733938211',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/0f4d9f7d-d4e6-4f98-8954-91cf2850167e/ai-affairs-002-quicky-ai-assistants-in-a-crisis-of-confidence-why-a-45-error-rate-jeopardizes-quality-journalism-and-our-processes'
      }
    },
    {
      number: '002',
      type: 'full',
      title: { de: '', en: 'AI assistants in a crisis of confidence', tl: '' },
      description: { de: '', en: 'The largest international study by EBU and BBC is a wake-up call: 45% of all AI-generated news responses are incorrect.', tl: '' },
      date: '2025-10-28',
      duration: '17:24',
      links: {
        spotify: 'https://open.spotify.com/episode/4O4twVonraYJpnWfAUkqNV',
        youtube: 'https://youtu.be/p3xJK0L9f5k',
        apple: 'https://podcasts.apple.com/us/podcast/002-ai-assistants-in-a-crisis-of-confidence-why/id1849269877?i=1000733938095',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/3c953456-43d7-4927-8902-4baa98677aa5/ai-affairs-002-ai-assistants-in-a-crisis-of-confidence-why-a-45-error-rate-jeopardizes-quality-journalism-and-our-processes'
      }
    },
    {
      number: '003',
      type: 'quickie',
      title: { de: '', en: 'Quicky AI-to-AI bias: The new discrimination', tl: '' },
      description: { de: '', en: 'An explosive study reveals: LLMs systematically favor AI-generated content over human-written texts.', tl: '' },
      date: '2025-10-30',
      duration: '1:45',
      links: {
        spotify: 'https://open.spotify.com/episode/0SPAbf1rQep8XG2N86Mpac',
        youtube: 'https://youtu.be/YijRsJR-MyU',
        apple: 'https://podcasts.apple.com/us/podcast/003-quicky-ai-to-ai-bias-the-new-discrimination-that/id1849269877?i=1000734236556',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/1df6a2d5-dfaf-4801-a6f9-e20b62f25c67/ai-affairs-003-quicky-ai-to-ai-bias-the-new-discrimination-that-is-dividing-our-economy'
      }
    },
    {
      number: '003',
      type: 'full',
      title: { de: '', en: 'AI-to-AI bias: The new discrimination', tl: '' },
      description: { de: '', en: 'An explosive study reveals: LLMs systematically favor AI-generated content over human-written texts.', tl: '' },
      date: '2025-10-30',
      duration: '14:49',
      links: {
        spotify: 'https://open.spotify.com/episode/2geuK7ybpXdgtRWWGbNfib',
        youtube: 'https://youtu.be/b-TLJxpjrHE',
        apple: 'https://podcasts.apple.com/us/podcast/003-ai-to-ai-bias-the-new-discrimination-that-is/id1849269877?i=1000734236743',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/1543c509-7bf8-486f-bc3e-824e08e9f827/ai-affairs-003-ai-to-ai-bias-the-new-discrimination-that-is-dividing-our-economy'
      }
    },
    {
      number: '004',
      type: 'quickie',
      title: { de: '', en: 'Quicky AI browsers: 5 alarming facts', tl: '' },
      description: { de: '', en: 'The hype around AI browsers promises revolution – but the price is high: digital security and privacy.', tl: '' },
      date: '2025-11-07',
      duration: '1:46',
      links: {
        spotify: 'https://open.spotify.com/episode/0hBPx6by05VnS12L8Z3utz',
        youtube: 'https://youtu.be/HnK2Po6csIU',
        apple: 'https://podcasts.apple.com/us/podcast/004-quicky-ai-browsers-5-alarming-facts-the-price/id1849269877?i=1000735787714',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/c16aafa0-0adb-457d-8bc9-ad6b38fe9eac/ai-affairs-004-quicky-ai-browsers-5-alarming-facts-–-the-price-of-convenience'
      }
    },
    {
      number: '004',
      type: 'full',
      title: { de: '', en: 'AI browsers: 5 alarming facts', tl: '' },
      description: { de: '', en: 'The hype around AI browsers promises revolution – but the price is high: digital security and privacy.', tl: '' },
      date: '2025-11-07',
      duration: '14:31',
      links: {
        spotify: 'https://open.spotify.com/episode/3TaJgJpQsc5NSM8Qae3r2e',
        youtube: 'https://youtu.be/LX_c746JRTQ',
        apple: 'https://podcasts.apple.com/us/podcast/004-ai-browsers-5-alarming-facts-the-price-of-convenience/id1849269877?i=1000735787888',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/05484d7d-07c8-40d2-a67e-cf4929c35a32/ai-affairs-004-ai-browsers-5-alarming-facts-–-the-price-of-convenience'
      }
    },
    {
      number: '005',
      type: 'quickie',
      title: { de: '', en: 'Quicky From Pattern to Mind: How AI Learns', tl: '' },
      description: { de: '', en: 'From pattern to mind: How AI learns to grasp the world – the path to the next generation of AI.', tl: '' },
      date: '2025-11-12',
      duration: '1:57',
      links: {
        spotify: 'https://open.spotify.com/episode/3bE2AToIA08wMBlyLsJpHI',
        youtube: 'https://youtu.be/KtYSkH08Qj8',
        apple: 'https://podcasts.apple.com/us/podcast/005-quicky-from-pattern-to-mind-how-ai-learns-to-grasp/id1849269877?i=1000736445588',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/13fc1981-bb5a-4760-b3c4-8d679fa6afff/ai-affairs-005-quicky-from-pattern-to-mind-how-ai-learns-to-grasp-the-world'
      }
    },
    {
      number: '005',
      type: 'full',
      title: { de: '', en: 'From Pattern to Mind: How AI Learns', tl: '' },
      description: { de: '', en: 'From pattern to mind: How AI learns to grasp the world – the path to the next generation of AI.', tl: '' },
      date: '2025-11-13',
      duration: '19:30',
      links: {
        spotify: 'https://open.spotify.com/episode/7mCO99HW9mvtNFLZXQq6yK',
        youtube: 'https://youtu.be/1R8dy9qkK_4',
        apple: 'https://podcasts.apple.com/us/podcast/005-from-pattern-to-mind-how-ai-learns-to-grasp-the-world/id1849269877?i=1000736606072',
        amazon: 'https://music.amazon.de/podcasts/3d4a357c-755f-4d96-973f-fcd2b0bdc90e/episodes/ed17be80-658b-4600-a5b6-16e14b4cc33b/ai-affairs-005-from-pattern-to-mind-how-ai-learns-to-grasp-the-world'
      }
    }
  ],
  tl: [
    {
      number: '001',
      type: 'quickie',
      title: { de: '', en: '', tl: 'Quicky LLM Brain Rot: Bakit Lason ang Social Media sa Ating AI Future' },
      description: { de: '', en: '', tl: 'Ang nakakagulat na katotohanan mula sa AI research: Ang AI ay nagdudusa ng hindi na maibabalik na pinsala sa kognisyon.' },
      date: '2025-10-28',
      duration: '1:51',
      links: {
        spotify: 'https://open.spotify.com/episode/0G3ZPT0m0jgI03vLLkBpLE',
        youtube: 'https://youtu.be/2n0m2Fim3Do',
        apple: 'https://podcasts.apple.com/us/podcast/001-quicky-llm-brain-rot-bakit-lason-ang-social-media/id1849258372?i=1000733929653',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/32b112eb-33f5-400e-82d9-2cc901bc4777/ai-affairs-001-quicky-llm-brain-rot-bakit-lason-ang-social-media-sa-ating-ai-future-at-irreversible-ang-pinsala'
      }
    },
    {
      number: '001',
      type: 'full',
      title: { de: '', en: '', tl: 'LLM Brain Rot: Bakit Lason ang Social Media sa Ating AI Future' },
      description: { de: '', en: '', tl: 'Ang nakakagulat na katotohanan mula sa AI research: Ang AI ay nagdudusa ng hindi na maibabalik na pinsala sa kognisyon.' },
      date: '2025-10-30',
      duration: '18:20',
      links: {
        spotify: 'https://open.spotify.com/episode/6im1f9pkrrHJNpSCviinPN',
        youtube: 'https://youtu.be/spRiP0NqxcU',
        apple: 'https://podcasts.apple.com/us/podcast/001-llm-brain-rot-bakit-lason-ang-social-media-sa-ating/id1849258372?i=1000734283100',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/824fed02-ec8d-4aec-ba6e-aa29502886fd/ai-affairs-001-llm-brain-rot-bakit-lason-ang-social-media-sa-ating-ai-future-at-irreversible-ang-pinsala'
      }
    },
    {
      number: '002',
      type: 'quickie',
      title: { de: '', en: '', tl: 'Quicky Krisis ng Tiwala sa mga AI Assistant' },
      description: { de: '', en: '', tl: 'Ang pinakamalaking pandaigdigang pag-aaral ng EBU at BBC ay isang wake-up call: 45% ng lahat ng AI-generated na sagot ay may mali.' },
      date: '2025-10-30',
      duration: '2:15',
      links: {
        spotify: 'https://open.spotify.com/episode/7rJgTwOnVZ0HWrUFKgO1y5',
        youtube: 'https://youtu.be/ndJPKRrTnqI',
        apple: 'https://podcasts.apple.com/us/podcast/002-quicky-krisis-ng-tiwala-sa-mga-ai-assistant-bakit/id1849258372?i=1000733940143',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/9a36e250-4c6e-4eb6-a6b1-9f22ff5c641f/ai-affairs-002-quicky-krisis-ng-tiwala-sa-mga-ai-assistant-bakit-45-error-rate-ang-naglalagay-sa-quality-journalism-at-ating-proseso-sa-panganib'
      }
    },
    {
      number: '002',
      type: 'full',
      title: { de: '', en: '', tl: 'Krisis ng Tiwala sa mga AI Assistant' },
      description: { de: '', en: '', tl: 'Ang pinakamalaking pandaigdigang pag-aaral ng EBU at BBC ay isang wake-up call: 45% ng lahat ng AI-generated na sagot ay may mali.' },
      date: '2025-10-30',
      duration: '20:27',
      links: {
        spotify: 'https://open.spotify.com/episode/54XXj5l1W9GbvCRxVq3Qqc',
        youtube: 'https://youtu.be/2wMBXWnc3K4',
        apple: 'https://podcasts.apple.com/us/podcast/002-krisis-ng-tiwala-sa-mga-ai-assistant-bakit-45-error/id1849258372?i=1000734282159',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/ea252386-f4de-45fe-81fd-55a33f13937f/ai-affairs-002-krisis-ng-tiwala-sa-mga-ai-assistant-bakit-45-error-rate-ang-naglalagay-sa-quality-journalism-at-ating-proseso-sa-panganib'
      }
    },
    {
      number: '003',
      type: 'quickie',
      title: { de: '', en: '', tl: 'Quicky AI-to-AI Bias: Ang Bagong Diskriminasyon' },
      description: { de: '', en: '', tl: 'Isang bago at sensitibong pag-aaral: Ang LLMs ay sistematikong pinapaboran ang nilalamang ginawa ng iba pang AI.' },
      date: '2025-10-30',
      duration: '2:16',
      links: {
        spotify: 'https://open.spotify.com/episode/24zkhbi5sWQt28M1oVNx48',
        youtube: 'https://youtu.be/7DdxXnBmlDU',
        apple: 'https://podcasts.apple.com/us/podcast/003-quicky-ai-to-ai-bias-ang-bagong-diskriminasyon/id1849258372?i=1000734142571',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/7aa9d230-ad8c-4786-adfa-afa84156d53f/ai-affairs-003-quicky-ai-to-ai-bias-ang-bagong-diskriminasyon-na-naghahati-sa-ating-ekonomiya'
      }
    },
    {
      number: '003',
      type: 'full',
      title: { de: '', en: '', tl: 'AI-to-AI Bias: Ang Bagong Diskriminasyon' },
      description: { de: '', en: '', tl: 'Isang bago at sensitibong pag-aaral: Ang LLMs ay sistematikong pinapaboran ang nilalamang ginawa ng iba pang AI.' },
      date: '2025-10-30',
      duration: '19:01',
      links: {
        spotify: 'https://open.spotify.com/episode/7nTj78fVvSt6NzEX2RZsXu',
        youtube: 'https://youtu.be/kgtsK4mslaw',
        apple: 'https://podcasts.apple.com/us/podcast/003-ai-to-ai-bias-ang-bagong-diskriminasyon-na-naghahati/id1849258372?i=1000734282305',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/f9397d21-e72b-43c8-87a4-67b54a7ebade/ai-affairs-003-ai-to-ai-bias-ang-bagong-diskriminasyon-na-naghahati-sa-ating-ekonomiya'
      }
    },
    {
      number: '004',
      type: 'quickie',
      title: { de: '', en: '', tl: 'Quicky AI Browser: 5 Nakababahalang Katotohanan' },
      description: { de: '', en: '', tl: 'Ang ingay tungkol sa mga AI-powered browser ay nangangako ng rebolusyon – ngunit ang presyo ay mataas.' },
      date: '2025-11-07',
      duration: '2:12',
      links: {
        spotify: 'https://open.spotify.com/episode/3B8xa3G4K9L84bM8iwSnqn',
        youtube: 'https://youtu.be/IQWAPOa7AFE',
        apple: 'https://podcasts.apple.com/us/podcast/004-quicky-ai-browser-5-nakababahalang-katotohanan/id1849258372?i=1000735789268',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/1755b071-8b8a-4d90-81b6-77ddaa8d11bd/ai-affairs-004-quicky-ai-browser-5-nakababahalang-katotohanan-–-ang-presyo-ng-kaginhawaan'
      }
    },
    {
      number: '004',
      type: 'full',
      title: { de: '', en: '', tl: 'AI Browser: 5 Nakababahalang Katotohanan' },
      description: { de: '', en: '', tl: 'Ang ingay tungkol sa mga AI-powered browser ay nangangako ng rebolusyon – ngunit ang presyo ay mataas.' },
      date: '2025-11-07',
      duration: '21:18',
      links: {
        spotify: 'https://open.spotify.com/episode/5GL6NN0dJyLNRhUdwt6dZJ',
        youtube: 'https://youtu.be/eQr3pCJJ0qc',
        apple: 'https://podcasts.apple.com/us/podcast/004-ai-browser-5-nakababahalang-katotohanan-ang-presyo/id1849258372?i=1000735788853',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/f9ab326b-815f-420f-8465-85c37f1b47d7/ai-affairs-004-ai-browser-5-nakababahalang-katotohanan-–-ang-presyo-ng-kaginhawaan'
      }
    },
    {
      number: '005',
      type: 'quickie',
      title: { de: '', en: '', tl: 'Quicky Ang AI ay Natututo sa Mundo' },
      description: { de: '', en: '', tl: 'Mula sa Pattern Patungo sa Pag-iisip: Paano Natututo ang AI na Unawain ang Mundo.' },
      date: '2025-11-12',
      duration: '1:55',
      links: {
        spotify: 'https://open.spotify.com/episode/1LwE90LGLUxFY8srfxIUMb',
        youtube: 'https://youtu.be/1Hd0-8u_9zQ',
        apple: 'https://podcasts.apple.com/us/podcast/005-quicky-ang-ai-ay-natututo-sa-mundo-ang-daan-patungo/id1849258372?i=1000736362086',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/4242a8c6-5520-408b-867a-c9740cefdbf5/ai-affairs-005-quicky-ang-ai-ay-natututo-sa-mundo-ang-daan-patungo-sa-susunod-na-henerasyon-ng-ai'
      }
    },
    {
      number: '005',
      type: 'full',
      title: { de: '', en: '', tl: 'Ang AI ay Natututo sa Mundo' },
      description: { de: '', en: '', tl: 'Mula sa Pattern Patungo sa Pag-iisip: Paano Natututo ang AI na Unawain ang Mundo.' },
      date: '2025-11-13',
      duration: '15:21',
      links: {
        spotify: 'https://open.spotify.com/episode/2DnbGNzkGUpKmbDvvR1gGm',
        youtube: 'https://youtu.be/8DcukThMC0s',
        apple: 'https://podcasts.apple.com/us/podcast/005-ang-ai-ay-natututo-sa-mundo-ang-daan-patungo-sa/id1849258372?i=1000736531949',
        amazon: 'https://music.amazon.de/podcasts/bb8e071a-eaad-4a53-860f-5ac26727b555/episodes/de4aa586-7920-4134-8036-4aa723764343/ai-affairs-005-ang-ai-ay-natututo-sa-mundo-ang-daan-patungo-sa-susunod-na-henerasyon-ng-ai'
      }
    }
  ]
};
