-- Block anonymous read access for newsletter_subscribers
CREATE POLICY "Block anonymous read access"
ON public.newsletter_subscribers
FOR SELECT
TO anon
USING (false);

-- Block anonymous read access for episode_sync_logs
CREATE POLICY "Block anonymous read access"
ON public.episode_sync_logs
FOR SELECT
TO anon
USING (false);