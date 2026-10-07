export const locales = ["en", "de", "es", "pt", "ru", "uk"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Set when the visitor picks a language by hand; it outranks location.
export const localeCookie = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  pt: "Português",
  ru: "Русский",
  uk: "Українська",
};

// ISO 3166 country code -> language shown to visitors from that country.
// Countries not listed fall back to the browser language, then English.
const countryLocales: Record<string, Locale> = {
  // German
  DE: "de", AT: "de", CH: "de", LI: "de", LU: "de",
  // Spanish
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es", PR: "es", GQ: "es",
  // Portuguese
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt", CV: "pt", GW: "pt", ST: "pt", TL: "pt",
  // Ukrainian
  UA: "uk",
  // Russian
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru", TJ: "ru",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function localeForCountry(country: string | null | undefined): Locale | undefined {
  return country ? countryLocales[country.toUpperCase()] : undefined;
}

// Picks the best supported locale from an Accept-Language header.
export function localeFromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return undefined;
}
