"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import { LanguageSwitcher } from "./language-switcher";

type Props = {
  lang: Locale;
  links: { href: string; label: string }[];
  templates: { id: string; name: string; scene?: string; line: string }[];
  labels: { menu: string; close: string; language: string };
};

// "Menu" opens a full-screen index: the pages on the left, the templates on the right.
export function MenuOverlay({ lang, links, templates, labels }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname().replace(/\/$/, "");
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    openRef.current?.focus();
  };

  return (
    <>
      <button
        ref={openRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="flex items-center gap-3 font-body text-base text-heading hover:text-accent-soft"
      >
        <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" fill="currentColor">
          <path d="M0 0h20v1.6H0zM0 6.2h20v1.6H0zM0 12.4h20V14H0z" />
        </svg>
        {labels.menu}
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.menu}
        data-open={open}
        inert={!open}
        className="menu-overlay fixed inset-0 z-50 overflow-y-auto bg-night"
      >
        <div className="mx-auto grid min-h-full max-w-[90rem] gap-12 px-5 py-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="flex flex-col">
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="flex items-center gap-3 self-start font-body text-base text-heading hover:text-accent-soft"
            >
              <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" fill="currentColor">
                <path d="M1.1 0 0 1.1 5.9 7 0 12.9 1.1 14 7 8.1l5.9 5.9 1.1-1.1L8.1 7 14 1.1 12.9 0 7 5.9z" />
              </svg>
              {labels.close}
            </button>

            <nav aria-label={labels.menu} className="mt-14">
              <ol className="flex flex-col gap-2">
                {links.map((l, i) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === l.href ? "page" : undefined}
                      className="group flex items-baseline gap-4 font-body text-4xl text-muted transition-colors hover:text-heading aria-[current=page]:text-heading sm:text-6xl"
                    >
                      <span className="font-heading text-sm tracking-widest text-accent-soft">{String(i + 1).padStart(2, "0")}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-2">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-auto flex flex-col gap-4 pt-14 font-body text-sm text-muted">
              <div className="self-start">
                <LanguageSwitcher lang={lang} label={labels.language} />
              </div>
              <a href={`mailto:${site.contact.email}`} className="self-start border-b border-line pb-0.5 hover:text-heading">
                {site.contact.email}
              </a>
              <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className="self-start border-b border-line pb-0.5 hover:text-heading">
                Telegram
              </a>
            </div>
          </div>

          <ul className="hidden flex-col justify-center gap-6 pr-8 lg:flex">
            {templates.map((t, i) => (
              <li key={t.id} className={i % 2 ? "self-start" : "self-end"}>
                <Link href={`/${lang}/demo/${t.id}`} onClick={() => setOpen(false)} className="group relative flex items-end gap-6">
                  <span className="font-heading text-4xl font-bold uppercase leading-none text-heading transition-colors group-hover:text-accent-soft">
                    {t.name}
                    <span className="mt-2 block font-body text-base font-normal normal-case text-muted">{t.line}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-28 w-44 bg-cover bg-center opacity-70 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                    style={t.scene ? { backgroundImage: `url(${asset(t.scene)})` } : undefined}
                  />
                  <span aria-hidden="true" className="numeral absolute -bottom-6 -right-6 text-8xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
