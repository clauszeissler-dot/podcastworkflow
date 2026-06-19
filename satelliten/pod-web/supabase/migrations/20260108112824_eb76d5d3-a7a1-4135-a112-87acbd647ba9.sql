-- Fix RLS Policy Configuration for newsletter_subscribers table
-- Issue: RESTRICTIVE policies without PERMISSIVE base create deny-by-default behavior
-- Solution: Change service role policies to PERMISSIVE, keep blocking policies RESTRICTIVE

-- Drop existing policies for newsletter_subscribers
DROP POLICY IF EXISTS "Block anonymous read access" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Service role can manage subscribers" ON public.newsletter_subscribers;

-- Create PERMISSIVE policy for service role (base access)
CREATE POLICY "Service role can manage subscribers"
ON public.newsletter_subscribers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create RESTRICTIVE policy to block anonymous SELECT (additional restriction)
CREATE POLICY "Block anonymous read access"
ON public.newsletter_subscribers
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- Fix RLS Policy Configuration for episode_sync_logs table
-- Drop existing policies
DROP POLICY IF EXISTS "Block anonymous read access" ON public.episode_sync_logs;
DROP POLICY IF EXISTS "Service role can manage sync logs" ON public.episode_sync_logs;

-- Create PERMISSIVE policy for service role (base access)
CREATE POLICY "Service role can manage sync logs"
ON public.episode_sync_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create RESTRICTIVE policy to block anonymous SELECT (additional restriction)
CREATE POLICY "Block anonymous read access"
ON public.episode_sync_logs
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- Fix RLS Policy Configuration for episodes table
-- Drop existing policies
DROP POLICY IF EXISTS "Episodes are publicly readable" ON public.episodes;
DROP POLICY IF EXISTS "Service role can manage episodes" ON public.episodes;

-- Create PERMISSIVE policy for public read access (base access for SELECT)
CREATE POLICY "Episodes are publicly readable"
ON public.episodes
FOR SELECT
TO anon, authenticated
USING (true);

-- Create PERMISSIVE policy for service role (full management)
CREATE POLICY "Service role can manage episodes"
ON public.episodes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);