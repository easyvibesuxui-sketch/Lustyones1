import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/page-metadata";
import { site } from "@/lib/site";
import { templates } from "@/lib/templates";
import { delay, primaryButton, secondaryButton, sectionTitle } from "@/lib/ui";
import { ArrowIcon } from "@/components/icons";
import { OrderForm, OrderFormFromQuery } from "@/components/order-form";
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
  const form = {
    t: dict.order.form,
    templates: templates.map((t) => ({ id: t.id, name: t.name, note: dict.templates[t.id].bestFor })),
    plans: dict.pricing.plans.map((p) => ({ id: p.id, name: p.name, note: p.price })),
  };

  return (
    <PageShell>
      <PageHero title={dict.order.title} lead={dict.order.lead} number={6} backdrop="/showroom/intro-bg.webp">
        <div className="animate-rise mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6" style={delay(240)}>
          <a href="#brief" className={`group ${primaryButton}`}>
            {dict.order.form.title}
            <ArrowIcon className="rotate-90 transition-transform group-hover:translate-y-1" />
          </a>
          <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
            {dict.order.telegram}
          </a>
        </div>
      </PageHero>

      <section id="brief" className="mx-auto grid max-w-6xl scroll-mt-28 gap-14 px-5 pb-24 pt-12 sm:px-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <div className="reveal">
          <h2 className={sectionTitle}>{dict.order.form.title}</h2>
          <p className="mt-6 max-w-sm font-body text-base leading-relaxed text-ink/90">{dict.order.lead}</p>
          <p className="mt-10 font-heading text-xs uppercase tracking-[0.25em] text-muted">{dict.order.form.or}</p>
          <div className="mt-4 flex flex-col items-start gap-3 font-body text-base text-heading">
            <a href={`mailto:${site.contact.email}`} className="border-b border-heading/40 pb-0.5 transition hover:border-accent hover:text-accent-soft">
              {site.contact.email}
            </a>
            <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className="border-b border-heading/40 pb-0.5 transition hover:border-accent hover:text-accent-soft">
              {dict.order.telegram}
            </a>
          </div>
        </div>
        <Suspense fallback={<OrderForm {...form} />}>
          <OrderFormFromQuery {...form} />
        </Suspense>
      </section>

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
