import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { templates } from "@/lib/templates";
import { site } from "@/lib/site";
import { delay, primaryButton, secondaryButton, sectionTitle } from "@/lib/ui";
import { CtaBand } from "@/components/cta-band";
import { DeviceDuo } from "@/components/device-duo";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { Marquee } from "@/components/marquee";
import { PageShell } from "@/components/page-shell";
import { UnlockDemo } from "@/components/unlock-demo";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  // The hero shows the first template that has real demo images.
  const heroTemplate = templates.find((t) => t.images.feed.length > 0) ?? templates[0];

  // One card per inner page, each a door to the full story.
  const explore = [
    { slug: "how-it-works", eyebrow: dict.nav.how, title: dict.funnel.title, text: dict.funnel.lead },
    { slug: "admin", eyebrow: dict.nav.admin, title: dict.admin.title, text: dict.admin.lead },
    { slug: "pricing", eyebrow: dict.nav.pricing, title: `${dict.listing.from} ${site.startingPrice}`, text: dict.pricing.lead },
    { slug: "faq", eyebrow: dict.nav.faq, title: dict.faq.items[0].q, text: dict.faq.items[0].a },
  ];

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true">
          <div className="aurora -left-32 -top-40 size-[28rem] bg-accent" />
          <div className="aurora right-0 top-20 size-96 bg-violet" style={delay(-6000)} />
          <div className="aurora bottom-0 left-1/3 size-72 bg-amber opacity-25" style={delay(-11000)} />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:pt-20">
          <div className="max-w-2xl">
            <h1 className="animate-rise text-shimmer font-heading text-[2.4rem] font-semibold leading-[1.05] tracking-tight hyphens-auto break-words sm:text-5xl xl:text-[3.6rem]">
              {dict.hero.title}
            </h1>
            <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted" style={delay(120)}>
              {dict.hero.lead}
            </p>
            <div className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row" style={delay(240)}>
              <Link href={`/${lang}/templates`} className={`group ${primaryButton}`}>
                {dict.hero.primary}
                <ArrowIcon className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href={`/${lang}/order`} className={secondaryButton}>
                {dict.hero.secondary}
              </Link>
            </div>
            <ul className="mt-10 flex flex-col gap-2 text-sm text-ink sm:flex-row sm:flex-wrap sm:gap-x-6">
              {dict.hero.facts.map((fact, i) => (
                <li key={fact} className="animate-rise flex items-center gap-2" style={delay(380 + i * 90)}>
                  <CheckIcon className="text-accent-soft" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-rise" style={delay(300)}>
            <UnlockDemo
              template={heroTemplate}
              mock={dict.mock}
              planCopy={dict.demo.plans}
              lang={lang}
              labels={{ unlock: dict.hero.unlock, relock: dict.hero.relock }}
            />
          </div>
        </div>
      </section>

      <Marquee items={[...dict.hero.facts, ...dict.funnel.steps.flatMap((s) => s.items)]} />

      {/* Template showcase */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className={sectionTitle}>{dict.showcase.title}</h2>
            <p className="mt-4 text-muted">{dict.showcase.lead}</p>
          </div>
          <Link href={`/${lang}/templates`} className={`group ${secondaryButton} self-start md:self-auto`}>
            {dict.showcase.seeAll}
            <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {templates.map((t) => (
            <li key={t.id} className="reveal">
              <Link href={`/${lang}/demo/${t.id}`} className="group block rounded-xl">
                <DeviceDuo template={t} mock={dict.mock} planCopy={dict.demo.plans} lang={lang} />
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-heading text-2xl font-semibold text-heading">{t.name}</p>
                    <p className="text-sm text-muted">{dict.templates[t.id].bestFor}</p>
                  </div>
                  <span className="flex items-center gap-2 text-sm font-medium text-heading opacity-70 transition group-hover:opacity-100">
                    {dict.listing.preview}
                    <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Doors to the inner pages */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <ul className="grid gap-5 md:grid-cols-2">
          {explore.map((card) => (
            <li key={card.slug} className="reveal">
              <Link
                href={`/${lang}/${card.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-(--radius-panel) border border-line bg-surface/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/70 hover:bg-surface"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 size-48 rounded-full bg-accent/0 blur-3xl transition duration-500 group-hover:bg-accent/30"
                />
                <span className="relative text-sm font-semibold uppercase tracking-widest text-accent-soft">{card.eyebrow}</span>
                <span className="relative mt-3 font-heading text-2xl font-semibold leading-tight tracking-tight text-heading">{card.title}</span>
                <span className="relative mt-3 line-clamp-3 text-muted">{card.text}</span>
                <span className="relative mt-6 flex items-center gap-2 font-medium text-ink">
                  {dict.home.more}
                  <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-2" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
