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
    
    // Try to get locale from Intl API (most reliable)
    try {
      const locale = new Intl.DateTimeFormat().resolvedOptions().locale;
      if (locale) {
        detectedLocale = locale;
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
      
      // For other locales, return them as-is
      return detectedLocale;
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

