"use client";

import { useState } from "react";
import { TemplateCard } from "./template-card";
import type { Mood, Template } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Filter = "all" | Mood;
type Props = { templates: Template[]; dict: Dictionary; lang: Locale };

export function TemplateGrid({ templates, dict, lang }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? templates : templates.filter((t) => t.mood === filter);
  const filters: Filter[] = ["all", "dark", "light"];

  return (
    <>
      <div role="group" aria-label={dict.listing.filterLabel} className="flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className="rounded-(--radius-control) border border-line px-5 py-2.5 font-heading text-xs uppercase tracking-[0.2em] text-muted hover:border-muted aria-pressed:border-heading aria-pressed:bg-heading aria-pressed:text-night"
          >
            {dict.listing.filters[f]}
          </button>
        ))}
      </div>
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:gap-14">
        {shown.map((t) => (
          <TemplateCard key={t.id} template={t} dict={dict} lang={lang} />
        ))}
      </div>
    </>
  );
}
