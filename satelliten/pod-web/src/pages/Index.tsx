import { useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { toast } from 'sonner';

// CRITICAL: Import Episodes and Blog synchronously to avoid content pop-in
// This ensures First Contentful Paint has meaningful content immediately
import Episodes from '@/components/Episodes';
import Blog from '@/components/Blog';
import LeadMagnet from '@/components/LeadMagnet';

// Lazy-load Toaster to reduce initial bundle by ~15KB
const LazyToaster = lazy(() => import('@/components/LazyToaster'));

// Lazy-load non-critical and below-the-fold components to reduce initial bundle size
// ParticleNetwork is decorative only and not needed for initial paint
const ParticleNetwork = lazy(() => import('@/components/ParticleNetwork'));
// EpisodeSchemas already defers via requestIdleCallback, lazy-load reduces main bundle
const EpisodeSchemas = lazy(() => import('@/components/EpisodeSchemas'));
// Language toast is shown after language detection completes
const LanguageDetectedToast = lazy(() => import('@/components/LanguageDetectedToast').then(m => ({ default: m.LanguageDetectedToast })));
// Lazy-load FAQ schema separately to keep faqData out of main bundle
const FAQSchema = lazy(() => import('@/components/FAQSchema'));
// Below-the-fold components can remain lazy
const FAQ = lazy(() => import('@/components/FAQ'));
const About = lazy(() => import('@/components/About'));
const Newsletter = lazy(() => import('@/components/Newsletter'));
const Contact = lazy(() => import('@/components/Contact'));
const Footer = lazy(() => import('@/components/Footer'));
// Legal pages and cookie consent are far below the fold
const LegalPages = lazy(() => import('@/components/LegalPages'));
const CookieConsent = lazy(() => import('@/components/CookieConsent'));

const BASE_URL = 'https://www.kiaffairs-podcast.de';

// Skeleton loader that mimics real content to reduce layout shift
const SectionLoader = () => (
  <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-4">
    <div className="flex justify-center mb-4">
      <div className="animate-pulse bg-muted rounded h-8 w-48" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="animate-pulse bg-muted rounded-xl h-32 w-full" />
        <div className="animate-pulse bg-muted rounded h-3 w-3/4" />
      </div>
      <div className="space-y-2">
        <div className="animate-pulse bg-muted rounded-xl h-32 w-full" />
        <div className="animate-pulse bg-muted rounded h-3 w-3/4" />
      </div>
    </div>
  </div>
);

const SEOHead = () => {
  const { language } = useLanguage();

  const podcastName = language === 'de' ? 'KI AffAIrs' : 'AI AffAIrs';

  const seo = {
    de: {
      title: 'KI AffAIrs - Der Podcast zwischen Fortschritt und Verantwortung',
      description: 'Wöchentlich: Mo Quickie (2-3 Min), Do Volle Folge (12-25 Min). Deutsch, English, Filipino.',
      locale: 'de_DE',
    },
    en: {
      title: 'AI AffAIrs - The Podcast Between Progress and Responsibility',
      description: 'Weekly: Mon Quickie (2-3 min), Thu Full Episode (12-25 min). German, English, Filipino.',
      locale: 'en_US',
    },
    tl: {
      title: 'AI AffAIrs - Ang Podcast sa Pagitan ng Pag-unlad at Responsibilidad',
      description: 'Lingguhan: Lun Quickie (2-3 min), Huw Buong Episode (12-25 min). German, English, Filipino.',
      locale: 'tl_PH',
    },
  };

  const geoData = {
    de: {
      region: 'DE-NW',
      placename: 'Dortmund',
      position: '51.5136;7.4653',
      ICBM: '51.5136, 7.4653',
    },
    en: {
      region: 'US-TX',
      placename: 'Houston',
      position: '29.7604;-95.3698',
      ICBM: '29.7604, -95.3698',
    },
    tl: {
      region: 'PH-00',
      placename: 'Manila',
      position: '14.5995;120.9842',
      ICBM: '14.5995, 120.9842',
    },
  };

  const current = seo[language];
  const currentGeo = geoData[language];

  // FAQPage schema is now lazy-loaded via FAQSchema component

  // Person schema for Claus Zeißler (E-E-A-T)
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#claus-zeissler`,
    name: 'Claus Zeißler',
    jobTitle: 'AI Consultant & Podcast Host',
    description: language === 'de' 
      ? 'Zertifizierter AI-Consultant, IHK-Prüfer und Host von KI AffAIrs. Über 12 Jahre Erfahrung in der Personaldienstleistung.'
      : 'Certified AI Consultant, IHK Examiner and Host of AI AffAIrs. Over 12 years experience in HR services.',
    url: BASE_URL,
    sameAs: [
      'https://www.linkedin.com/in/clauszeissler/',
      'https://www.xing.com/profile/Claus_Zeissler',
      'https://x.com/KI_AffAIrs_Pod'
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'AI Consulting',
      'Human Resources',
      'Data Protection',
      'LLM Technology',
      'AI Bias',
      'Machine Learning'
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Certified AI Consultant',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'AI Training Institute'
        }
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'IHK-Prüfer',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'IHK'
        }
      }
    ],
    worksFor: {
      '@id': `${BASE_URL}/#organization`
    }
  };

  // Organization schema with @id for referencing
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'KI AffAIrs',
    alternateName: 'AI AffAIrs',
    url: BASE_URL,
    email: 'info@ki-affairs.de',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    founder: {
      '@id': `${BASE_URL}/#claus-zeissler`
    },
    sameAs: [
      'https://open.spotify.com/show/4VYmAL6SmD2RnJfpWQIbO7',
      'https://podcasts.apple.com/us/podcast/ki-affairs-der-podcast-zwischen-fortschritt-und/id1806116422',
      'https://www.youtube.com/@KI-Affairs',
      'https://music.amazon.de/podcasts/58f19f75-c8c1-42f7-8a58-6a67aaf0f7ad/ki-affairs---der-podcast-zwischen-fortschritt-und-verantwortung',
    ],
  };

  // WebSite schema for sitelinks search box potential
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'KI AffAIrs',
    alternateName: 'AI AffAIrs',
    url: BASE_URL,
    inLanguage: ['de', 'en', 'tl'],
    description: current.description,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  };

  // PodcastSeries schema with references
  const podcastSchema = {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    '@id': `${BASE_URL}/#podcast`,
    name: podcastName,
    description: current.description,
    url: BASE_URL,
    inLanguage: ['de', 'en', 'tl'],
    genre: ['Technology', 'Artificial Intelligence', 'Science', 'Education'],
    author: {
      '@id': `${BASE_URL}/#claus-zeissler`
    },
    creator: {
      '@id': `${BASE_URL}/#claus-zeissler`
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    webFeed: [
      'https://open.spotify.com/show/4VYmAL6SmD2RnJfpWQIbO7',
      'https://podcasts.apple.com/us/podcast/ki-affairs-der-podcast-zwischen-fortschritt-und/id1806116422',
    ],
    image: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icon-512.png`,
    },
  };

  return (
    <Helmet>
      <html lang={language === 'tl' ? 'tl' : language} />
      <title>{current.title}</title>
      <meta name="description" content={current.description} />
      <meta name="keywords" content="KI Podcast, AI Podcast, Künstliche Intelligenz, Artificial Intelligence, Machine Learning, Deep Learning, ChatGPT, GPT, LLM" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Canonical */}
      <link rel="canonical" href={BASE_URL} />
      
      {/* Open Graph */}
      <meta property="og:title" content={current.title} />
      <meta property="og:description" content={current.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:locale" content={current.locale} />
      <meta property="og:locale:alternate" content="de_DE" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="tl_PH" />
      <meta property="og:site_name" content={podcastName} />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:image:width" content="1216" />
      <meta property="og:image:height" content="640" />
      <meta property="og:image:alt" content={podcastName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={current.title} />
      <meta name="twitter:description" content={current.description} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
      
      {/* Geo-Tags - sprachspezifisch */}
      <meta name="geo.region" content={currentGeo.region} />
      <meta name="geo.placename" content={currentGeo.placename} />
      <meta name="geo.position" content={currentGeo.position} />
      <meta name="ICBM" content={currentGeo.ICBM} />
      
      {/* Hreflang - corrected URLs */}
      <link rel="alternate" hrefLang="de" href={`${BASE_URL}/?lang=de`} />
      <link rel="alternate" hrefLang="en" href={`${BASE_URL}/?lang=en`} />
      <link rel="alternate" hrefLang="tl" href={`${BASE_URL}/?lang=tl`} />
      <link rel="alternate" hrefLang="x-default" href={BASE_URL} />
      
      {/* Schema.org - Multiple structured data for GEO */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webSiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(podcastSchema)}
      </script>
    </Helmet>
  );
};

// Hook to handle URL parameters for newsletter status
const useNewsletterStatus = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Handle unsubscribe status
    const unsubscribed = params.get('unsubscribed');
    if (unsubscribed) {
      const messages = {
        success: {
          de: 'Du wurdest erfolgreich vom Newsletter abgemeldet.',
          en: 'You have been successfully unsubscribed from the newsletter.',
          tl: 'Matagumpay kang na-unsubscribe mula sa newsletter.'
        },
        already: {
          de: 'Du bist bereits vom Newsletter abgemeldet.',
          en: 'You are already unsubscribed from the newsletter.',
          tl: 'Na-unsubscribe ka na sa newsletter.'
        },
        invalid: {
          de: 'Ungültiger Abmeldelink.',
          en: 'Invalid unsubscribe link.',
          tl: 'Di-wastong unsubscribe link.'
        },
        error: {
          de: 'Fehler bei der Abmeldung. Bitte versuche es erneut.',
          en: 'Error unsubscribing. Please try again.',
          tl: 'Error sa pag-unsubscribe. Pakisubukan muli.'
        }
      };
      
      const msg = messages[unsubscribed as keyof typeof messages];
      if (msg) {
        if (unsubscribed === 'success' || unsubscribed === 'already') {
          toast.success(msg[language]);
        } else {
          toast.error(msg[language]);
        }
      }
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    // Handle confirmation status (existing)
    const confirmed = params.get('confirmed');
    if (confirmed) {
      const messages = {
        success: {
          de: 'Deine Anmeldung wurde erfolgreich bestätigt!',
          en: 'Your subscription has been successfully confirmed!',
          tl: 'Matagumpay na nakumpirma ang iyong subscription!'
        },
        already: {
          de: 'Deine Anmeldung wurde bereits bestätigt.',
          en: 'Your subscription has already been confirmed.',
          tl: 'Nakumpirma na ang iyong subscription.'
        },
        invalid: {
          de: 'Ungültiger Bestätigungslink.',
          en: 'Invalid confirmation link.',
          tl: 'Di-wastong confirmation link.'
        },
        error: {
          de: 'Fehler bei der Bestätigung. Bitte versuche es erneut.',
          en: 'Error confirming. Please try again.',
          tl: 'Error sa pagkumpirma. Pakisubukan muli.'
        }
      };
      
      const msg = messages[confirmed as keyof typeof messages];
      if (msg) {
        if (confirmed === 'success' || confirmed === 'already') {
          toast.success(msg[language]);
        } else {
          toast.error(msg[language]);
        }
      }
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [language]);
};

const IndexContent = () => {
  useNewsletterStatus();
  
  return (
    <>
      <SEOHead />
      <Suspense fallback={null}>
        <EpisodeSchemas />
        <FAQSchema />
      </Suspense>
      
      {/* Skip Navigation */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      
      {/* Animated Background - lazy loaded, decorative only */}
      <Suspense fallback={null}>
        <ParticleNetwork />
      </Suspense>
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main id="main-content">
        <Hero />
        {/* Lead Magnet Section - prominently placed after Hero */}
        <LeadMagnet />
        {/* Episodes and Blog are imported synchronously for immediate FCP */}
        <Episodes />
        <Blog />
        {/* Below-the-fold components with content-like skeleton */}
        <Suspense fallback={<SectionLoader />}>
          <FAQ />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Newsletter />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <LegalPages />
        </Suspense>
      </main>
      
      {/* Footer */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      
      {/* Cookie Consent - lazy loaded */}
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
      
      {/* Language Detection Notification - lazy loaded */}
      <Suspense fallback={null}>
        <LanguageDetectedToast />
      </Suspense>
      
      {/* Toaster - lazy loaded to reduce initial bundle */}
      <Suspense fallback={null}>
        <LazyToaster />
      </Suspense>
    </>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
