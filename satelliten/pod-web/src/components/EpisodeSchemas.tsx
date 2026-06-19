import { Helmet } from 'react-helmet-async';
import { useEpisodes, Episode } from '@/hooks/useEpisodes';
import { useState, useEffect } from 'react';

const BASE_URL = 'https://kiaffairs-podcast.de';

// Convert duration "12:30" or "2:15:30" to ISO 8601 format "PT12M30S" or "PT2H15M30S"
const toISO8601Duration = (duration: string): string => {
  if (!duration) return 'PT0M';
  
  const parts = duration.split(':').map(Number);
  
  if (parts.length === 3) {
    // Hours:Minutes:Seconds
    const [hours, minutes, seconds] = parts;
    return `PT${hours}H${minutes}M${seconds}S`;
  } else if (parts.length === 2) {
    // Minutes:Seconds
    const [minutes, seconds] = parts;
    return `PT${minutes}M${seconds}S`;
  }
  
  return 'PT0M';
};

const createEpisodeSchema = (episode: Episode) => ({
  '@context': 'https://schema.org',
  '@type': 'PodcastEpisode',
  '@id': `${BASE_URL}/#episode-${episode.id}`,
  name: episode.title,
  description: episode.description,
  datePublished: episode.date,
  duration: toISO8601Duration(episode.duration),
  episodeNumber: episode.number,
  partOfSeries: {
    '@id': `${BASE_URL}/#podcast`
  },
  author: {
    '@id': `${BASE_URL}/#claus-zeissler`
  },
  ...(episode.links.spotify || episode.links.youtube ? {
    associatedMedia: {
      '@type': 'MediaObject',
      contentUrl: episode.links.spotify || episode.links.youtube || episode.links.apple || ''
    }
  } : {})
});

const EpisodeSchemas = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const { data: episodes, isLoading } = useEpisodes();
  
  // Defer rendering until after main thread is idle
  useEffect(() => {
    const scheduleRender = window.requestIdleCallback
      ? () => window.requestIdleCallback(() => setShouldRender(true), { timeout: 2000 })
      : () => setTimeout(() => setShouldRender(true), 500);
    
    scheduleRender();
  }, []);
  
  // Don't render until idle callback fires
  if (!shouldRender || isLoading || !episodes || episodes.length === 0) {
    return null;
  }
  
  return (
    <Helmet>
      {episodes.map(episode => (
        <script key={episode.id} type="application/ld+json">
          {JSON.stringify(createEpisodeSchema(episode))}
        </script>
      ))}
    </Helmet>
  );
};

export default EpisodeSchemas;
