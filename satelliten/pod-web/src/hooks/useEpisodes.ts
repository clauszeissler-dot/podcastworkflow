import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export interface DatabaseEpisode {
  id: string;
  episode_number: string;
  episode_type: 'full' | 'quickie';
  title: string;
  description: string | null;
  publish_date: string;
  duration: string | null;
  link_spotify: string | null;
  link_youtube: string | null;
  link_apple: string | null;
  link_amazon: string | null;
  language: string;
}

export interface Episode {
  id: string;
  number: string;
  type: 'full' | 'quickie';
  title: string;
  description: string;
  date: string;
  duration: string;
  links: {
    spotify: string;
    youtube: string;
    apple: string;
    amazon: string;
  };
}

// Helper to extract Spotify episode ID from various URL formats
export const extractSpotifyId = (url: string): string => {
  if (!url) return '';
  // Handle anchor.fm play links - extract the episode ID from the path
  const anchorMatch = url.match(/anchor\.fm\/s\/[^\/]+\/podcast\/play\/(\d+)/);
  if (anchorMatch) {
    // For anchor.fm URLs, we can't easily get Spotify embed ID
    // Return empty to trigger show-level embed
    return '';
  }
  // Handle open.spotify.com/episode/ID format
  const spotifyMatch = url.replace(/\\/g, '').match(/episode\/([a-zA-Z0-9]+)/);
  return spotifyMatch ? spotifyMatch[1] : '';
};

// Helper to extract YouTube video ID from various URL formats
export const extractYoutubeId = (url: string): string => {
  if (!url) return '';
  // Handle youtu.be/ID format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];
  
  // Handle youtube.com/watch?v=ID format
  const longMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (longMatch) return longMatch[1];
  
  // Handle escaped backslashes
  const cleanUrl = url.replace(/\\/g, '');
  const cleanShortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (cleanShortMatch) return cleanShortMatch[1];
  
  return '';
};

const transformDatabaseEpisode = (dbEpisode: DatabaseEpisode): Episode => ({
  id: dbEpisode.id,
  number: dbEpisode.episode_number,
  type: dbEpisode.episode_type,
  title: dbEpisode.title,
  description: dbEpisode.description || '',
  date: dbEpisode.publish_date,
  duration: dbEpisode.duration || '',
  links: {
    spotify: dbEpisode.link_spotify || '',
    youtube: dbEpisode.link_youtube || '',
    apple: dbEpisode.link_apple || '',
    amazon: dbEpisode.link_amazon || '',
  },
});

export const useEpisodes = () => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['episodes', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('language', language)
        .order('publish_date', { ascending: false });

      if (error) {
        console.error('Error fetching episodes:', error);
        throw error;
      }

      return (data as DatabaseEpisode[]).map(transformDatabaseEpisode);
    },
    // Defer initial fetch to reduce critical request chain
    // Episodes component is lazy-loaded anyway, so this helps ensure
    // the fetch doesn't start until the component is actually visible
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
};
