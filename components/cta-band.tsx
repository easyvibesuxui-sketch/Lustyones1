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
      <div className="reveal relative mx-auto flex max-w-4xl flex-col items-center px-5 py-28 text-center sm:px-10 sm:py-36">
        <KeyholeOutline className="h-24 w-16 text-accent-soft" />
        <h2 className="mt-10 font-heading text-5xl font-bold uppercase leading-[0.92] text-heading hyphens-auto break-words sm:text-7xl">
          {dict.order.title}
        </h2>
        <p className="mt-6 max-w-xl font-body text-lg text-ink">{dict.order.lead}</p>
        <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row">
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
