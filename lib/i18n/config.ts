export const locales = ["en", "de", "es", "pt", "ru", "uk"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// localStorage key set when the visitor picks a language by hand; it outranks location.
export const localeStorageKey = "locale";

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

// Time zone -> language, used when the IP lookup is unavailable.
const timeZoneLocales: Record<string, Locale> = {
  "Europe/Berlin": "de", "Europe/Vienna": "de", "Europe/Zurich": "de", "Europe/Busingen": "de",
  "Europe/Vaduz": "de", "Europe/Luxembourg": "de",
  "Europe/Madrid": "es", "Atlantic/Canary": "es", "Africa/Ceuta": "es", "America/Mexico_City": "es",
  "America/Monterrey": "es", "America/Tijuana": "es", "America/Cancun": "es", "America/Bogota": "es",
  "America/Lima": "es", "America/Santiago": "es", "America/Caracas": "es", "America/Montevideo": "es",
  "America/Asuncion": "es", "America/La_Paz": "es", "America/Guayaquil": "es", "America/Guatemala": "es",
  "America/Havana": "es", "America/Santo_Domingo": "es", "America/Tegucigalpa": "es",
  "America/El_Salvador": "es", "America/Managua": "es", "America/Costa_Rica": "es", "America/Panama": "es",
  "America/Puerto_Rico": "es",
  "Europe/Lisbon": "pt", "Atlantic/Azores": "pt", "Atlantic/Madeira": "pt", "America/Sao_Paulo": "pt",
  "America/Bahia": "pt", "America/Fortaleza": "pt", "America/Recife": "pt", "America/Manaus": "pt",
  "America/Belem": "pt", "America/Cuiaba": "pt", "America/Campo_Grande": "pt", "America/Porto_Velho": "pt",
  "America/Boa_Vista": "pt", "America/Rio_Branco": "pt", "America/Araguaina": "pt", "America/Maceio": "pt",
  "America/Santarem": "pt", "America/Noronha": "pt", "Africa/Luanda": "pt", "Africa/Maputo": "pt",
  "Europe/Kyiv": "uk", "Europe/Kiev": "uk", "Europe/Uzhgorod": "uk", "Europe/Zaporozhye": "uk",
  "Europe/Moscow": "ru", "Europe/Minsk": "ru", "Europe/Samara": "ru", "Europe/Volgograd": "ru",
  "Asia/Yekaterinburg": "ru", "Asia/Novosibirsk": "ru", "Asia/Krasnoyarsk": "ru", "Asia/Irkutsk": "ru",
  "Asia/Vladivostok": "ru", "Asia/Almaty": "ru", "Asia/Bishkek": "ru", "Asia/Dushanbe": "ru",
};

export function localeForTimeZone(timeZone: string | undefined): Locale | undefined {
  if (!timeZone) return undefined;
  if (timeZone.startsWith("America/Argentina/")) return "es";
  return timeZoneLocales[timeZone];
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
