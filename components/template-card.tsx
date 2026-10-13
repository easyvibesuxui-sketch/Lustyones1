import Link from "next/link";
import { DeviceDuo } from "./device-duo";
import { KeyIcon } from "./icons";
import { asset } from "@/lib/asset";
import { templates, type Template } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Props = { template: Template; dict: Dictionary; lang: Locale };

export function TemplateCard({ template, dict, lang }: Props) {
  const copy = dict.templates[template.id];
  const number = String(templates.findIndex((t) => t.id === template.id) + 1).padStart(2, "0");

  return (
    <article className="reveal group relative flex flex-col overflow-hidden border border-line bg-surface transition-colors duration-500 hover:border-accent/70">
      <div className="relative overflow-hidden px-8 pb-10 pt-14 sm:px-10">
        {template.images.backdrop && (
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 transition duration-700 group-hover:scale-100 group-hover:opacity-60"
            style={{ backgroundImage: `url(${asset(template.images.backdrop)})` }}
          />
        )}
        <span aria-hidden="true" className="numeral absolute right-6 top-4 text-6xl">
          {number}
        </span>
        <div className="relative">
          <DeviceDuo template={template} mock={dict.mock} planCopy={dict.demo.plans} lang={lang} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 border-t border-line p-8 sm:p-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-3xl font-bold uppercase leading-none tracking-wide text-heading">{template.name}</h2>
          <p className="shrink-0 font-heading text-xs uppercase tracking-[0.2em] text-muted">
            {dict.listing.from} <span className="text-accent-soft">{template.price}</span>
          </p>
        </div>
        <p className="font-body text-sm leading-relaxed text-ink/90 sm:text-base">{copy.description}</p>
        <p className="font-heading text-xs uppercase tracking-[0.25em] text-muted">
          {dict.listing.bestFor}: {copy.bestFor}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-10 gap-y-4 pt-8">
          <Link
            href={`/${lang}/demo/${template.id}`}
            className="group/link inline-flex items-center gap-3 border-b border-heading/70 pb-1.5 font-heading text-sm uppercase tracking-[0.2em] text-heading transition hover:border-accent hover:text-accent-soft"
          >
            {dict.listing.preview}
            <KeyIcon className="transition-transform group-hover/link:translate-x-1" />
          </Link>
          <Link
            href={`/${lang}/order?template=${template.id}`}
            className="font-heading text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent-soft"
          >
            {dict.listing.orderThis}
          </Link>
        </div>
      </div>
    </article>
  );
}
