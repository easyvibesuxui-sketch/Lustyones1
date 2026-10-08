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
      <PageHero title={dict.order.title} lead={dict.order.lead}>
        <div className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row" style={delay(240)}>
          <a href={`mailto:${site.contact.email}`} className={`group ${primaryButton}`}>
            {dict.order.email}
            <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </a>
          <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
            {dict.order.telegram}
          </a>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
        <h2 className={`reveal ${sectionTitle}`}>{dict.process.title}</h2>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.process.steps.map((step, i) => (
            <li
              key={step.title}
              className="reveal relative overflow-hidden rounded-(--radius-panel) border border-plum-line bg-plum/50 p-6 transition duration-300 hover:-translate-y-1 hover:border-lipstick/60"
            >
              <span aria-hidden="true" className="absolute -right-2 -top-6 font-display text-[7rem] font-semibold leading-none text-lipstick/15">
                {i + 1}
              </span>
              <p className="relative font-semibold text-blush">{step.title}</p>
              <p className="relative mt-2 text-ink">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
