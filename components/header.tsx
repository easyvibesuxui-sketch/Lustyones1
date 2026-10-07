import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

type Props = { lang: Locale; dict: Dictionary };

export function Header({ lang, dict }: Props) {
  const links = [
    { href: `/${lang}/templates`, label: dict.nav.templates },
    { href: `/${lang}#how`, label: dict.nav.how },
    { href: `/${lang}#admin`, label: dict.nav.admin },
    { href: `/${lang}#pricing`, label: dict.nav.pricing },
    { href: `/${lang}#faq`, label: dict.nav.faq },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-plum-line/60 bg-aubergine/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={`/${lang}`} className="shrink-0 rounded-sm">
          <Logo />
        </Link>

        <nav aria-label={dict.nav.menu} className="hidden flex-1 lg:block">
          <ul className="flex gap-6 text-sm text-haze">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-sm hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher lang={lang} label={dict.nav.language} />
          <Link
            href={`/${lang}#order`}
            className="hidden rounded-(--radius-control) bg-lipstick px-4 py-2 text-sm font-semibold text-white hover:bg-lipstick-deep sm:inline-block"
          >
            {dict.nav.order}
          </Link>

          <details className="group relative lg:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-plum-line [&::-webkit-details-marker]:hidden">
              <span className="sr-only">{dict.nav.menu}</span>
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="group-open:hidden" fill="currentColor">
                <path d="M3 6h14v1.5H3zM3 12.5h14V14H3z" />
              </svg>
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="hidden group-open:block" fill="currentColor">
                <path d="M5.1 4 4 5.1 8.9 10 4 14.9 5.1 16l4.9-4.9 4.9 4.9 1.1-1.1-4.9-4.9L16 5.1 14.9 4 10 8.9z" />
              </svg>
            </summary>
            <nav
              aria-label={dict.nav.menu}
              className="absolute right-0 top-12 w-56 rounded-2xl border border-plum-line bg-plum p-2 shadow-2xl"
            >
              <ul className="flex flex-col">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded-xl px-3 py-2.5 text-ink hover:bg-aubergine">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/${lang}#order`}
                    className="mt-1 block rounded-xl bg-lipstick px-3 py-2.5 font-semibold text-white hover:bg-lipstick-deep"
                  >
                    {dict.nav.order}
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
