import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const podcastName = language === 'de' ? 'KI AffAIrs' : 'AI AffAIrs';

  const navItems = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.resources', href: '#free-resources' },
    { key: 'nav.episodes', href: '#episodes' },
    { key: 'nav.blog', href: '#blog' },
    { key: 'nav.faq', href: '#faq' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.newsletter', href: '#newsletter' },
    { key: 'nav.contact', href: '#contact' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'de', label: 'DE' },
    { code: 'en', label: 'EN' },
    { code: 'tl', label: 'TL' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - text only to avoid loading large image files on mobile */}
          <a 
            href="#home" 
            className="flex items-center gap-2 font-display text-xl font-bold text-gradient-primary focus-glow"
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
          >
            <span>{podcastName}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className="text-muted-foreground hover:text-primary transition-colors focus-glow rounded px-2 py-1"
              >
                {t(item.key)}
              </a>
            ))}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all focus-glow ${
                    language === lang.code
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label={`Switch to ${lang.label}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden focus-glow flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className="text-muted-foreground hover:text-primary transition-colors py-2 focus-glow rounded"
                >
                  {t(item.key)}
                </a>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-all focus-glow ${
                      language === lang.code
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
