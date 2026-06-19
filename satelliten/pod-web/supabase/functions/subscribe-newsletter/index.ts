import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting store (in-memory, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Input validation
const VALID_LANGUAGES = ["de", "en", "tl"] as const;
type ValidLanguage = typeof VALID_LANGUAGES[number];

interface NewsletterRequest {
  name?: string;
  email: string;
  language: ValidLanguage;
  captchaToken?: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedData?: {
    name: string;
    email: string;
    language: ValidLanguage;
    captchaToken?: string;
  };
}

// hCaptcha verification function
async function verifyCaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  const secretKey = Deno.env.get("HCAPTCHA_SECRET_KEY");
  
  if (!secretKey) {
    console.error("HCAPTCHA_SECRET_KEY not configured");
    return { success: false, error: "CAPTCHA configuration error" };
  }

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `response=${encodeURIComponent(token)}&secret=${encodeURIComponent(secretKey)}`,
    });

    const data = await response.json();
    
    if (data.success === true) {
      return { success: true };
    } else {
      console.log("hCaptcha verification failed:", data["error-codes"]?.join(", ") || "unknown");
      return { success: false, error: "CAPTCHA verification failed" };
    }
  } catch (error) {
    console.error("Error verifying hCaptcha:", error);
    return { success: false, error: "CAPTCHA verification error" };
  }
}

function validateInput(data: unknown): ValidationResult {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const { name, email, language, captchaToken } = data as Record<string, unknown>;

  // Email validation
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  // RFC 5322 simplified email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: "Invalid email format" };
  }

  if (trimmedEmail.length > 255) {
    return { valid: false, error: "Email too long" };
  }

  // Name validation (optional)
  let sanitizedName = "";
  if (name !== undefined && name !== null) {
    if (typeof name !== "string") {
      return { valid: false, error: "Invalid name format" };
    }
    sanitizedName = name.trim().slice(0, 100);
    // Remove potential XSS characters
    sanitizedName = sanitizedName.replace(/[<>'"&]/g, "");
  }

  // Language validation
  const validatedLanguage = VALID_LANGUAGES.includes(language as ValidLanguage) 
    ? (language as ValidLanguage) 
    : "de";

  // Captcha token validation (optional string)
  let validatedCaptchaToken: string | undefined;
  if (captchaToken !== undefined && captchaToken !== null) {
    if (typeof captchaToken !== "string") {
      return { valid: false, error: "Invalid captcha token format" };
    }
    validatedCaptchaToken = captchaToken;
  }

  return {
    valid: true,
    sanitizedData: {
      name: sanitizedName,
      email: trimmedEmail,
      language: validatedLanguage,
      captchaToken: validatedCaptchaToken,
    },
  };
}

function checkRateLimit(clientIP: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(clientIP);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

function getClientIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
    || req.headers.get("x-real-ip") 
    || "unknown";
}

// Double Opt-In confirmation email content
const getConfirmationEmailContent = (name: string, language: string, confirmUrl: string) => {
  const greeting = name ? name : "";
  
  const content = {
    de: {
      subject: "🚀 Bestätige deine Anmeldung für KI AffAIrs",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 32px; margin: 0;">KI AffAIrs</h1>
            <p style="color: #888; font-size: 14px;">KI trifft Kultur – Technologie, die das Leben formt</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px;">Hallo${greeting ? ` ${greeting}` : ''},</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            vielen Dank für dein Interesse am Podcast von KI AffAIrs!
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Damit wir sicherstellen können, dass du dich selbst angemeldet hast und wir dir Updates zu KI-Tools, Automatisierung und Prozessen schicken dürfen, klicke bitte auf den folgenden Link:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Jetzt Anmeldung bestätigen</a>
          </div>
          <p style="color: #888888; line-height: 1.6; font-size: 14px; font-style: italic;">
            Falls du dich nicht angemeldet hast, kannst du diese E-Mail einfach ignorieren. Es werden dann keine Daten gespeichert.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px; margin-top: 30px;">
            Beste Grüße,<br>
            <strong style="color: #a855f7;">Claus Zeißler</strong><br>
            KI AffAIrs
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <a href="https://kiaffairs-podcast.de/#impressum" style="color: #888; text-decoration: underline;">Impressum</a> | 
            <a href="https://kiaffairs-podcast.de/#datenschutz" style="color: #888; text-decoration: underline;">Datenschutz</a>
          </p>
        </div>
      `,
    },
    en: {
      subject: "🚀 Confirm your subscription to AI AffAIrs",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 32px; margin: 0;">AI AffAIrs</h1>
            <p style="color: #888; font-size: 14px;">AI meets Culture – Technology that shapes life</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px;">Hello${greeting ? ` ${greeting}` : ''},</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Thank you for your interest in the AI AffAIrs podcast!
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            To ensure that you signed up yourself and that we can send you updates about AI tools, automation, and processes, please click the following link:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Confirm Subscription Now</a>
          </div>
          <p style="color: #888888; line-height: 1.6; font-size: 14px; font-style: italic;">
            If you did not sign up, you can simply ignore this email. No data will be stored.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px; margin-top: 30px;">
            Best regards,<br>
            <strong style="color: #a855f7;">Claus Zeißler</strong><br>
            AI AffAIrs
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <a href="https://kiaffairs-podcast.de/#impressum" style="color: #888; text-decoration: underline;">Legal Notice</a> | 
            <a href="https://kiaffairs-podcast.de/#datenschutz" style="color: #888; text-decoration: underline;">Privacy Policy</a>
          </p>
        </div>
      `,
    },
    tl: {
      subject: "🚀 Kumpirmahin ang iyong subscription sa AI AffAIrs",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 32px; margin: 0;">AI AffAIrs</h1>
            <p style="color: #888; font-size: 14px;">AI at Kultura – Teknolohiyang humuhubog sa buhay</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px;">Kumusta${greeting ? ` ${greeting}` : ''},</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Salamat sa iyong interes sa AI AffAIrs podcast!
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Para masigurado naming ikaw mismo ang nag-sign up at maaari kaming magpadala ng updates tungkol sa AI tools, automation, at processes, paki-click ang sumusunod na link:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Kumpirmahin ang Subscription</a>
          </div>
          <p style="color: #888888; line-height: 1.6; font-size: 14px; font-style: italic;">
            Kung hindi ka nag-sign up, maaari mong balewalain ang email na ito. Walang data ang ise-save.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px; margin-top: 30px;">
            Pinakamabuting pagbati,<br>
            <strong style="color: #a855f7;">Claus Zeißler</strong><br>
            AI AffAIrs
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <a href="https://kiaffairs-podcast.de/#impressum" style="color: #888; text-decoration: underline;">Legal Notice</a> | 
            <a href="https://kiaffairs-podcast.de/#datenschutz" style="color: #888; text-decoration: underline;">Privacy Policy</a>
          </p>
        </div>
      `,
    },
  };

  return content[language as keyof typeof content] || content.de;
};

// Welcome email after confirmation (with unsubscribe link)
const getWelcomeEmailContent = (name: string, language: string, unsubscribeUrl: string) => {
  const greeting = name ? name : "Newsletter-Abonnent";
  
  const unsubscribeText = {
    de: "Newsletter abbestellen",
    en: "Unsubscribe from newsletter",
    tl: "Mag-unsubscribe sa newsletter"
  };
  
  const content = {
    de: {
      subject: "Willkommen bei KI AffAIrs!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 32px; margin: 0;">KI AffAIrs</h1>
            <p style="color: #888; font-size: 14px;">KI trifft Kultur – Technologie, die das Leben formt</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px;">Hallo ${greeting}!</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Deine Anmeldung wurde erfolgreich bestätigt! 🎉
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Du erhältst ab jetzt regelmäßig Updates zu neuen Podcast-Folgen, spannenden Themen rund um Künstliche Intelligenz und exklusive Einblicke hinter die Kulissen.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Bleib neugierig!<br>
            <strong style="color: #a855f7;">Dein KI AffAIrs Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <a href="https://kiaffairs-podcast.de/#impressum" style="color: #888; text-decoration: underline;">Impressum</a> | 
            <a href="https://kiaffairs-podcast.de/#datenschutz" style="color: #888; text-decoration: underline;">Datenschutz</a> |
            <a href="${unsubscribeUrl}" style="color: #888; text-decoration: underline;">${unsubscribeText.de}</a>
          </p>
        </div>
      `,
    },
    en: {
      subject: "Welcome to AI AffAIrs!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 32px; margin: 0;">AI AffAIrs</h1>
            <p style="color: #888; font-size: 14px;">AI meets Culture – Technology that shapes life</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px;">Hello ${greeting}!</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Your subscription has been successfully confirmed! 🎉
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            From now on, you'll receive regular updates about new podcast episodes, exciting topics around Artificial Intelligence, and exclusive behind-the-scenes insights.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Stay curious!<br>
            <strong style="color: #a855f7;">Your AI AffAIrs Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <a href="https://kiaffairs-podcast.de/#impressum" style="color: #888; text-decoration: underline;">Legal Notice</a> | 
            <a href="https://kiaffairs-podcast.de/#datenschutz" style="color: #888; text-decoration: underline;">Privacy Policy</a> |
            <a href="${unsubscribeUrl}" style="color: #888; text-decoration: underline;">${unsubscribeText.en}</a>
          </p>
        </div>
      `,
    },
    tl: {
      subject: "Maligayang pagdating sa AI AffAIrs!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 32px; margin: 0;">AI AffAIrs</h1>
            <p style="color: #888; font-size: 14px;">AI at Kultura – Teknolohiyang humuhubog sa buhay</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px;">Kumusta ${greeting}!</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Matagumpay na nakumpirma ang iyong subscription! 🎉
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Mula ngayon, makakatanggap ka ng regular na updates tungkol sa mga bagong podcast episode, kapana-panabik na mga paksa tungkol sa Artificial Intelligence, at eksklusibong behind-the-scenes insights.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Manatiling curious!<br>
            <strong style="color: #a855f7;">Ang iyong AI AffAIrs Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <a href="https://kiaffairs-podcast.de/#impressum" style="color: #888; text-decoration: underline;">Legal Notice</a> | 
            <a href="https://kiaffairs-podcast.de/#datenschutz" style="color: #888; text-decoration: underline;">Privacy Policy</a> |
            <a href="${unsubscribeUrl}" style="color: #888; text-decoration: underline;">${unsubscribeText.tl}</a>
          </p>
        </div>
      `,
    },
  };

  return content[language as keyof typeof content] || content.de;
};

// Unsubscribe confirmation email
const getUnsubscribeEmailContent = (language: string) => {
  const content = {
    de: {
      subject: "Abmeldung bestätigt – KI AffAIrs Newsletter",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 32px; margin: 0;">KI AffAIrs</h1>
            <p style="color: #888; font-size: 14px;">KI trifft Kultur – Technologie, die das Leben formt</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px;">Schade, dass du gehst!</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Du wurdest erfolgreich vom KI AffAIrs Newsletter abgemeldet.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Du kannst dich jederzeit wieder anmelden unter <a href="https://kiaffairs-podcast.de/#newsletter" style="color: #a855f7;">kiaffairs-podcast.de</a>.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Alles Gute,<br>
            <strong style="color: #a855f7;">Dein KI AffAIrs Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <a href="https://kiaffairs-podcast.de/#impressum" style="color: #888; text-decoration: underline;">Impressum</a> | 
            <a href="https://kiaffairs-podcast.de/#datenschutz" style="color: #888; text-decoration: underline;">Datenschutz</a>
          </p>
        </div>
      `,
    },
    en: {
      subject: "Unsubscribe confirmed – AI AffAIrs Newsletter",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 32px; margin: 0;">AI AffAIrs</h1>
            <p style="color: #888; font-size: 14px;">AI meets Culture – Technology that shapes life</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px;">Sorry to see you go!</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            You have been successfully unsubscribed from the AI AffAIrs newsletter.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            You can resubscribe anytime at <a href="https://kiaffairs-podcast.de/#newsletter" style="color: #a855f7;">kiaffairs-podcast.de</a>.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Best wishes,<br>
            <strong style="color: #a855f7;">Your AI AffAIrs Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <a href="https://kiaffairs-podcast.de/#impressum" style="color: #888; text-decoration: underline;">Legal Notice</a> | 
            <a href="https://kiaffairs-podcast.de/#datenschutz" style="color: #888; text-decoration: underline;">Privacy Policy</a>
          </p>
        </div>
      `,
    },
    tl: {
      subject: "Nakumpirma ang pag-unsubscribe – AI AffAIrs Newsletter",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 32px; margin: 0;">AI AffAIrs</h1>
            <p style="color: #888; font-size: 14px;">AI at Kultura – Teknolohiyang humuhubog sa buhay</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px;">Nalulungkot kaming umalis ka!</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Matagumpay kang na-unsubscribe mula sa AI AffAIrs newsletter.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Maaari kang mag-resubscribe anumang oras sa <a href="https://kiaffairs-podcast.de/#newsletter" style="color: #a855f7;">kiaffairs-podcast.de</a>.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 16px;">
            Pinakamabuting pagbati,<br>
            <strong style="color: #a855f7;">Ang iyong AI AffAIrs Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <a href="https://kiaffairs-podcast.de/#impressum" style="color: #888; text-decoration: underline;">Legal Notice</a> | 
            <a href="https://kiaffairs-podcast.de/#datenschutz" style="color: #888; text-decoration: underline;">Privacy Policy</a>
          </p>
        </div>
      `,
    },
  };

  return content[language as keyof typeof content] || content.de;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Newsletter request received");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Handle confirmation (GET request with token)
    if (req.method === "GET" && url.searchParams.has("token")) {
      const token = url.searchParams.get("token");
      console.log("Processing confirmation request");

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Find subscriber by token
      const { data: subscriber, error: findError } = await supabase
        .from("newsletter_subscribers")
        .select("id, email, language, confirmed_at")
        .eq("confirmation_token", token)
        .single();

      if (findError || !subscriber) {
        console.log("Invalid or expired confirmation token");
        // Redirect to website with error
        return Response.redirect("https://kiaffairs-podcast.de/?confirmed=invalid", 302);
      }

      if (subscriber.confirmed_at) {
        console.log("Already confirmed");
        return Response.redirect("https://kiaffairs-podcast.de/?confirmed=already", 302);
      }

      // Confirm subscription
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ 
          confirmed_at: new Date().toISOString(),
          is_active: true
        })
        .eq("id", subscriber.id);

      if (updateError) {
        console.error("Error confirming subscription:", updateError.message);
        return Response.redirect("https://kiaffairs-podcast.de/?confirmed=error", 302);
      }

      // Build unsubscribe URL for welcome email
      const functionUrl = Deno.env.get("SUPABASE_URL") + "/functions/v1/subscribe-newsletter";
      const unsubscribeUrl = `${functionUrl}?unsubscribe=${token}`;

      // Send welcome email with unsubscribe link
      const welcomeContent = getWelcomeEmailContent("", subscriber.language, unsubscribeUrl);
      await resend.emails.send({
        from: "KI AffAIrs Newsletter <newsletter@kiaffairs-podcast.de>",
        to: [subscriber.email],
        subject: welcomeContent.subject,
        html: welcomeContent.html,
      });

      console.log("Subscription confirmed successfully");
      return Response.redirect("https://kiaffairs-podcast.de/?confirmed=success", 302);
    }

    // Handle unsubscribe (GET request with unsubscribe token)
    if (req.method === "GET" && url.searchParams.has("unsubscribe")) {
      const token = url.searchParams.get("unsubscribe");
      console.log("Processing unsubscribe request");

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Find subscriber by token
      const { data: subscriber, error: findError } = await supabase
        .from("newsletter_subscribers")
        .select("id, email, language, is_active")
        .eq("confirmation_token", token)
        .single();

      if (findError || !subscriber) {
        console.log("Invalid unsubscribe token");
        return Response.redirect("https://kiaffairs-podcast.de/?unsubscribed=invalid", 302);
      }

      if (!subscriber.is_active) {
        console.log("Already unsubscribed");
        return Response.redirect("https://kiaffairs-podcast.de/?unsubscribed=already", 302);
      }

      // Unsubscribe
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ 
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq("id", subscriber.id);

      if (updateError) {
        console.error("Error unsubscribing:", updateError.message);
        return Response.redirect("https://kiaffairs-podcast.de/?unsubscribed=error", 302);
      }

      // Send unsubscribe confirmation email
      const unsubscribeContent = getUnsubscribeEmailContent(subscriber.language);
      await resend.emails.send({
        from: "KI AffAIrs Newsletter <newsletter@kiaffairs-podcast.de>",
        to: [subscriber.email],
        subject: unsubscribeContent.subject,
        html: unsubscribeContent.html,
      });

      console.log("Unsubscribed successfully");
      return Response.redirect("https://kiaffairs-podcast.de/?unsubscribed=success", 302);
    }

    // Handle subscription (POST request)
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for IP`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            "Retry-After": String(rateLimitResult.retryAfter),
            ...corsHeaders 
          },
        }
      );
    }

    // Parse and validate input
    const rawData = await req.json();
    const validation = validateInput(rawData);

    if (!validation.valid || !validation.sanitizedData) {
      console.log(`Validation failed: ${validation.error}`);
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, language, captchaToken } = validation.sanitizedData;
    
    // Verify hCaptcha token (if provided)
    if (captchaToken) {
      const captchaResult = await verifyCaptcha(captchaToken);
      if (!captchaResult.success) {
        console.log("CAPTCHA verification failed");
        return new Response(
          JSON.stringify({ error: captchaResult.error || "CAPTCHA verification failed" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      console.log("CAPTCHA verified successfully");
    } else {
      // Check if hCaptcha is configured - if so, require token
      const hcaptchaSecretKey = Deno.env.get("HCAPTCHA_SECRET_KEY");
      if (hcaptchaSecretKey) {
        console.log("CAPTCHA token required but not provided");
        return new Response(
          JSON.stringify({ error: "CAPTCHA verification required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }
    
    // Log without exposing email
    console.log(`Processing subscription, language: ${language}`);

    // Initialize Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if subscriber already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active, confirmed_at, confirmation_token")
      .eq("email", email)
      .single();

    let confirmationToken: string;

    if (existingSubscriber) {
      if (existingSubscriber.is_active && existingSubscriber.confirmed_at) {
        console.log("Subscriber already exists and is confirmed");
        // Still return success - don't reveal subscription status
        return new Response(
          JSON.stringify({ success: true, message: "Please check your email to confirm your subscription." }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      } else {
        // Generate new token and update subscriber
        confirmationToken = crypto.randomUUID();
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({ 
            language: language,
            confirmation_token: confirmationToken,
            confirmed_at: null,
            is_active: false,
            unsubscribed_at: null 
          })
          .eq("id", existingSubscriber.id);

        if (updateError) {
          console.error("Error updating subscriber:", updateError.message);
          throw updateError;
        }
        console.log("Subscriber updated with new confirmation token");
      }
    } else {
      // Insert new subscriber (unconfirmed)
      confirmationToken = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: email,
          language: language,
          is_active: false,
          confirmation_token: confirmationToken,
          confirmed_at: null
        });

      if (insertError) {
        console.error("Error inserting subscriber:", insertError.message);
        throw insertError;
      }
      console.log("New subscriber added (pending confirmation)");
    }

    // Build confirmation URL
    const functionUrl = Deno.env.get("SUPABASE_URL") + "/functions/v1/subscribe-newsletter";
    const confirmUrl = `${functionUrl}?token=${confirmationToken}`;

    // Send confirmation email (Double Opt-In)
    const emailContent = getConfirmationEmailContent(name, language, confirmUrl);

    const emailResponse = await resend.emails.send({
      from: "KI AffAIrs Newsletter <newsletter@kiaffairs-podcast.de>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Double opt-in confirmation email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Please check your email to confirm your subscription." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in subscribe-newsletter function:", error.message);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
