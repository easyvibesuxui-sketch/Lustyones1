import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { keyLink, primaryButton } from "@/lib/ui";
import { KeyIcon } from "./icons";
import { KeyholeOutline } from "./keyhole-outline";
import { Backdrop } from "./page-shell";

type Props = { lang: Locale; dict: Dictionary };

// The closing call to order, at the foot of most pages.
export function CtaBand({ lang, dict }: Props) {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <Backdrop src="/showroom/intro-bg.webp" />
      <div className="reveal relative mx-auto flex max-w-3xl flex-col items-center px-5 py-36 text-center sm:px-10 sm:py-48">
        <KeyholeOutline className="h-16 w-11 text-accent-soft" />
        <h2 className="mt-12 font-heading text-3xl font-bold uppercase leading-[1] text-heading hyphens-auto break-words sm:text-5xl">
          {dict.order.title}
        </h2>
        <p className="mt-7 max-w-md font-body text-base leading-relaxed text-ink/90">{dict.order.lead}</p>
        <div className="mt-12 flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
          <Link href={`/${lang}/order`} className={primaryButton}>
            {dict.nav.order}
          </Link>
          <Link href={`/${lang}/templates`} className={keyLink}>
            {dict.hero.primary}
            <KeyIcon className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
