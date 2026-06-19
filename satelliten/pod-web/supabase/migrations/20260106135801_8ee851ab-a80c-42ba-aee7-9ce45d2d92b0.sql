-- Add columns for double opt-in to newsletter_subscribers
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS confirmation_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Update existing active subscribers to be confirmed (they already opted in)
UPDATE public.newsletter_subscribers 
SET confirmed_at = subscribed_at 
WHERE is_active = true AND confirmed_at IS NULL;

-- Create index for token lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_confirmation_token 
ON public.newsletter_subscribers(confirmation_token) 
WHERE confirmed_at IS NULL;