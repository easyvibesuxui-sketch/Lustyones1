"use client";

import { useState } from "react";
import { DeviceDuo } from "./device-duo";
import type { Template } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  template: Template;
  mock: Dictionary["mock"];
  planCopy: Dictionary["demo"]["plans"];
  lang: Locale;
  labels: { unlock: string; relock: string };
};

// The hero's one interactive moment: the locked feed clears on demand.
export function UnlockDemo({ template, mock, planCopy, lang, labels }: Props) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="w-full">
        <DeviceDuo template={template} mock={mock} planCopy={planCopy} lang={lang} unlocked={unlocked} />
      </div>
      <button
        type="button"
        onClick={() => setUnlocked((u) => !u)}
        aria-pressed={unlocked}
        className="rounded-(--radius-control) border border-blush/40 px-5 py-2.5 text-sm font-medium text-blush transition-colors hover:border-blush hover:bg-blush/10"
      >
        {unlocked ? labels.relock : labels.unlock}
      </button>
    </div>
  );
}
