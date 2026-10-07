import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  de: () => import("./dictionaries/de").then((m) => m.default),
  es: () => import("./dictionaries/es").then((m) => m.default),
  pt: () => import("./dictionaries/pt").then((m) => m.default),
  ru: () => import("./dictionaries/ru").then((m) => m.default),
  uk: () => import("./dictionaries/uk").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
export type { Dictionary };
