import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/page-metadata";
import { delay, primaryButton, secondaryButton } from "@/lib/ui";
import { CtaBand } from "@/components/cta-band";
import { CheckIcon } from "@/components/icons";
import { PageHero, PageShell } from "@/components/page-shell";

export async function generateMetadata({ params }: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "pricing", dict.nav.pricing);
}

export default async function PricingPage({ params }: PageProps<"/[lang]/pricing">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <PageShell>
      <PageHero title={dict.pricing.title} lead={dict.pricing.lead} number={4} backdrop="/demo/bloom/bg.webp" />

      <section className="mx-auto max-w-6xl px-5 pb-32 sm:px-10 sm:pb-40">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          {dict.pricing.plans.map((plan, i) => {
            const featured = plan.id === "pro";
            return (
              <div key={plan.id} className="animate-rise" style={delay(200 + i * 120)}>
                <div
                  className={`relative flex h-full flex-col rounded-(--radius-panel) border p-8 sm:p-10 transition duration-300 hover:-translate-y-1 ${
                    featured
                      ? "border-accent bg-surface shadow-[0_30px_90px_-40px_rgba(201,163,82,0.7)]"
                      : "border-line bg-surface/40 hover:border-heading/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-heading text-base font-bold uppercase tracking-[0.2em] text-ink">{plan.name}</h2>
                    {featured && (
                      <span className="rounded-(--radius-control) bg-accent px-2.5 py-1 font-heading text-xs font-bold uppercase tracking-widest text-night">{dict.pricing.popular}</span>
                    )}
                  </div>
                  <p className="mt-6 font-heading text-4xl font-bold uppercase text-heading">{plan.price}</p>
                  <p className="mt-4 font-body text-sm leading-relaxed text-muted">{plan.text}</p>
                  <ul className="mb-10 mt-8 flex flex-col gap-3.5 border-t border-line pt-8 text-sm text-ink">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <CheckIcon className="mt-0.5 shrink-0 text-accent-soft" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${lang}/order`} className={`${featured ? primaryButton : secondaryButton} mt-auto translate-y-0`}>
                    {dict.pricing.order}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <p className="reveal mt-14 text-center text-sm text-muted">{dict.pricing.support}</p>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
