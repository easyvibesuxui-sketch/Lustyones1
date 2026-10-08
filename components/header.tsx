import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { showroomPages } from "@/lib/pages";
import { LanguageSwitcher } from "./language-switcher";
import { NavLinks } from "./nav-links";
import { Logo } from "./logo";

type Props = { lang: Locale; dict: Dictionary };

export function Header({ lang, dict }: Props) {
  const links = showroomPages.map((p) => ({ href: `/${lang}/${p.slug}`, label: dict.nav[p.nav] }));

  return (
    <header
      className="sticky top-0 z-40 border-b border-line/60 bg-night/85 backdrop-blur"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={`/${lang}`} className="shrink-0 rounded-sm">
          <Logo />
        </Link>

        <nav aria-label={dict.nav.menu} className="hidden flex-1 lg:block">
          <NavLinks links={links} variant="bar" />
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher lang={lang} label={dict.nav.language} />
          <Link
            href={`/${lang}/order`}
            className="hidden rounded-(--radius-control) bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(227,23,91,0.8)] transition hover:-translate-y-0.5 hover:bg-accent-deep sm:inline-block"
          >
            {dict.nav.order}
          </Link>

          <details className="group relative lg:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-line [&::-webkit-details-marker]:hidden">
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
              className="absolute right-0 top-12 w-56 rounded-2xl border border-line bg-surface p-2 shadow-2xl"
            >
              <NavLinks links={[...links, { href: `/${lang}/order`, label: dict.nav.order }]} variant="menu" />
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
