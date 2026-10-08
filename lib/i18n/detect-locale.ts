import {
  defaultLocale,
  isLocale,
  localeForCountry,
  localeForTimeZone,
  localeFromAcceptLanguage,
  localeStorageKey,
  type Locale,
} from "./config";

// Free, keyless country-by-IP lookup. The visitor's IP is sent to this service.
const countryLookupUrl = "https://api.country.is/";
const lookupTimeoutMs = 1500;

async function countryByIp(): Promise<string | undefined> {
  try {
    const res = await fetch(countryLookupUrl, { signal: AbortSignal.timeout(lookupTimeoutMs) });
    if (!res.ok) return undefined;
    const data: { country?: string } = await res.json();
    return data.country;
  } catch {
    return undefined;
  }
}

function savedLocale(): string | null {
  try {
    return localStorage.getItem(localeStorageKey);
  } catch {
    return null;
  }
}

// Order: the visitor's own choice, then their country by IP, then time zone, then browser language.
export async function detectLocale(): Promise<Locale> {
  const saved = savedLocale();
  if (isLocale(saved)) return saved;
  return (
    localeForCountry(await countryByIp()) ??
    localeForTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone) ??
    localeFromAcceptLanguage(navigator.languages.join(",")) ??
    defaultLocale
  );
}

export function saveLocale(locale: Locale) {
  try {
    localStorage.setItem(localeStorageKey, locale);
  } catch {
    // Private mode or blocked storage: the choice just isn't remembered.
  }
}
