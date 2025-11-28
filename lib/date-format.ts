/**
 * Date formatting utilities that automatically detect and use the user's locale
 * Falls back to the browser/system locale for appropriate date format
 */

/**
 * European country codes that use DD/MM/YYYY date format
 */
const EUROPEAN_COUNTRIES = [
  "DK", // Denmark
  "DE", // Germany
  "FR", // France
  "GB", // United Kingdom
  "IT", // Italy
  "ES", // Spain
  "NL", // Netherlands
  "BE", // Belgium
  "AT", // Austria
  "CH", // Switzerland
  "SE", // Sweden
  "NO", // Norway
  "FI", // Finland
  "PL", // Poland
  "PT", // Portugal
  "GR", // Greece
  "IE", // Ireland
  "CZ", // Czech Republic
  "HU", // Hungary
  "RO", // Romania
  "BG", // Bulgaria
  "HR", // Croatia
  "SK", // Slovakia
  "SI", // Slovenia
];

/**
 * Check if a locale code indicates a European country
 */
function isEuropeanLocale(locale: string): boolean {
  // Extract country code from locale (e.g., "da-DK" -> "DK")
  const parts = locale.split("-");
  const countryCode = parts.length > 1 ? parts[1].toUpperCase() : null;
  
  if (!countryCode) return false;
  
  return EUROPEAN_COUNTRIES.includes(countryCode);
}

/**
 * European timezones that use DD/MM/YYYY date format
 */
const EUROPEAN_TIMEZONES = [
  "Europe/", // All European timezones start with "Europe/"
  "Atlantic/Azores",
  "Atlantic/Canary",
  "Atlantic/Madeira",
];

/**
 * Check if timezone indicates a European location
 */
function isEuropeanTimezone(timezone: string): boolean {
  return EUROPEAN_TIMEZONES.some(tz => timezone.startsWith(tz));
}

/**
 * Get the user's locale, with fallback to default
 * Works in both client and server contexts
 * 
 * For European countries (like Denmark), detects and returns appropriate locale
 * Falls back to en-GB for European date format if locale can't be determined
 */
export function getUserLocale(): string {
  // Client-side: detect from browser
  if (typeof window !== "undefined") {
    let detectedLocale: string | null = null;
    let isEuropeanTZ = false;
    
    // Check timezone first - if user is in Europe, default to European format
    // This is more reliable than browser locale settings
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone && isEuropeanTimezone(timezone)) {
        isEuropeanTZ = true;
        // If timezone is Europe/Copenhagen, use Danish locale
        if (timezone === "Europe/Copenhagen") {
          return "da-DK"; // Return immediately for Denmark
        }
        // For other European timezones, we'll use en-GB as default
        // The locale detection below can override if it finds a better match
      }
    } catch {
      // Continue to locale detection
    }
    
    // Try to get locale from Intl API (most reliable)
    try {
      const locale = new Intl.DateTimeFormat().resolvedOptions().locale;
      if (locale) {
        detectedLocale = detectedLocale || locale;
      }
    } catch {
      // Continue to fallback
    }
    
    // Fallback to navigator.language
    if (!detectedLocale && navigator?.language) {
      detectedLocale = navigator.language;
    }
    
    // Fallback to navigator.languages (first preferred language)
    if (!detectedLocale && navigator?.languages && navigator.languages.length > 0) {
      detectedLocale = navigator.languages[0];
    }
    
    // If we detected a locale, check if it's US and user might be in Europe
    if (detectedLocale) {
      const lowerLocale = detectedLocale.toLowerCase();
      
      // If it's US locale (en-US), default to European format
      // This ensures users in Europe get European date format even if browser is set to US
      if (lowerLocale === "en-us" || lowerLocale.startsWith("en-us-")) {
        return "en-GB"; // Use European format even if browser is set to US
      }
      
      // If it's a European locale, use it as-is (e.g., da-DK for Denmark)
      if (isEuropeanLocale(detectedLocale)) {
        return detectedLocale;
      }
      
      // For other English locales that aren't US, check if they're European
      if (lowerLocale.startsWith("en-")) {
        const countryCode = detectedLocale.split("-")[1]?.toUpperCase();
        if (countryCode && EUROPEAN_COUNTRIES.includes(countryCode)) {
          return detectedLocale; // Use as-is (e.g., en-GB)
        }
        // Default other English locales to GB format
        return "en-GB";
      }
      
      // Check if locale language code matches Danish or other European languages
      const languageCode = detectedLocale.split("-")[0].toLowerCase();
      const europeanLanguages = ["da", "de", "fr", "it", "es", "nl", "sv", "no", "fi", "pl", "pt", "el", "cs", "hu", "ro", "bg", "hr", "sk", "sl"];
      if (europeanLanguages.includes(languageCode)) {
        // Likely a European locale, check if country code is missing and add default
        const parts = detectedLocale.split("-");
        if (parts.length === 1) {
          // Language only, add default country code for common European languages
          const defaults: Record<string, string> = {
            "da": "da-DK",
            "de": "de-DE",
            "fr": "fr-FR",
            "it": "it-IT",
            "es": "es-ES",
            "nl": "nl-NL",
            "sv": "sv-SE",
            "no": "no-NO",
            "fi": "fi-FI",
          };
          return defaults[languageCode] || detectedLocale;
        }
        return detectedLocale;
      }
      
      // If user is in European timezone, default to European format
      if (isEuropeanTZ) {
        return "en-GB";
      }
      
      // For other locales, default to European format as fallback
      // This ensures European users get European date format
      return "en-GB";
    }
    
    // If no locale detected but user is in European timezone, use European format
    if (isEuropeanTZ) {
      return "en-GB";
    }
  }

  // Server-side: default to en-GB (European format)
  // This is a safe default for international use
  return "en-GB";
}

/**
 * Format a date for display using the user's locale
 * Returns null if date is null/undefined
 */
export function formatDate(date: Date | null | undefined, locale?: string): string | null {
  if (!date) return null;
  const userLocale = locale ?? getUserLocale();
  return date.toLocaleDateString(userLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date for display in a long format (e.g., "1 January 2025" or "1. Januar 2025")
 */
export function formatDateLong(date: Date | null | undefined, locale?: string): string {
  if (!date) return "—";
  const userLocale = locale ?? getUserLocale();
  return date.toLocaleDateString(userLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date as a short date string using the user's locale format
 * (e.g., "01/01/2025" for US, "01/01/2025" for UK, "01.01.2025" for DE)
 */
export function formatDateShort(date: Date | null | undefined, locale?: string): string {
  if (!date) return "—";
  const userLocale = locale ?? getUserLocale();
  return date.toLocaleDateString(userLocale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

