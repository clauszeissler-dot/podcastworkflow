-- Enable required extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule daily sync at 10:15 UTC (right after Monday/Thursday releases at 10:00)
SELECT cron.schedule(
  'sync-podcast-episodes-daily',
  '15 10 * * *',
  $$
  SELECT net.http_post(
    url := 'https://wmxnsjbkfmbavpuowqhx.supabase.co/functions/v1/sync-podcast-episodes',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);