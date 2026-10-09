import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { showroomPages } from "@/lib/pages";
import { templates } from "@/lib/templates";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { MenuOverlay } from "./menu-overlay";

type Props = { lang: Locale; dict: Dictionary };

// Menu on the left, the wordmark in the middle, ordering on the right; it floats over the page.
export function Header({ lang, dict }: Props) {
  const links = [
    ...showroomPages.map((p) => ({ href: `/${lang}/${p.slug}`, label: dict.nav[p.nav] })),
    { href: `/${lang}/order`, label: dict.nav.order },
  ];

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-night/90 via-night/45 to-transparent"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto grid h-24 max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-10">
        <MenuOverlay
          lang={lang}
          links={links}
          templates={templates.map((t) => ({ id: t.id, name: t.name, scene: t.images.scene, line: dict.templates[t.id].bestFor }))}
          labels={{ menu: dict.nav.menu, close: dict.nav.close, language: dict.nav.language }}
        />
        <Link href={`/${lang}`} className="justify-self-center">
          <Logo />
        </Link>
        <div className="flex items-center justify-end gap-6">
          <div className="hidden md:block">
            <LanguageSwitcher lang={lang} label={dict.nav.language} />
          </div>
          <Link
            href={`/${lang}/order`}
            className="text-right font-heading text-xs font-medium uppercase leading-tight tracking-[0.2em] text-accent-soft hover:text-heading sm:text-sm"
          >
            {dict.nav.order}
          </Link>
        </div>
      </div>
    </header>
  );
}
