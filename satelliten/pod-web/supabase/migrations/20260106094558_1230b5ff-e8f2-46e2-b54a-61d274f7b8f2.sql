-- Create episodes table for podcast episodes
CREATE TABLE public.episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_number TEXT NOT NULL,
  episode_type TEXT NOT NULL CHECK (episode_type IN ('full', 'quickie')),
  language TEXT NOT NULL CHECK (language IN ('de', 'en', 'tl')),
  title TEXT NOT NULL,
  description TEXT,
  publish_date DATE NOT NULL,
  duration TEXT,
  link_spotify TEXT,
  link_youtube TEXT,
  link_apple TEXT,
  link_amazon TEXT,
  rss_guid TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(episode_number, episode_type, language)
);

-- Enable Row Level Security
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (episodes are public content)
CREATE POLICY "Episodes are publicly readable"
ON public.episodes
FOR SELECT
USING (true);

-- Create policy for service role to manage episodes
CREATE POLICY "Service role can manage episodes"
ON public.episodes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_episodes_language ON public.episodes(language);
CREATE INDEX idx_episodes_publish_date ON public.episodes(publish_date DESC);
CREATE INDEX idx_episodes_type ON public.episodes(episode_type);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_episodes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_episodes_updated_at
BEFORE UPDATE ON public.episodes
FOR EACH ROW
EXECUTE FUNCTION public.update_episodes_updated_at();

-- Create sync_logs table to track synchronization
CREATE TABLE public.episode_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  episodes_added INTEGER DEFAULT 0,
  episodes_updated INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  error_message TEXT
);

-- Enable RLS for sync logs
ALTER TABLE public.episode_sync_logs ENABLE ROW LEVEL SECURITY;

-- Service role can manage sync logs
CREATE POLICY "Service role can manage sync logs"
ON public.episode_sync_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);