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
      <div role="group" aria-label={dict.listing.filterLabel} className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className="rounded-(--radius-control) border border-plum-line px-4 py-2 text-sm text-haze hover:border-haze aria-pressed:border-blush aria-pressed:bg-blush aria-pressed:text-aubergine"
          >
            {dict.listing.filters[f]}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {shown.map((t) => (
          <TemplateCard key={t.id} template={t} dict={dict} lang={lang} />
        ))}
      </div>
    </>
  );
}
