import Link from "next/link";
import { templates, type TemplateId } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { Logo } from "../logo";

type Props = { lang: Locale; current: TemplateId; t: Dictionary["demo"]["bar"] };

// Studio bar above a live demo: back to the showroom, switch template, order.
export function DemoBar({ lang, current, t }: Props) {
  return (
    <div className="sticky top-0 z-40 border-b border-plum-line bg-aubergine text-ink">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href={`/${lang}/templates`} className="flex shrink-0 items-center gap-2 rounded-sm text-sm text-haze hover:text-ink">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="currentColor">
            <path d="M12.6 4.4 7 10l5.6 5.6 1.1-1.1L9.2 10l4.5-4.5z" />
          </svg>
          <span className="hidden sm:inline">
            <Logo />
          </span>
          <span className="sm:hidden">{t.back}</span>
        </Link>

        <nav aria-label={t.switchLabel} className="mx-auto min-w-0 overflow-x-auto">
          <ul className="flex gap-1">
            {templates.map((tpl) => (
              <li key={tpl.id}>
                <Link
                  href={`/${lang}/demo/${tpl.id}`}
                  aria-current={tpl.id === current ? "page" : undefined}
                  className="block rounded-(--radius-control) px-3 py-1.5 text-sm text-haze hover:text-ink aria-[current=page]:bg-blush aria-[current=page]:text-aubergine"
                >
                  {tpl.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href={`/${lang}/order`}
          className="hidden shrink-0 rounded-(--radius-control) bg-lipstick px-4 py-2 text-sm font-semibold text-white hover:bg-lipstick-deep md:inline-block"
        >
          {t.order}
        </Link>
      </div>
    </div>
  );
}
