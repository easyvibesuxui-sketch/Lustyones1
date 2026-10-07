import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { templates } from "@/lib/templates";
import { site } from "@/lib/site";
import { PhoneMock } from "@/components/phone-mock";
import { UnlockDemo } from "@/components/unlock-demo";

const sectionTitle = "font-display text-4xl font-semibold leading-tight text-blush sm:text-5xl";
const primaryButton =
  "inline-flex items-center justify-center rounded-(--radius-control) bg-lipstick px-6 py-3.5 font-semibold text-white hover:bg-lipstick-deep";
const secondaryButton =
  "inline-flex items-center justify-center rounded-(--radius-control) border border-blush/40 px-6 py-3.5 font-medium text-blush hover:border-blush hover:bg-blush/10";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const [heroTemplate] = templates;

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:pt-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-semibold leading-[1.02] text-blush sm:text-6xl lg:text-7xl">
            {dict.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-haze">{dict.hero.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/${lang}/templates`} className={primaryButton}>
              {dict.hero.primary}
            </Link>
            <Link href={`/${lang}#order`} className={secondaryButton}>
              {dict.hero.secondary}
            </Link>
          </div>
          <ul className="mt-10 flex flex-col gap-2 text-sm text-ink sm:flex-row sm:flex-wrap sm:gap-x-6">
            {dict.hero.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="text-lipstick" fill="currentColor">
                  <path d="M6.2 11.6 2.6 8l1.1-1.1 2.5 2.5 6.1-6.1L13.4 4.4z" />
                </svg>
                {fact}
              </li>
            ))}
          </ul>
        </div>
        <UnlockDemo
          template={heroTemplate}
          mock={dict.mock}
          lang={lang}
          labels={{ unlock: dict.hero.unlock, relock: dict.hero.relock }}
        />
      </section>

      {/* Template showcase */}
      <section className="border-y border-plum-line/60 bg-plum/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className={sectionTitle}>{dict.showcase.title}</h2>
              <p className="mt-4 text-haze">{dict.showcase.lead}</p>
            </div>
            <Link href={`/${lang}/templates`} className={`${secondaryButton} self-start md:self-auto`}>
              {dict.showcase.seeAll}
            </Link>
          </div>
          <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {templates.map((t) => (
              <li key={t.id} className="shrink-0 snap-start">
                <Link href={`/${lang}/templates`} className="group block rounded-(--radius-device)">
                  <PhoneMock template={t} mock={dict.mock} lang={lang} size="small" />
                  <p className="mt-4 font-display text-2xl font-semibold text-blush group-hover:underline">{t.name}</p>
                  <p className="text-sm text-haze">{dict.templates[t.id].bestFor}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Funnel: a real sequence, so the steps are numbered */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
        <h2 className={`${sectionTitle} max-w-2xl`}>{dict.funnel.title}</h2>
        <p className="mt-4 max-w-xl text-haze">{dict.funnel.lead}</p>
        <ol className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {dict.funnel.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col">
              <span className="font-display text-6xl font-semibold leading-none text-lipstick" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-haze">{step.text}</p>
              <ul className="mt-5 flex flex-col gap-3 border-t border-plum-line pt-5 text-sm text-ink">
                {step.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blush" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* Admin */}
      <section id="admin" className="scroll-mt-20 border-y border-plum-line/60 bg-plum/40 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className={sectionTitle}>{dict.admin.title}</h2>
            <p className="mt-4 text-haze">{dict.admin.lead}</p>
          </div>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {dict.admin.items.map((item) => (
              <div key={item.title}>
                <dt className="font-semibold text-blush">{item.title}</dt>
                <dd className="mt-1.5 text-haze">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Pricing and ordering process */}
      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
        <h2 className={sectionTitle}>{dict.pricing.title}</h2>
        <p className="mt-4 max-w-xl text-haze">{dict.pricing.lead}</p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {dict.pricing.plans.map((plan) => {
            const featured = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={`flex flex-col rounded-(--radius-panel) border p-7 ${
                  featured ? "border-lipstick bg-plum" : "border-plum-line"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                  {featured && (
                    <span className="rounded-full bg-lipstick px-3 py-1 text-xs font-semibold text-white">
                      {dict.pricing.popular}
                    </span>
                  )}
                </div>
                <p className="mt-4 font-display text-5xl font-semibold text-blush">{plan.price}</p>
                <p className="mt-3 text-haze">{plan.text}</p>
                <ul className="mt-6 flex flex-col gap-3 border-t border-plum-line pt-6 text-sm text-ink">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="mt-0.5 shrink-0 text-lipstick" fill="currentColor">
                        <path d="M6.2 11.6 2.6 8l1.1-1.1 2.5 2.5 6.1-6.1L13.4 4.4z" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${lang}#order`} className={`${featured ? primaryButton : secondaryButton} mt-8`}>
                  {dict.pricing.order}
                </Link>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-haze">{dict.pricing.support}</p>

        <h3 className="mt-20 font-display text-3xl font-semibold text-blush">{dict.process.title}</h3>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {dict.process.steps.map((step, i) => (
            <li key={step.title} className="border-t border-plum-line pt-5">
              <p className="text-sm text-haze">
                <span className="font-semibold text-blush">{i + 1}.</span> {step.title}
              </p>
              <p className="mt-2 text-ink">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-plum-line/60 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <h2 className={sectionTitle}>{dict.faq.title}</h2>
          <div className="divide-y divide-plum-line border-y border-plum-line">
            {dict.faq.items.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-2xl leading-none text-blush transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 text-haze">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Order */}
      <section id="order" className="scroll-mt-20 px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-(--radius-panel) bg-lipstick px-6 py-14 text-white sm:px-14 sm:py-20">
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-6xl">{dict.order.title}</h2>
          <p className="mt-5 max-w-xl text-lg text-white/90">{dict.order.lead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${site.contact.email}`}
              className="inline-flex items-center justify-center rounded-(--radius-control) bg-white px-6 py-3.5 font-semibold text-lipstick-deep hover:bg-blush"
            >
              {dict.order.email}
            </a>
            <a
              href={site.contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-(--radius-control) border border-white/60 px-6 py-3.5 font-medium text-white hover:bg-white/10"
            >
              {dict.order.telegram}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
