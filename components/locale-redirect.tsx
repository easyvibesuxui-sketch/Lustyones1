"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { localeNames, locales } from "@/lib/i18n/config";
import { detectLocale } from "@/lib/i18n/detect-locale";

// Sends a visitor on a language-less path (/, /templates) to the same path in their language.
export function LocaleRedirect({ path }: { path: string }) {
  const router = useRouter();

  useEffect(() => {
    detectLocale().then((locale) => router.replace(`/${locale}${path}`));
  }, [router, path]);

  // Shown for a moment while detecting, and as the whole page without JavaScript.
  return (
    <ul className="flex flex-wrap justify-center gap-2 p-8">
      {locales.map((l) => (
        <li key={l}>
          <Link href={`/${l}${path}`} className="rounded-(--radius-control) border border-line px-4 py-2 text-sm text-muted hover:text-ink">
            {localeNames[l]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
