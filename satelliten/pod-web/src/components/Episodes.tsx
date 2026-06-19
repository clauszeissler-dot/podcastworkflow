import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Clock, Calendar, Play, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SpotifyIcon from '@/components/icons/SpotifyIcon';
import YouTubeIcon from '@/components/icons/YouTubeIcon';
import ApplePodcastsIcon from '@/components/icons/ApplePodcastsIcon';
import AmazonMusicIcon from '@/components/icons/AmazonMusicIcon';
import { useEpisodes, extractYoutubeId, extractSpotifyId } from '@/hooks/useEpisodes';
import { useIsMobile } from '@/hooks/use-mobile';
import LazyEmbed from '@/components/LazyEmbed';

type Platform = 'spotify' | 'youtube' | 'apple' | 'amazon';

type EpisodeType = 'quickie' | 'full';

const Episodes = () => {
  const { language, t } = useLanguage();
  const { data: currentEpisodes = [], isLoading, error } = useEpisodes();
  const isMobile = useIsMobile();
  const [activePlatform, setActivePlatform] = useState<Platform>('spotify');
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<EpisodeType | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter episodes based on selected filter (null = show all)
  const filteredEpisodes = activeFilter 
    ? currentEpisodes.filter((episode) => episode.type === activeFilter)
    : currentEpisodes;

  // Responsive episodes per page: 3 on mobile, 6 on desktop
  const episodesPerPage = isMobile ? 3 : 6;
  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);
  const visibleEpisodes = filteredEpisodes.slice(
    carouselIndex * episodesPerPage,
    (carouselIndex + 1) * episodesPerPage
  );

  const platforms = [
    { id: 'spotify' as Platform, name: 'Spotify', icon: SpotifyIcon },
    { id: 'youtube' as Platform, name: 'YouTube', icon: YouTubeIcon },
    { id: 'apple' as Platform, name: 'Apple Podcasts', icon: ApplePodcastsIcon },
    { id: 'amazon' as Platform, name: 'Amazon Music', icon: AmazonMusicIcon },
  ];

  const filterButtons = [
    { id: 'quickie' as EpisodeType, label: { de: 'Quickie', en: 'Quickie', tl: 'Quickie' } },
    { id: 'full' as EpisodeType, label: { de: 'Volle Folge', en: 'Full Episode', tl: 'Buong Episode' } },
  ];

  const handleShare = async (episode: typeof currentEpisodes[0]) => {
    const podcastName = language === 'de' ? 'KI AffAIrs' : 'AI AffAIrs';
    const shareData = {
      title: `${podcastName} - ${episode.title}`,
      text: episode.description,
      url: episode.links[activePlatform] || window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success(language === 'de' ? 'Link kopiert!' : language === 'en' ? 'Link copied!' : 'Nakopya ang link!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handlePlayEpisode = (index: number) => {
    // Find the actual index in filtered episodes
    const episode = visibleEpisodes[index];
    const actualIndex = filteredEpisodes.findIndex(e => e === episode);
    setSelectedEpisode(actualIndex);
    
    // Analytics event for play button (Google Analytics)
    const win = window as typeof window & { gtag?: (...args: unknown[]) => void };
    if (win.gtag) {
      win.gtag('event', 'play_episode', {
        event_category: 'Podcast',
        event_label: episode.title,
        episode_number: episode.number,
        episode_type: episode.type,
        platform: activePlatform,
      });
    }
    
    // Fallback: dispatch custom event for any analytics system
    window.dispatchEvent(new CustomEvent('podcast_play', {
      detail: {
        episodeTitle: episode.title,
        episodeNumber: episode.number,
        episodeType: episode.type,
        platform: activePlatform,
      }
    }));
  };

  const handlePrevPage = useCallback(() => {
    setCarouselIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCarouselIndex(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  // Toggle filter - clicking same filter again shows all
  const handleToggleFilter = (filter: EpisodeType) => {
    setActiveFilter(prev => prev === filter ? null : filter);
    setCarouselIndex(0);
    setSelectedEpisode(null);
  };

  // Touch handling for mobile swipe
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && carouselIndex < totalPages - 1) {
        handleNextPage();
      } else if (diff < 0 && carouselIndex > 0) {
        handlePrevPage();
      }
    }
  };

  // Show-level embed IDs for each platform and language
  const spotifyShowIds = {
    de: '4w8F1TPDG9o8tJoFfU784F',
    en: '1WVJb4BpnzxjTnh6YcrilY',
    tl: '3CWFmIZCUuCXDL5pdHazLn',
  };

  const appleShowIds = {
    de: '1848998799',
    en: '1849269877',
    tl: '1849258372',
  };

  const youtubeChannelIds = {
    de: 'PLgIJzq_UqT4wr2IxP6pVSgq0mxoU4yDGk',
    en: 'PLgIJzq_UqT4zQiXyP3UaLpJxZUmlvZCLX',
    tl: 'PLgIJzq_UqT4yxP6pVSgq0mxoU4yDGkPL',
  };

  const amazonShowLinks = {
    de: 'https://music.amazon.de/podcasts/1fa27c92-0681-4dd8-a93d-a9b22eddd0c5/ki-affairs',
    en: 'https://music.amazon.com/podcasts/1fa27c92-0681-4dd8-a93d-a9b22eddd0c5/ai-affairs',
    tl: 'https://music.amazon.com/podcasts/1fa27c92-0681-4dd8-a93d-a9b22eddd0c5/ai-affairs-tagalog',
  };

  // Helper to check if episode has valid link for platform
  const hasValidEpisodeLink = (episode: typeof currentEpisodes[0], platform: Platform): boolean => {
    const link = episode.links[platform];
    if (!link) return false;
    
    switch (platform) {
      case 'spotify':
        return !!extractSpotifyId(link);
      case 'youtube':
        return !!extractYoutubeId(link);
      case 'apple':
        return !!link.match(/id(\d+)\?i=(\d+)/);
      case 'amazon':
        return !!link;
      default:
        return false;
    }
  };

  const renderShowLevelEmbed = () => {
    switch (activePlatform) {
      case 'spotify':
        return (
          <LazyEmbed height={352}>
            <iframe
              title="Spotify Podcast Player"
              src={`https://open.spotify.com/embed/show/${spotifyShowIds[language]}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            />
          </LazyEmbed>
        );
      case 'youtube':
        return (
          <LazyEmbed height={352}>
            <iframe
              title="YouTube Podcast Playlist"
              src={`https://www.youtube.com/embed/videoseries?list=${youtubeChannelIds[language]}`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            />
          </LazyEmbed>
        );
      case 'apple':
        return (
          <iframe
            title="Apple Podcasts Player"
            src={`https://embed.podcasts.apple.com/us/podcast/ki-affairs/id${appleShowIds[language]}`}
            width="100%"
            height="450"
            frameBorder="0"
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            loading="eager"
            className="rounded-lg"
            style={{ maxWidth: '660px', overflow: 'hidden', borderRadius: '10px' }}
          />
        );
      case 'amazon':
        return (
          <div className="flex flex-col items-center justify-center h-[352px] text-muted-foreground gap-4">
            <AmazonMusicIcon className="w-16 h-16 text-primary" />
            <p className="text-center max-w-md">
              {language === 'de' 
                ? 'Höre alle Folgen auf Amazon Music!' 
                : language === 'en' 
                ? 'Listen to all episodes on Amazon Music!'
                : 'Makinig sa lahat ng episode sa Amazon Music!'}
            </p>
            <a 
              href={amazonShowLinks[language]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {language === 'de' ? 'Auf Amazon Music anhören' : language === 'en' ? 'Listen on Amazon Music' : 'Makinig sa Amazon Music'}
            </a>
          </div>
        );
    }
  };

  const renderEmbed = () => {
    // If an episode is selected, check if it has a valid link for the current platform
    if (selectedEpisode !== null && filteredEpisodes[selectedEpisode]) {
      const episode = filteredEpisodes[selectedEpisode];
      
      // If no valid link for this platform, show show-level embed
      if (!hasValidEpisodeLink(episode, activePlatform)) {
        return renderShowLevelEmbed();
      }

      const link = episode.links[activePlatform];

      switch (activePlatform) {
        case 'spotify':
          const spotifyId = extractSpotifyId(link);
          return (
            <iframe
              title="Spotify Episode Player"
              src={`https://open.spotify.com/embed/episode/${spotifyId}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            />
          );
        case 'youtube':
          const youtubeId = extractYoutubeId(link);
          return (
            <iframe
              title="YouTube Episode Player"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            />
          );
        case 'apple':
          const appleMatch = link.match(/id(\d+)\?i=(\d+)/);
          return (
            <iframe
              title="Apple Podcasts Episode Player"
              src={`https://embed.podcasts.apple.com/us/podcast/episode/id${appleMatch![1]}?i=${appleMatch![2]}&theme=auto`}
              width="100%"
              height="175"
              frameBorder="0"
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
              loading="lazy"
              className="rounded-lg"
              style={{ overflow: 'hidden', background: 'transparent' }}
            />
          );
        case 'amazon':
          return (
            <div className="flex flex-col items-center justify-center h-[352px] text-muted-foreground gap-4">
              <AmazonMusicIcon className="w-16 h-16 text-primary" />
              <p className="text-center max-w-md">
                {language === 'de' 
                  ? 'Amazon Music unterstützt keine direkte Einbettung.' 
                  : language === 'en' 
                  ? 'Amazon Music does not support direct embedding.'
                  : 'Ang Amazon Music ay hindi sumusuporta sa direktang pag-embed.'}
              </p>
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {language === 'de' ? 'Auf Amazon Music anhören' : language === 'en' ? 'Listen on Amazon Music' : 'Makinig sa Amazon Music'}
              </a>
            </div>
          );
      }
    }

    // Default: Show show-level embed
    return renderShowLevelEmbed();
  };

  if (isLoading) {
    return (
      <section id="episodes" className="relative py-20">
        <div className="container px-4">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-12">
            <span className="text-gradient-secondary">{t('episodes.title')}</span>
          </h2>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="episodes" className="relative py-20">
        <div className="container px-4">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-12">
            <span className="text-gradient-secondary">{t('episodes.title')}</span>
          </h2>
          <div className="text-center text-muted-foreground py-20">
            {language === 'de' 
              ? 'Episoden konnten nicht geladen werden.' 
              : language === 'en' 
              ? 'Could not load episodes.' 
              : 'Hindi ma-load ang mga episode.'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="episodes" className="relative py-20">
      <div className="container px-4">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-12">
          <span className="text-gradient-secondary">{t('episodes.title')}</span>
        </h2>

        {/* Platform Selector */}
        <div className="mb-8 max-w-3xl mx-auto">
          <p className="text-center text-muted-foreground mb-4">{t('episodes.listen')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  setActivePlatform(platform.id);
                  setSelectedEpisode(null);
                }}
                className={`glass-card flex items-center gap-2 px-4 py-2 transition-all ${
                  activePlatform === platform.id 
                    ? 'border-primary/50 text-primary glow-primary' 
                    : 'hover:border-primary/30 hover:text-primary'
                }`}
              >
                <platform.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex justify-center gap-3">
            {filterButtons.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleToggleFilter(filter.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-secondary text-secondary-foreground glow-secondary'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {filter.label[language]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Embed */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="glass-card p-4 rounded-xl overflow-hidden">
            {renderEmbed()}
          </div>
        </div>

        {/* Episode Cards Carousel */}
        <div className="relative">
          {/* Navigation Arrows - Desktop */}
          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrevPage}
                disabled={carouselIndex === 0}
                className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border transition-all ${
                  carouselIndex === 0 
                    ? 'opacity-30 cursor-not-allowed' 
                    : 'hover:bg-primary/20 hover:border-primary/50 hover:text-primary'
                }`}
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={carouselIndex === totalPages - 1}
                className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border transition-all ${
                  carouselIndex === totalPages - 1 
                    ? 'opacity-30 cursor-not-allowed' 
                    : 'hover:bg-primary/20 hover:border-primary/50 hover:text-primary'
                }`}
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Episode Cards */}
          <div 
            ref={carouselRef}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {visibleEpisodes.map((episode, index) => {
              const actualIndex = filteredEpisodes.findIndex(e => e === episode);
              return (
                <article 
                  key={episode.id}
                  className={`glass-card p-6 transition-all group cursor-pointer ${
                    selectedEpisode === actualIndex 
                      ? 'border-primary/50 glow-primary' 
                      : 'hover:border-primary/30'
                  }`}
                  onClick={() => handlePlayEpisode(index)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-display font-bold text-muted-foreground/30">
                      #{episode.number}
                    </span>
                    <Badge 
                      variant={episode.type === 'quickie' ? 'secondary' : 'default'}
                      className={episode.type === 'quickie' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}
                    >
                      {episode.type === 'quickie' ? t('episodes.quickie') : t('episodes.full')}
                    </Badge>
                  </div>

                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {episode.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {episode.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(episode.date).toLocaleDateString(language === 'de' ? 'de-DE' : language === 'tl' ? 'fil-PH' : 'en-US')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {episode.duration}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex-1 ${
                        selectedEpisode === actualIndex 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-primary/10 hover:text-primary'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayEpisode(index);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {language === 'de' ? 'Abspielen' : language === 'en' ? 'Play' : 'I-play'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10 hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(episode);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    carouselIndex === idx 
                      ? 'bg-primary w-6' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Page ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Episodes;
