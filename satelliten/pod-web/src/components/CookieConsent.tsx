import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Cookie, X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('ki-affairs-cookie-consent');
    if (!saved) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleAcceptNecessary();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isVisible]);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('ki-affairs-cookie-consent', JSON.stringify(prefs));
    setIsVisible(false);
    
    // Load or disable Google Analytics based on consent
    if (prefs.analytics && typeof window !== 'undefined') {
      // Load GA if consented
      if ((window as any).loadGoogleAnalytics) {
        (window as any).loadGoogleAnalytics();
      }
    } else if (!prefs.analytics && typeof window !== 'undefined') {
      // Disable GA tracking if user revoked consent
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = { necessary: true, analytics: false, marketing: false };
    setPreferences(necessaryOnly);
    savePreferences(necessaryOnly);
  };

  const reopenBanner = () => {
    setShowBanner(false);
    setIsVisible(true);
  };

  if (!isVisible && !showBanner) {
    return (
      <button
        onClick={reopenBanner}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:glow-primary transition-all focus-glow"
        aria-label="Cookie settings"
      >
        <Cookie className="w-6 h-6" />
      </button>
    );
  }

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
    >
      <div className="glass-card w-full max-w-lg p-6 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <h2 id="cookie-title" className="font-display text-lg font-semibold">
              {t('cookie.title')}
            </h2>
          </div>
          <button
            onClick={handleAcceptNecessary}
            className="text-muted-foreground hover:text-foreground transition-colors focus-glow rounded p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          {t('cookie.description')}
        </p>

        <div className="space-y-4 mb-6">
          {/* Necessary */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-sm">{t('cookie.necessary')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('cookie.necessaryDesc')}
              </p>
            </div>
            <Switch checked disabled className="opacity-50" />
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-sm">{t('cookie.analytics')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('cookie.analyticsDesc')}
              </p>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, analytics: checked }))
              }
            />
          </div>

          {/* Marketing */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-sm">{t('cookie.marketing')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('cookie.marketingDesc')}
              </p>
            </div>
            <Switch
              checked={preferences.marketing}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, marketing: checked }))
              }
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleAcceptNecessary}
          >
            {t('cookie.acceptNecessary')}
          </Button>
          <Button
            className="flex-1 btn-glow"
            onClick={handleAcceptAll}
          >
            {t('cookie.acceptAll')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
