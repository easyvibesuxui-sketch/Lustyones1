import Link from "next/link";
import { templates, type TemplateId } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { Logo } from "../logo";

type Props = { lang: Locale; current: TemplateId; t: Dictionary["demo"]["bar"]; view?: "site" | "admin" };

// Studio bar above a live demo: back to the showroom, switch template, switch between the fan site
// and the creator's admin, order.
export function DemoBar({ lang, current, t, view = "site" }: Props) {
  const path = (id: TemplateId, v = view) => `/${lang}/demo/${id}${v === "admin" ? "/admin" : ""}`;
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-night text-ink">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href={`/${lang}/templates`} className="flex shrink-0 items-center gap-2 rounded-sm text-sm text-muted hover:text-ink">
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
                  href={path(tpl.id)}
                  aria-current={tpl.id === current ? "page" : undefined}
                  className="block rounded-(--radius-control) px-3 py-1.5 text-sm text-muted hover:text-ink aria-[current=page]:bg-heading aria-[current=page]:text-night"
                >
                  {tpl.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 rounded-(--radius-control) border border-line p-0.5 text-xs">
          {(["site", "admin"] as const).map((v) => (
            <Link
              key={v}
              href={path(current, v)}
              aria-current={v === view ? "page" : undefined}
              className="rounded-[2px] px-2.5 py-1.5 text-muted hover:text-ink aria-[current=page]:bg-accent aria-[current=page]:font-semibold aria-[current=page]:text-night"
            >
              {v === "site" ? t.fanView : t.adminView}
            </Link>
          ))}
        </div>

        <Link
          href={`/${lang}/order?template=${current}`}
          className="hidden shrink-0 rounded-(--radius-control) bg-accent px-4 py-2 text-sm font-semibold text-night hover:bg-accent-soft md:inline-block"
        >
          {t.order}
        </Link>
      </div>
    </div>
  );
}
