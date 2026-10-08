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
      <PageHero title={dict.funnel.title} lead={dict.funnel.lead} />

      <section className="mx-auto grid max-w-6xl gap-16 px-4 pb-24 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        {/* A real sequence, so the steps are numbered and joined by a line */}
        <ol className="relative flex flex-col gap-6 before:absolute before:bottom-8 before:left-7 before:top-8 before:w-px before:bg-gradient-to-b before:from-accent before:via-line before:to-transparent">
          {dict.funnel.steps.map((step, i) => (
            <li key={step.title} className="reveal relative flex gap-6">
              <span
                aria-hidden="true"
                className="relative grid size-14 shrink-0 place-items-center rounded-full border border-accent/60 bg-night font-heading text-xl font-semibold text-heading shadow-[0_0_30px_-6px_rgba(227,23,91,0.8)]"
              >
                {i + 1}
              </span>
              <div className="flex-1 rounded-(--radius-panel) border border-line bg-surface/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/60">
                <h2 className="text-2xl font-semibold text-ink">{step.title}</h2>
                <p className="mt-2 text-muted">{step.text}</p>
                <ul className="mt-5 flex flex-col gap-3 border-t border-line pt-5 text-ink">
                  {step.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
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
