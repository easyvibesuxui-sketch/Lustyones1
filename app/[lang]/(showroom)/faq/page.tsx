import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/page-metadata";
import { delay } from "@/lib/ui";
import { CtaBand } from "@/components/cta-band";
import { PageHero, PageShell } from "@/components/page-shell";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "faq", dict.nav.faq);
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <PageShell>
      <PageHero title={dict.faq.title} number={5} backdrop="/demo/velvet/bg.webp" />

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div className="flex flex-col gap-3">
          {dict.faq.items.map((item, i) => (
            <details
              key={item.q}
              className="faq animate-rise group rounded-(--radius-panel) border border-line bg-surface/40 px-6 transition-colors open:border-accent/60 open:bg-surface hover:border-heading/40"
              style={delay(150 + i * 80)}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-body text-lg text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-xl leading-none text-heading transition-transform duration-300 group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-night"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
