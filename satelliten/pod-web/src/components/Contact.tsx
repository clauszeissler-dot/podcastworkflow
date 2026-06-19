import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MessageSquare } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="relative py-20">
      <div className="container px-4 max-w-2xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
          <span className="text-gradient-secondary">{t('contact.title')}</span>
        </h2>

        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">{t('contact.email')}</p>
              <a 
                href="mailto:info@kiaffairs-podcast.de" 
                className="text-lg font-medium text-primary hover:text-primary/80 transition-colors focus-glow rounded"
              >
                info@kiaffairs-podcast.de
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <MessageSquare className="w-5 h-5" />
              <p>{t('contact.topics')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
