import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import SpotifyIcon from '@/components/icons/SpotifyIcon';
import YouTubeIcon from '@/components/icons/YouTubeIcon';
import ApplePodcastsIcon from '@/components/icons/ApplePodcastsIcon';
import AmazonMusicIcon from '@/components/icons/AmazonMusicIcon';

// Use public folder paths for LCP images with properly sized mobile variants
const kiHeroLogoMobile = '/hero-ki-affairs-480.webp';
const kiHeroLogoDesktop = '/hero-ki-affairs-optimized.webp';
const aiHeroLogoMobile = '/hero-ai-affairs-480.webp';
const aiHeroLogoDesktop = '/hero-ai-affairs-optimized.webp';

const Hero = () => {
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();

  const podcastName = language === 'de' ? 'KI AffAIrs' : 'AI AffAIrs';
  const heroLogoMobile = language === 'de' ? kiHeroLogoMobile : aiHeroLogoMobile;
  const heroLogoDesktop = language === 'de' ? kiHeroLogoDesktop : aiHeroLogoDesktop;

  const platforms = [
    { name: 'Spotify', url: 'https://open.spotify.com/show/4w8F1TPDG9o8tJoFfU784F', icon: SpotifyIcon },
    { name: 'YouTube', url: 'https://www.youtube.com/playlist?list=PLF5fMZH1DHnNY7WPF8JJrl_mN-_YFi5dp', icon: YouTubeIcon },
    { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/us/podcast/ki-affairs/id1848998799', icon: ApplePodcastsIcon },
    { name: 'Amazon Music', url: 'https://music.amazon.de/podcasts/e062b1e2-9a8e-46fc-8a77-11b06a84204b', icon: AmazonMusicIcon },
  ];

  return (
    <section id="home" className="relative flex items-start justify-center pt-16 md:pt-20 pb-8 md:pb-16">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      
      {/* Container */}
      <div className="container relative z-10 px-4 py-2 md:py-12 text-center">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Content - rendered immediately without animation delay */}
          <div className="animate-fade-in">
            {/* Logo as full-width hero banner - Desktop only */}
            <div className="hidden md:block mb-4 md:mb-6 animate-float relative">
              <div className="relative w-full max-w-3xl mx-auto" style={{ aspectRatio: '768/400', minHeight: '180px' }}>
              <picture>
                  <source
                    type="image/webp"
                    media="(max-width: 768px)"
                    srcSet={heroLogoMobile}
                  />
                  <source
                    type="image/webp"
                    media="(min-width: 769px)"
                    srcSet={heroLogoDesktop}
                  />
                  <img
                    src={heroLogoDesktop}
                    alt={`${podcastName} Logo`}
                    className="w-full h-full object-contain"
                    width={768}
                    height={400}
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                  />
                </picture>
                {/* Gradient fade edges */}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />
              </div>
            </div>

            {/* Title - sr-only for SEO */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sr-only" style={{ lineHeight: 1.2 }}>
              <span className="text-gradient-primary">{language === 'de' ? 'KI' : 'AI'}</span>{' '}
              <span className="text-foreground">AffAIrs</span>
            </h1>

            {/* Visible Title - Mobile */}
            {isMobile && (
              <h2 className="font-display text-3xl font-bold mb-4" style={{ lineHeight: 1.2 }}>
                <span className="text-gradient-primary">{language === 'de' ? 'KI' : 'AI'}</span>{' '}
                <span className="text-foreground">AffAIrs</span>
              </h2>
            )}

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-3 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Schedule */}
            <p className="text-sm md:text-base text-secondary font-medium mb-8">
              {t('hero.schedule')}
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              className="btn-glow glow-primary animate-glow-pulse mb-8 font-display text-lg px-8 py-6"
              onClick={() => document.querySelector('#episodes')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="w-5 h-5 mr-2" />
              {t('hero.cta')}
            </Button>

            {/* Platform Links */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card px-4 md:px-6 py-2 md:py-3 flex items-center gap-2 hover:border-primary/50 transition-all hover:glow-primary focus-glow text-sm md:text-base"
                >
                  <platform.icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-medium">{platform.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - CSS animation only */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
