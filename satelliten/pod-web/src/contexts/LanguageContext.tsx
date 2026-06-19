import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { translations, Language } from '@/data/translations';

// Re-export Language type for backwards compatibility
export type { Language } from '@/data/translations';

// Re-export translations for components that import from here
export { translations } from '@/data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isDetecting: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'ki-affairs-language';
const DETECTION_KEY = 'ki-affairs-geo-detected';

// Fallback: detect language from browser settings
function detectFromBrowser(): Language {
  const browserLang = navigator.language?.toLowerCase() || '';
  
  // German variants
  if (browserLang.startsWith('de')) {
    return 'de';
  }
  
  // Filipino/Tagalog variants
  if (browserLang.startsWith('tl') || browserLang.startsWith('fil')) {
    return 'tl';
  }
  
  return 'en';
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check if user has a saved preference
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return saved as Language;
    }
    // Start with browser detection as initial value (fast, no network)
    return detectFromBrowser();
  });
  
  const [isDetecting, setIsDetecting] = useState(() => {
    // Only detect if no saved preference AND no previous detection
    const saved = localStorage.getItem(STORAGE_KEY);
    const detected = localStorage.getItem(DETECTION_KEY);
    return !saved && !detected;
  });

  const FAVICON_VERSION = 'v2';

  const setFavicon = (lang: Language) => {
    const faviconPath = lang === 'de' ? '/favicon-ki.png' : '/favicon-ai.png';
    const href = `${faviconPath}?${FAVICON_VERSION}`;
    
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }
    link.href = href;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'tl' ? 'tl' : lang;
    setFavicon(lang);
  };

  // Geo-detection on first visit - deferred to not block FCP
  useEffect(() => {
    const detectLanguage = async () => {
      // Skip if user already has a preference or we already detected
      const saved = localStorage.getItem(STORAGE_KEY);
      const alreadyDetected = localStorage.getItem(DETECTION_KEY);
      
      if (saved || alreadyDetected) {
        setIsDetecting(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('detect-language');
        
        if (error) {
          console.warn('Geo-detection failed, using browser fallback:', error);
          // Mark as detected to avoid repeated attempts
          localStorage.setItem(DETECTION_KEY, 'browser');
          setIsDetecting(false);
          return;
        }

        const detectedLang = data?.language as Language;
        
        if (detectedLang && ['de', 'en', 'tl'].includes(detectedLang)) {
          console.log(`Geo-detected language: ${detectedLang} (country: ${data?.country})`);
          setLanguageState(detectedLang);
          localStorage.setItem(STORAGE_KEY, detectedLang);
          localStorage.setItem(DETECTION_KEY, data?.country || 'geo');
          document.documentElement.lang = detectedLang === 'tl' ? 'tl' : detectedLang;
          setFavicon(detectedLang);
        }
      } catch (error) {
        console.warn('Geo-detection error:', error);
        localStorage.setItem(DETECTION_KEY, 'error');
      } finally {
        setIsDetecting(false);
      }
    };

    if (isDetecting) {
      // Defer detection well after LCP/TTI using requestIdleCallback with no timeout
      // This ensures the detection runs only when browser is truly idle, not blocking performance metrics
      const scheduleDetection = () => {
        // Wait for initial page load to fully complete before even scheduling
        if (document.readyState === 'complete') {
          if (window.requestIdleCallback) {
            // No timeout = runs only when truly idle, won't block TTI
            window.requestIdleCallback(() => detectLanguage());
          } else {
            // Fallback: wait 5 seconds after load to not affect performance metrics
            setTimeout(detectLanguage, 5000);
          }
        } else {
          // If page not fully loaded, wait for load event + additional delay
          window.addEventListener('load', () => {
            setTimeout(() => {
              if (window.requestIdleCallback) {
                window.requestIdleCallback(() => detectLanguage());
              } else {
                detectLanguage();
              }
            }, 3000);
          }, { once: true });
        }
      };
      
      scheduleDetection();
    }
  }, [isDetecting]);

  useEffect(() => {
    document.documentElement.lang = language === 'tl' ? 'tl' : language;
    setFavicon(language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.de || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isDetecting }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
