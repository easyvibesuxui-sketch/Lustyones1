import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";

// Title and language alternates for an inner showroom page, e.g. slug "pricing".
export function pageMetadata(lang: Locale, slug: string, title: string): Metadata {
  return {
    title: `${title} — ${site.name}`,
    alternates: {
      canonical: `/${lang}/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/${slug}`])),
    },
  };
}
