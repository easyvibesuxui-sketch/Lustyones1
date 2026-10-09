import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/page-metadata";
import { site } from "@/lib/site";
import { delay, primaryButton, secondaryButton, sectionTitle } from "@/lib/ui";
import { ArrowIcon } from "@/components/icons";
import { PageHero, PageShell } from "@/components/page-shell";

export async function generateMetadata({ params }: PageProps<"/[lang]/order">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "order", dict.nav.order);
}

export default async function OrderPage({ params }: PageProps<"/[lang]/order">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <PageShell>
      <PageHero title={dict.order.title} lead={dict.order.lead} number={6} backdrop="/showroom/intro-bg.webp">
        <div className="animate-rise mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6" style={delay(240)}>
          <a href={`mailto:${site.contact.email}`} className={`group ${primaryButton}`}>
            {dict.order.email}
            <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </a>
          <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
            {dict.order.telegram}
          </a>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-5 pb-32 pt-12 sm:px-10 sm:pb-40">
        <h2 className={`reveal ${sectionTitle}`}>{dict.process.title}</h2>
        <ol className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {dict.process.steps.map((step, i) => (
            <li
              key={step.title}
              className="reveal relative overflow-hidden border-t border-line pt-6 transition-colors duration-300 hover:border-accent"
            >
              <span aria-hidden="true" className="numeral block text-5xl">
                {i + 1}
              </span>
              <p className="relative mt-5 font-heading text-lg font-bold uppercase tracking-wide text-heading">{step.title}</p>
              <p className="relative mt-3 font-body text-sm leading-relaxed text-ink/90">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
