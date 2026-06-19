import type { Language } from "@/contexts/LanguageContext";

// IMPORTANT: keep header/footer logo extremely small to avoid impacting LCP.
// This file uses properly sized small icon for 32x32 display.
import aiBrandLogo from "@/assets/brand-ai-affairs-icon-small.webp";

export const getBranding = (language: Language) => {
  const isGerman = language === "de";

  return {
    name: isGerman ? "KI AffAIrs" : "AI AffAIrs",
    logoSrc: aiBrandLogo,
    faviconHref: isGerman ? "/favicon-ki.png" : "/favicon-ai.png",
  };
};
