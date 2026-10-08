import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { site } from "@/lib/site";
import { Logo } from "./logo";

type Props = { lang: Locale; dict: Dictionary };

export function Footer({ lang, dict }: Props) {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Link href={`/${lang}`} className="self-start rounded-sm">
            <Logo />
          </Link>
          <p>{dict.footer.note}</p>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <a href={`mailto:${site.contact.email}`} className="hover:text-ink">
            {site.contact.email}
          </a>
          <p>
            © {site.copyrightYear} {site.name}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
