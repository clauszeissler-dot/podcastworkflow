import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// RSS Feed URLs for each language
const RSS_FEEDS: Record<string, string> = {
  de: 'https://anchor.fm/s/10aee9a34/podcast/rss',
  en: 'https://anchor.fm/s/10b038868/podcast/rss',
  tl: 'https://anchor.fm/s/10b02f0d8/podcast/rss',
};

interface RSSItem {
  guid: string;
  title: string;
  description: string;
  pubDate: string;
  duration: string;
  spotifyLink: string;
  appleLink: string;
  youtubeLink: string;
  amazonLink: string;
}

// Parse RSS XML to extract episodes
function parseRSS(xmlText: string): RSSItem[] {
  const items: RSSItem[] = [];
  
  // Match all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    
    // Extract fields from item
    const guid = extractTag(itemContent, 'guid') || '';
    const title = extractTag(itemContent, 'title') || '';
    const description = cleanDescription(extractTag(itemContent, 'description') || extractTag(itemContent, 'itunes:summary') || '');
    const pubDate = extractTag(itemContent, 'pubDate') || '';
    const duration = extractTag(itemContent, 'itunes:duration') || '';
    
    // Extract enclosure URL (main audio link)
    const enclosureMatch = itemContent.match(/<enclosure[^>]*url="([^"]+)"/);
    const spotifyLink = enclosureMatch ? enclosureMatch[1] : '';
    
    // Extract link (usually Apple Podcasts or main link)
    const link = extractTag(itemContent, 'link') || '';
    
    items.push({
      guid,
      title,
      description,
      pubDate,
      duration,
      spotifyLink,
      appleLink: link.includes('apple') ? link : '',
      youtubeLink: '',
      amazonLink: '',
    });
  }
  
  return items;
}

function extractTag(content: string, tagName: string): string {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`, 'i');
  const cdataMatch = content.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();
  
  // Handle regular tags
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function cleanDescription(desc: string): string {
  // Remove HTML tags and decode entities
  return desc
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

// Determine episode type and number from title
function parseEpisodeInfo(title: string): { number: string; type: 'full' | 'quickie' } {
  // Match episode number pattern like "001", "002", etc.
  const numberMatch = title.match(/^(\d{3})/);
  const number = numberMatch ? numberMatch[1] : '000';
  
  // Check if it's a quickie
  const isQuickie = /quicky|quickie/i.test(title);
  
  return {
    number,
    type: isQuickie ? 'quickie' : 'full',
  };
}

// Format duration from seconds or HH:MM:SS to MM:SS format
function formatDuration(duration: string): string {
  if (!duration) return '';
  
  // If already in MM:SS or HH:MM:SS format
  if (duration.includes(':')) {
    const parts = duration.split(':');
    if (parts.length === 3) {
      // HH:MM:SS -> convert to total minutes:seconds
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      const totalMinutes = hours * 60 + minutes;
      return `${totalMinutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return duration;
  }
  
  // If in seconds
  const totalSeconds = parseInt(duration, 10);
  if (isNaN(totalSeconds)) return duration;
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body for optional language filter
    let targetLanguage: string | null = null;
    try {
      const body = await req.json();
      targetLanguage = body.language || null;
    } catch {
      // No body or invalid JSON, sync all languages
    }
    
    const languagesToSync = targetLanguage ? [targetLanguage] : ['de', 'en', 'tl'];
    const results: Record<string, { added: number; updated: number; error?: string }> = {};
    
    for (const lang of languagesToSync) {
      const feedUrl = RSS_FEEDS[lang];
      if (!feedUrl) {
        results[lang] = { added: 0, updated: 0, error: 'Unknown language' };
        continue;
      }
      
      console.log(`Fetching RSS feed for ${lang}: ${feedUrl}`);
      
      try {
        const response = await fetch(feedUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const xmlText = await response.text();
        const rssItems = parseRSS(xmlText);
        
        console.log(`Found ${rssItems.length} episodes for ${lang}`);
        
        let added = 0;
        let updated = 0;
        
        for (const item of rssItems) {
          const { number, type } = parseEpisodeInfo(item.title);
          const publishDate = new Date(item.pubDate).toISOString().split('T')[0];
          
          // Check if episode already exists
          const { data: existing } = await supabase
            .from('episodes')
            .select('id')
            .eq('rss_guid', item.guid)
            .maybeSingle();
          
          const episodeData = {
            episode_number: number,
            episode_type: type,
            language: lang,
            title: item.title,
            description: item.description,
            publish_date: publishDate,
            duration: formatDuration(item.duration),
            link_spotify: item.spotifyLink || null,
            link_apple: item.appleLink || null,
            link_youtube: item.youtubeLink || null,
            link_amazon: item.amazonLink || null,
            rss_guid: item.guid,
          };
          
          if (existing) {
            // Update existing episode
            const { error } = await supabase
              .from('episodes')
              .update(episodeData)
              .eq('id', existing.id);
            
            if (!error) updated++;
          } else {
            // Insert new episode
            const { error } = await supabase
              .from('episodes')
              .insert(episodeData);
            
            if (!error) added++;
            else console.error(`Error inserting episode: ${error.message}`);
          }
        }
        
        results[lang] = { added, updated };
        
        // Log sync result
        await supabase.from('episode_sync_logs').insert({
          language: lang,
          episodes_added: added,
          episodes_updated: updated,
          status: 'success',
        });
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error syncing ${lang}:`, errorMessage);
        results[lang] = { added: 0, updated: 0, error: errorMessage };
        
        // Log error
        await supabase.from('episode_sync_logs').insert({
          language: lang,
          status: 'error',
          error_message: errorMessage,
        });
      }
    }
    
    console.log('Sync completed:', results);
    
    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Sync error:', errorMessage);
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
