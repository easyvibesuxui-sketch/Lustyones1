import Link from "next/link";
import { DeviceDuo } from "./device-duo";
import type { Template } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Props = { template: Template; dict: Dictionary; lang: Locale };

export function TemplateCard({ template, dict, lang }: Props) {
  const copy = dict.templates[template.id];

  return (
    <article className="reveal group flex flex-col overflow-hidden rounded-(--radius-panel) border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_30px_80px_-30px_rgba(227,23,91,0.6)]">
      <div
        className="px-6 py-8"
        style={{ background: `linear-gradient(180deg, ${template.theme.tones[0]}55, transparent 70%)` }}
      >
        <DeviceDuo template={template} mock={dict.mock} planCopy={dict.demo.plans} lang={lang} />
      </div>
      <div className="flex flex-1 flex-col gap-3 border-t border-line p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold text-heading">{template.name}</h2>
          <p className="shrink-0 text-sm text-muted">
            {dict.listing.from} <span className="font-semibold text-ink">{template.price}</span>
          </p>
        </div>
        <p className="text-ink">{copy.description}</p>
        <p className="text-sm text-muted">
          {dict.listing.bestFor}: {copy.bestFor}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          <Link
            href={`/${lang}/order`}
            className="rounded-(--radius-control) bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent-deep"
          >
            {dict.listing.orderThis}
          </Link>
          <Link
            href={`/${lang}/demo/${template.id}`}
            className="rounded-(--radius-control) border border-heading/40 px-4 py-2.5 text-sm font-medium text-heading transition hover:-translate-y-0.5 hover:border-heading hover:bg-heading/10"
          >
            {dict.listing.preview}
          </Link>
        </div>
      </div>
    </article>
  );
}
