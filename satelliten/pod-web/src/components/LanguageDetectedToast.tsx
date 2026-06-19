import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Globe, X } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const TOAST_SHOWN_KEY = 'ki-affairs-lang-toast-shown';

const languageNames: Record<Language, Record<Language, string>> = {
  de: { de: 'Deutsch', en: 'Englisch', tl: 'Filipino' },
  en: { de: 'German', en: 'English', tl: 'Filipino' },
  tl: { de: 'Aleman', en: 'Ingles', tl: 'Filipino' },
};

const toastMessages: Record<Language, { title: string; change: string }> = {
  de: { 
    title: 'Sprache automatisch erkannt',
    change: 'Sprache wechseln'
  },
  en: { 
    title: 'Language automatically detected',
    change: 'Change language'
  },
  tl: { 
    title: 'Awtomatikong nakita ang wika',
    change: 'Palitan ang wika'
  },
};

export const LanguageDetectedToast = () => {
  const { language, setLanguage, isDetecting } = useLanguage();
  const [hasShownToast, setHasShownToast] = useState(() => {
    return localStorage.getItem(TOAST_SHOWN_KEY) === 'true';
  });

  useEffect(() => {
    // Show toast after detection completes, only once per session
    if (!isDetecting && !hasShownToast) {
      const detectionKey = localStorage.getItem('ki-affairs-geo-detected');
      
      // Only show if we actually did geo-detection (not browser fallback or error)
      if (detectionKey && detectionKey !== 'browser' && detectionKey !== 'error') {
        const messages = toastMessages[language];
        const langName = languageNames[language][language];
        
        // Small delay to ensure page is loaded
        const timer = setTimeout(() => {
          toast(
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {messages.title}: <span className="text-primary">{langName}</span>
                </p>
                <div className="flex gap-2 mt-2">
                  {(['de', 'en', 'tl'] as Language[])
                    .filter(l => l !== language)
                    .map(lang => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          toast.dismiss();
                        }}
                        className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                      >
                        {languageNames[language][lang]}
                      </button>
                    ))}
                </div>
              </div>
            </div>,
            {
              duration: 8000,
              className: 'glass-card border-primary/20',
            }
          );
          
          localStorage.setItem(TOAST_SHOWN_KEY, 'true');
          setHasShownToast(true);
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [isDetecting, hasShownToast, language, setLanguage]);

  return null;
};
