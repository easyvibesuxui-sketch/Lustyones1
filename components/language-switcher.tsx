"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeCookie, localeNames, locales, type Locale } from "@/lib/i18n/config";

type Props = { lang: Locale; label: string };

export function LanguageSwitcher({ lang, label }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function change(next: Locale) {
    // Remember the choice for a year so location detection doesn't override it.
    document.cookie = `${localeCookie}=${next}; path=/; max-age=31536000; samesite=lax`;
    const rest = pathname.replace(/^\/[^/]+/, "");
    router.push(`/${next}${rest}${window.location.hash}`);
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={lang}
        onChange={(e) => change(e.target.value as Locale)}
        className="cursor-pointer appearance-none rounded-(--radius-control) border border-plum-line bg-transparent py-2 pl-3 pr-8 text-sm text-ink hover:border-haze"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-plum text-ink">
            {localeNames[l]}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 20 20"
        width="14"
        height="14"
        aria-hidden="true"
        className="pointer-events-none absolute right-3 text-haze"
        fill="currentColor"
      >
        <path d="M5 7l5 6 5-6z" />
      </svg>
    </label>
  );
}
