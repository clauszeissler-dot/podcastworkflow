import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Briefcase, Home, Users, ExternalLink, Mail, ArrowRight, Sparkles, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LeadMagnetCard {
  id: string;
  icon: typeof Briefcase;
  titleKey: string;
  descriptionKey: string;
  notionUrl: string;
  pdfFilename: string;
  accentColor: string;
  bgGradient: string;
}

const leadMagnets: LeadMagnetCard[] = [
  {
    id: 'buero',
    icon: Briefcase,
    titleKey: 'leadMagnet.buero.title',
    descriptionKey: 'leadMagnet.buero.description',
    notionUrl: 'https://www.notion.so/10-KI-Prompts-f-r-den-B-ro-Alltag-2f51ab65183c80f0943cdc46084da056',
    pdfFilename: '10-ki-prompts-buero',
    accentColor: 'text-primary',
    bgGradient: 'from-primary/20 to-primary/5',
  },
  {
    id: 'zuhause',
    icon: Home,
    titleKey: 'leadMagnet.zuhause.title',
    descriptionKey: 'leadMagnet.zuhause.description',
    notionUrl: 'https://www.notion.so/10-KI-Prompts-f-r-Zuhause-2f51ab65183c80149893c9007df5f0e9',
    pdfFilename: '10-ki-prompts-zuhause',
    accentColor: 'text-secondary',
    bgGradient: 'from-secondary/20 to-secondary/5',
  },
  {
    id: 'kinder',
    icon: Users,
    titleKey: 'leadMagnet.kinder.title',
    descriptionKey: 'leadMagnet.kinder.description',
    notionUrl: 'https://www.notion.so/10-KI-Prompts-f-r-Familien-mit-Kindern-2f51ab65183c80f7924efda96a85b466',
    pdfFilename: '10-ki-prompts-kinder',
    accentColor: 'text-green-400',
    bgGradient: 'from-green-400/20 to-green-400/5',
  },
];

const LeadMagnet = () => {
  const { t } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<LeadMagnetCard | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCard(null);
    };
    if (selectedCard) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedCard]);

  const handlePdfRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard || !email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error(t('leadMagnet.modal.invalidEmail'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-lead-magnet', {
        body: {
          email: email.trim().toLowerCase(),
          resource: selectedCard.pdfFilename,
        },
      });

      if (error) throw error;

      setEmailSent(true);

      // Track event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'lead_magnet_email', {
          event_category: 'lead_magnet',
          event_label: selectedCard.pdfFilename,
        });
      }

      // Reset after delay
      setTimeout(() => {
        setSelectedCard(null);
        setEmail('');
        setEmailSent(false);
      }, 4000);
    } catch {
      toast.error(t('leadMagnet.modal.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotionClick = (card: LeadMagnetCard) => {
    // Track event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'lead_magnet_notion', {
        event_category: 'lead_magnet',
        event_label: card.id,
      });
    }
    window.open(card.notionUrl, '_blank', 'noopener,noreferrer');
    setSelectedCard(null);
  };

  return (
    <section id="free-resources" className="relative py-16 md:py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('leadMagnet.badge')}
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">{t('leadMagnet.title')}</span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('leadMagnet.subtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
          {/* Prompt Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {leadMagnets.map((card) => {
              const Icon = card.icon;
              const isHovered = hoveredCard === card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => { setSelectedCard(card); setEmailSent(false); setEmail(''); }}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm transition-all duration-300 text-left cursor-pointer ${
                    isHovered ? 'scale-[1.02] border-white/20 shadow-xl' : ''
                  }`}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-80' : ''}`} />

                  {/* Content */}
                  <div className="relative z-10 p-6 md:p-8 flex flex-col h-full min-h-[280px]">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-background/50 border border-white/10 mb-5 ${card.accentColor} transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-foreground">
                      {t(card.titleKey)}
                    </h3>

                    <p className="text-muted-foreground text-sm md:text-base mb-6 flex-grow">
                      {t(card.descriptionKey)}
                    </p>

                    <div className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-background/50 border border-white/10 group-hover:bg-background/80 group-hover:border-white/20 text-foreground transition-all duration-300 text-sm font-medium">
                      {t('leadMagnet.getPrompts')}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : ''}`}>
                    <div className={`absolute -inset-1 bg-gradient-to-r ${card.bgGradient} blur-xl`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA - Subtle newsletter hint */}
        <div className="text-center mt-10 md:mt-14">
          <p className="text-muted-foreground text-sm">
            {t('leadMagnet.moreHint')}{' '}
            <button
              onClick={() => document.querySelector('#newsletter')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              {t('leadMagnet.newsletterLink')}
            </button>
          </p>
        </div>
      </div>

      {/* Choice Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedCard(null); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-card shadow-2xl animate-slide-up"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              {/* Modal Header */}
              <h3 id="modal-title" className="font-display text-xl md:text-2xl font-bold mb-2 text-foreground">
                {t(selectedCard.titleKey)}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {t('leadMagnet.modal.subtitle')}
              </p>

              {!emailSent ? (
                <div className="space-y-3">
                  {/* Option 1: Notion */}
                  <button
                    onClick={() => handleNotionClick(selectedCard)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-background/50 hover:bg-background/80 hover:border-white/20 transition-all duration-200 text-left group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{t('leadMagnet.modal.notionTitle')}</p>
                      <p className="text-muted-foreground text-xs">{t('leadMagnet.modal.notionDesc')}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">{t('leadMagnet.modal.or')}</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Option 2: PDF per E-Mail */}
                  <form onSubmit={handlePdfRequest} className="space-y-3">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-background/50">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{t('leadMagnet.modal.pdfTitle')}</p>
                        <p className="text-muted-foreground text-xs">{t('leadMagnet.modal.pdfDesc')}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('leadMagnet.modal.emailPlaceholder')}
                        required
                        className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-white/10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting || !email.trim()}
                        className="px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      >
                        {isSubmitting ? '...' : t('leadMagnet.modal.send')}
                      </Button>
                    </div>

                    <p className="text-muted-foreground text-[11px] leading-tight">
                      {t('leadMagnet.modal.privacy')}
                    </p>
                  </form>
                </div>
              ) : (
                /* Success State */
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-green-400" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">{t('leadMagnet.modal.successTitle')}</p>
                  <p className="text-muted-foreground text-sm">{t('leadMagnet.modal.successDesc')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LeadMagnet;
