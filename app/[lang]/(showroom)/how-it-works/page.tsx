import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/page-metadata";
import { templates } from "@/lib/templates";
import { delay } from "@/lib/ui";
import { CtaBand } from "@/components/cta-band";
import { PageHero, PageShell } from "@/components/page-shell";
import { PhoneMock } from "@/components/phone-mock";

export async function generateMetadata({ params }: PageProps<"/[lang]/how-it-works">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "how-it-works", dict.nav.how);
}

export default async function HowItWorksPage({ params }: PageProps<"/[lang]/how-it-works">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const phoneTemplate = templates.find((t) => t.id === "neon") ?? templates[0];

  return (
    <PageShell>
      <PageHero title={dict.funnel.title} lead={dict.funnel.lead} number={2} backdrop="/demo/neon/bg.webp" />

      <section className="mx-auto grid max-w-6xl gap-20 px-5 pb-32 pt-8 sm:px-10 sm:pb-40 lg:grid-cols-[minmax(0,1fr)_auto]">
        {/* A real sequence, so the steps are numbered */}
        <ol className="flex flex-col">
          {dict.funnel.steps.map((step, i) => (
            <li key={step.title} className="reveal grid gap-5 border-t border-line py-14 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-10 sm:py-16">
              <span aria-hidden="true" className="numeral text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-heading text-2xl font-bold uppercase leading-none tracking-wide text-heading sm:text-3xl">{step.title}</h2>
                <p className="mt-4 font-body text-base text-muted">{step.text}</p>
                <ul className="mt-7 flex flex-col gap-3 font-body text-sm text-ink/90 sm:text-base">
                  {step.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2.5 size-1.5 shrink-0 bg-accent" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="animate-rise" style={delay(300)}>
              <div className="animate-float">
                <PhoneMock template={phoneTemplate} mock={dict.mock} lang={lang} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
