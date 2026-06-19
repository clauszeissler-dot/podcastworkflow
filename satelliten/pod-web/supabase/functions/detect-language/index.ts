import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// DACH region + German-speaking countries
const GERMAN_COUNTRIES = ['DE', 'AT', 'CH', 'LI', 'LU'];

// Philippines and regions where Tagalog/Filipino is spoken
const FILIPINO_COUNTRIES = ['PH'];

function getClientIP(request: Request): string | null {
  // Try various headers that might contain the real IP
  const headers = [
    'cf-connecting-ip',     // Cloudflare
    'x-real-ip',            // Nginx
    'x-forwarded-for',      // Standard proxy header
    'x-client-ip',
    'true-client-ip',       // Akamai
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim();
      if (ip && ip !== '127.0.0.1' && ip !== '::1') {
        return ip;
      }
    }
  }

  return null;
}

async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    // Using ipapi.co - free tier: 1000 requests/day
    const response = await fetch(`https://ipapi.co/${ip}/country/`, {
      headers: {
        'User-Agent': 'KI-Affairs-Podcast/1.0',
      },
    });

    if (!response.ok) {
      console.error(`ipapi.co error: ${response.status}`);
      return null;
    }

    const countryCode = await response.text();
    
    // ipapi.co returns the country code directly as text
    // Check if it's a valid 2-letter country code
    if (countryCode && countryCode.length === 2 && /^[A-Z]{2}$/.test(countryCode)) {
      return countryCode;
    }

    return null;
  } catch (error) {
    console.error('Geolocation error:', error);
    return null;
  }
}

function mapCountryToLanguage(countryCode: string | null): 'de' | 'en' | 'tl' {
  if (!countryCode) {
    return 'en'; // Default to English if we can't determine the country
  }

  const upperCode = countryCode.toUpperCase();

  if (GERMAN_COUNTRIES.includes(upperCode)) {
    return 'de';
  }

  if (FILIPINO_COUNTRIES.includes(upperCode)) {
    return 'tl';
  }

  return 'en';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = getClientIP(req);
    
    console.log(`Detecting language for IP: ${clientIP ? clientIP.substring(0, 8) + '***' : 'unknown'}`);

    let countryCode: string | null = null;
    
    if (clientIP) {
      countryCode = await getCountryFromIP(clientIP);
      console.log(`Country detected: ${countryCode || 'unknown'}`);
    }

    const detectedLanguage = mapCountryToLanguage(countryCode);

    return new Response(
      JSON.stringify({
        language: detectedLanguage,
        country: countryCode,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in detect-language:', error);
    
    // Return English as fallback on any error
    return new Response(
      JSON.stringify({
        language: 'en',
        country: null,
        error: 'Detection failed, using default',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
