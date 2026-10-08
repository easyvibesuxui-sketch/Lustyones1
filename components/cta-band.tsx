import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { ArrowIcon } from "./icons";

type Props = { lang: Locale; dict: Dictionary };

// The closing call to order, at the foot of most pages.
export function CtaBand({ lang, dict }: Props) {
  return (
    <section className="reveal px-4 pb-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-(--radius-panel) bg-[linear-gradient(120deg,#b5163f,#d81e4f,#8a1d6e,#d81e4f)] bg-[length:300%_100%] px-6 py-14 text-white [animation:shimmer_14s_linear_infinite] sm:px-14 sm:py-20">
        <div aria-hidden="true" className="aurora -right-20 -top-24 size-80 bg-[#ffb3c7] opacity-30" />
        <h2 className="relative max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-6xl">{dict.order.title}</h2>
        <p className="relative mt-5 max-w-xl text-lg text-white/90">{dict.order.lead}</p>
        <div className="relative mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${lang}/order`}
            className="group inline-flex items-center justify-center gap-2 rounded-(--radius-control) bg-white px-6 py-3.5 font-semibold text-lipstick-deep transition hover:-translate-y-0.5 hover:bg-blush"
          >
            {dict.nav.order}
            <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={`/${lang}/templates`}
            className="inline-flex items-center justify-center rounded-(--radius-control) border border-white/60 px-6 py-3.5 font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            {dict.hero.primary}
          </Link>
        </div>
      </div>
    </section>
  );
}
