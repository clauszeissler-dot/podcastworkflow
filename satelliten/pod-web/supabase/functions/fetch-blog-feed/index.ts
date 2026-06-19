import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BLOG_FEEDS: Record<string, string | null> = {
  de: 'https://kiaffairs.blogspot.com/feeds/posts/default?alt=rss',
  en: null, // English blog not available yet
  tl: 'https://ai-affairsph.blogspot.com/feeds/posts/default',
};

interface BlogPost {
  id: string;
  title: string;
  published: string;
  content: string;
  link: string;
}

// Decode HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
}

// Strip HTML tags and get plain text
function stripHtml(html: string): string {
  // First decode entities, then strip tags
  const decoded = decodeHtmlEntities(html);
  return decoded
    .replace(/<[^>]*>/g, ' ')  // Replace tags with space
    .replace(/\s+/g, ' ')       // Normalize whitespace
    .trim();
}

function parseRSS(xmlText: string): BlogPost[] {
  const posts: BlogPost[] = [];
  
  // Try RSS format first (uses <item> tags)
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
  
  if (itemMatches.length > 0) {
    itemMatches.forEach((item, index) => {
      const getTagContent = (tag: string): string => {
        const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        if (match) {
          const content = match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
          return content.trim();
        }
        return '';
      };
      
      const title = decodeHtmlEntities(getTagContent('title'));
      const link = getTagContent('link');
      const pubDate = getTagContent('pubDate');
      const rawDescription = getTagContent('description');
      const content = stripHtml(rawDescription);
      const guid = getTagContent('guid') || `post-${index}`;
      
      posts.push({
        id: guid,
        title,
        published: pubDate,
        content,
        link,
      });
    });
  } else {
    // Try Atom format (uses <entry> tags) - used by Blogger default feeds
    const entryMatches = xmlText.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
    
    entryMatches.forEach((entry, index) => {
      const getTagContent = (tag: string): string => {
        const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        if (match) {
          const content = match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
          return content.trim();
        }
        return '';
      };
      
      // Get link from href attribute (Atom format)
      const getLinkHref = (): string => {
        const match = entry.match(/<link[^>]*rel=['"]alternate['"][^>]*href=['"]([^'"]+)['"]/);
        return match ? match[1] : '';
      };
      
      const title = decodeHtmlEntities(getTagContent('title'));
      const link = getLinkHref();
      const published = getTagContent('published') || getTagContent('updated');
      const rawContent = getTagContent('content') || getTagContent('summary');
      const content = stripHtml(rawContent);
      const id = getTagContent('id') || `post-${index}`;
      
      posts.push({
        id,
        title,
        published,
        content,
        link,
      });
    });
  }
  
  return posts;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { language } = await req.json();
    
    if (!language || !['de', 'en', 'tl'].includes(language)) {
      return new Response(
        JSON.stringify({ error: 'Invalid language parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const feedUrl = BLOG_FEEDS[language];

    // No blog available for this language
    if (!feedUrl) {
      return new Response(
        JSON.stringify({ posts: [], status: 'not_available' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching blog feed for language: ${language} from ${feedUrl}`);
    
    const response = await fetch(feedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    const posts = parseRSS(xmlText);
    
    console.log(`Successfully parsed ${posts.length} posts for ${language}`);

    return new Response(
      JSON.stringify({ posts, status: 'success' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching blog feed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage, posts: [], status: 'error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
