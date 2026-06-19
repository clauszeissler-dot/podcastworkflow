import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import XIcon from '@/components/icons/XIcon';

const Footer = () => {
  const { language, t } = useLanguage();
  const podcastName = language === 'de' ? 'KI AffAIrs' : 'AI AffAIrs';

  const socialLinks = [
    { name: 'X', icon: XIcon, url: 'https://x.com/KI_AffAIrs_Pod' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/profile.php?id=61583493536978' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/ki_affairs_pod' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/playlist?list=PLF5fMZH1DHnNY7WPF8JJrl_mN-_YFi5dp' },
  ];

  const handleLegalClick = (section: 'impressum' | 'datenschutz') => {
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 border-t border-white/10">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo - text only to avoid loading large image files */}
          <div className="flex items-center gap-2 font-display text-xl font-bold text-gradient-primary">
            <span>{podcastName}</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:glow-primary transition-all focus-glow"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button
              onClick={() => handleLegalClick('impressum')}
              className="hover:text-foreground transition-colors focus-glow rounded"
            >
              {t('footer.impressum')}
            </button>
            <button
              onClick={() => handleLegalClick('datenschutz')}
              className="hover:text-foreground transition-colors focus-glow rounded"
            >
              {t('footer.datenschutz')}
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {podcastName}. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
