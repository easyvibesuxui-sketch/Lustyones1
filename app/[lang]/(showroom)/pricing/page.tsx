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
      <PageHero title={dict.pricing.title} lead={dict.pricing.lead} />

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {dict.pricing.plans.map((plan, i) => {
            const featured = plan.id === "pro";
            return (
              <div key={plan.id} className="animate-rise" style={delay(200 + i * 120)}>
                <div
                  className={`relative flex h-full flex-col rounded-(--radius-panel) border p-7 transition duration-300 hover:-translate-y-2 ${
                    featured
                      ? "border-lipstick bg-plum shadow-[0_30px_90px_-30px_rgba(216,30,79,0.8)]"
                      : "border-plum-line bg-plum/40 hover:border-blush/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-ink">{plan.name}</h2>
                    {featured && (
                      <span className="rounded-full bg-lipstick px-3 py-1 text-xs font-semibold text-white">{dict.pricing.popular}</span>
                    )}
                  </div>
                  <p className="mt-4 font-display text-5xl font-semibold text-blush">{plan.price}</p>
                  <p className="mt-3 text-haze">{plan.text}</p>
                  <ul className="mt-6 flex flex-col gap-3 border-t border-plum-line pt-6 text-sm text-ink">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <CheckIcon className="mt-0.5 shrink-0 text-lipstick" />
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
        <p className="reveal mt-8 text-center text-haze">{dict.pricing.support}</p>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
