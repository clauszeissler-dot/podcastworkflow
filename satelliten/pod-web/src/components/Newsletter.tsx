import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Mail, Send, Check, Linkedin, MessageCircle, Link2 } from 'lucide-react';
import XIcon from '@/components/icons/XIcon';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Validation constants
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;

// hCaptcha Site Key (from secrets)
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '';

// Extend window type for hCaptcha
declare global {
  interface Window {
    hcaptcha?: {
      render: (containerId: string, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
        'error-callback': () => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
      }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onHCaptchaLoad?: () => void;
  }
}

const Newsletter = () => {
  const { language, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const captchaWidgetId = useRef<string | null>(null);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Lazy-load hCaptcha only when newsletter section is in view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only need to load once
        }
      },
      { rootMargin: '200px' } // Start loading slightly before visible
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Load hCaptcha script only when section is in view
  useEffect(() => {
    if (!isInView) return; // Don't load until section is visible
    
    if (!HCAPTCHA_SITE_KEY) {
      console.warn('hCaptcha site key not configured');
      setCaptchaError(true);
      return;
    }

    // Check if script already loaded
    if (window.hcaptcha) {
      setCaptchaLoaded(true);
      return;
    }

    // Set up callback for when hCaptcha loads
    window.onHCaptchaLoad = () => {
      setCaptchaLoaded(true);
    };

    // Load the hCaptcha script
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js?onload=onHCaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load hCaptcha script');
      setCaptchaError(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (window.onHCaptchaLoad) {
        delete window.onHCaptchaLoad;
      }
    };
  }, [isInView]);

  // Render hCaptcha widget when loaded
  useEffect(() => {
    if (captchaLoaded && window.hcaptcha && captchaContainerRef.current && !captchaWidgetId.current) {
      try {
        captchaWidgetId.current = window.hcaptcha.render(captchaContainerRef.current.id, {
          sitekey: HCAPTCHA_SITE_KEY,
          callback: (token: string) => {
            setCaptchaToken(token);
            setCaptchaError(false);
          },
          'expired-callback': () => {
            setCaptchaToken(null);
          },
          'error-callback': () => {
            setCaptchaError(true);
            setCaptchaToken(null);
          },
          theme: 'dark',
          size: 'normal',
        });
      } catch (error) {
        console.error('Error rendering hCaptcha:', error);
        setCaptchaError(true);
      }
    }
  }, [captchaLoaded]);

  // Reset captcha after form submission
  const resetCaptcha = useCallback(() => {
    if (window.hcaptcha && captchaWidgetId.current) {
      window.hcaptcha.reset(captchaWidgetId.current);
    }
    setCaptchaToken(null);
  }, []);

  const validateEmail = (emailValue: string): boolean => {
    const trimmed = emailValue.trim();
    
    if (!trimmed) {
      setEmailError(language === 'de' ? 'E-Mail ist erforderlich' : language === 'en' ? 'Email is required' : 'Kinakailangan ang email');
      return false;
    }
    
    if (trimmed.length > MAX_EMAIL_LENGTH) {
      setEmailError(language === 'de' ? 'E-Mail zu lang' : language === 'en' ? 'Email too long' : 'Masyadong mahaba ang email');
      return false;
    }
    
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError(language === 'de' ? 'Ungültiges E-Mail-Format' : language === 'en' ? 'Invalid email format' : 'Di-wastong format ng email');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      validateEmail(value);
    }
  };

  const handleEmailBlur = () => {
    if (email) {
      validateEmail(email);
    }
  };

  const sanitizeName = (nameValue: string): string => {
    return nameValue
      .trim()
      .slice(0, MAX_NAME_LENGTH)
      .replace(/[<>'"&]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    if (!consent) {
      toast.error(language === 'de' ? 'Bitte stimme der Datenschutzerklärung zu' : language === 'en' ? 'Please agree to the privacy policy' : 'Pakisang-ayunan ang patakaran sa privacy');
      return;
    }

    // Validate captcha
    if (!captchaToken && !captchaError) {
      toast.error(language === 'de' ? 'Bitte bestätige, dass du kein Bot bist' : language === 'en' ? 'Please confirm you are not a bot' : 'Pakikumpirma na hindi ka bot');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const sanitizedName = sanitizeName(name);
      const sanitizedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { 
          name: sanitizedName, 
          email: sanitizedEmail, 
          language: selectedLang,
          captchaToken: captchaToken
        }
      });

      if (error) throw error;

      setIsSubscribed(true);
      // Show Double-Opt-In message
      const confirmMessage = language === 'de' 
        ? 'Bitte bestätige deine Anmeldung über den Link in der E-Mail.' 
        : language === 'en' 
        ? 'Please confirm your subscription via the link in the email.' 
        : 'Pakikumpirma ang iyong subscription sa pamamagitan ng link sa email.';
      toast.success(confirmMessage);
      
      // Reset after showing success
      setTimeout(() => {
        setName('');
        setEmail('');
        setConsent(false);
        setIsSubscribed(false);
        setEmailError('');
        resetCaptcha();
      }, 5000);
    } catch (error: any) {
      // Don't log sensitive data
      console.error('Newsletter subscription failed');
      
      // Reset captcha on error
      resetCaptcha();
      
      // Check for rate limit error
      if (error?.message?.includes('429') || error?.message?.includes('Too many')) {
        toast.error(language === 'de' ? 'Zu viele Anfragen. Bitte versuche es später erneut.' : language === 'en' ? 'Too many requests. Please try again later.' : 'Napakaraming kahilingan. Pakisubukan muli mamaya.');
      } else if (error?.message?.includes('captcha') || error?.message?.includes('CAPTCHA')) {
        toast.error(language === 'de' ? 'CAPTCHA-Verifizierung fehlgeschlagen. Bitte versuche es erneut.' : language === 'en' ? 'CAPTCHA verification failed. Please try again.' : 'Nabigo ang pag-verify ng CAPTCHA. Pakisubukan muli.');
      } else {
        toast.error(language === 'de' ? 'Fehler beim Anmelden. Bitte versuche es erneut.' : language === 'en' ? 'Error subscribing. Please try again.' : 'Error sa pag-subscribe. Pakisubukan muli.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
    { code: 'tl', label: 'Filipino' },
  ];

  // Check if submit should be disabled
  const isSubmitDisabled = isSubmitting || !consent || !email || !!emailError || (!captchaToken && !captchaError);

  return (
    <section ref={sectionRef} id="newsletter" className="relative py-20 bg-muted/20">
      <div className="container px-4 max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-primary">{t('newsletter.title')}</span>
          </h2>
          
          <p className="text-muted-foreground">
            {t('newsletter.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          {isSubscribed ? (
            <div className="text-center py-10 animate-fade-in">
              {/* Animiertes Erfolgs-Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 animate-bounce-slow shadow-lg shadow-green-500/30">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              {/* Personalisierte Dankesnachricht */}
              <h3 className="text-2xl font-display font-bold text-green-500 mb-3">
                {language === 'de' 
                  ? `Vielen Dank${name ? `, ${sanitizeName(name)}` : ''}!` 
                  : language === 'en' 
                  ? `Thank you${name ? `, ${sanitizeName(name)}` : ''}!` 
                  : `Maraming salamat${name ? `, ${sanitizeName(name)}` : ''}!`}
              </h3>
              
              {/* Erfolgstext */}
              <p className="text-lg text-foreground mb-4">
                {t('newsletter.success')}
              </p>
              
              {/* Double-Opt-In Hinweis */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 mb-6">
                <Mail className="w-5 h-5 text-primary" />
                <p className="text-sm">
                  {language === 'de' 
                    ? 'Bitte bestätige deine Anmeldung über den Link in der E-Mail.' 
                    : language === 'en' 
                    ? 'Please confirm your subscription via the link in the email.' 
                    : 'Pakikumpirma ang iyong subscription sa pamamagitan ng link sa email.'}
                </p>
              </div>

              {/* Social Media Share Buttons */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'de' 
                    ? 'Teile den Podcast mit deinen Freunden:' 
                    : language === 'en' 
                    ? 'Share the podcast with your friends:' 
                    : 'Ibahagi ang podcast sa iyong mga kaibigan:'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {/* X (Twitter) Share */}
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                      language === 'de' 
                        ? 'Ich habe mich gerade für den KI AffAIrs Newsletter angemeldet! 🎙️ Der Podcast über Künstliche Intelligenz.' 
                        : language === 'en'
                        ? 'I just subscribed to the AI AffAIrs newsletter! 🎙️ The podcast about Artificial Intelligence.'
                        : 'Nag-subscribe ako sa AI AffAIrs newsletter! 🎙️ Ang podcast tungkol sa Artificial Intelligence.'
                    )}&url=${encodeURIComponent('https://kiaffairs.lovable.app')}&via=KI_AffAIrs_Pod`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Share on X"
                  >
                    <XIcon className="w-5 h-5 text-foreground" />
                  </a>

                  {/* LinkedIn Share */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://kiaffairs.lovable.app')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#0A66C2]/80 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-foreground" />
                  </a>

                  {/* WhatsApp Share */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      language === 'de' 
                        ? 'Schau dir den KI AffAIrs Podcast an! 🎙️ https://kiaffairs.lovable.app' 
                        : language === 'en'
                        ? 'Check out the AI AffAIrs Podcast! 🎙️ https://kiaffairs.lovable.app'
                        : 'Tingnan mo ang AI AffAIrs Podcast! 🎙️ https://kiaffairs.lovable.app'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366]/80 transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 text-foreground" />
                  </a>

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://kiaffairs.lovable.app');
                      toast.success(
                        language === 'de' ? 'Link kopiert!' : language === 'en' ? 'Link copied!' : 'Nakopya ang link!'
                      );
                    }}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-primary/80 transition-colors"
                    aria-label="Copy link"
                  >
                    <Link2 className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">{t('newsletter.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={MAX_NAME_LENGTH}
                  className="bg-background/50 border-white/10 focus:border-primary"
                  placeholder="Max Mustermann"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('newsletter.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  maxLength={MAX_EMAIL_LENGTH}
                  className={`bg-background/50 border-white/10 focus:border-primary ${emailError ? 'border-red-500' : ''}`}
                  placeholder="email@example.com"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
                {emailError && (
                  <p id="email-error" className="text-sm text-red-500" role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('newsletter.language')}</Label>
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLang(lang.code)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all focus-glow ${
                        selectedLang === lang.code
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                  {t('newsletter.consent')} *
                </Label>
              </div>

              {/* hCaptcha Widget */}
              <div className="flex justify-center">
                {HCAPTCHA_SITE_KEY ? (
                  <div
                    id="hcaptcha-container"
                    ref={captchaContainerRef}
                    className="h-[78px]"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {language === 'de' ? 'Bot-Schutz wird geladen...' : language === 'en' ? 'Loading bot protection...' : 'Nilo-load ang proteksyon sa bot...'}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full btn-glow glow-primary font-display"
                disabled={isSubmitDisabled}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('newsletter.submit')}
                  </>
                )}
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
