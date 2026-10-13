import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { templates } from "@/lib/templates";
import { enterAt, keyLink, primaryButton } from "@/lib/ui";
import { ChapterStage, type Slide } from "@/components/chapter-stage";
import { CtaBand } from "@/components/cta-band";
import { ArrowIcon, KeyIcon } from "@/components/icons";
import { PageShell } from "@/components/page-shell";
import { UnlockDemo } from "@/components/unlock-demo";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const shown = templates.filter((t) => t.images.stage);

  // The rest of the studio, one door per inner page.
  const inside = [
    { slug: "how-it-works", title: dict.nav.how, text: dict.funnel.lead },
    { slug: "admin", title: dict.nav.admin, text: dict.admin.lead },
    { slug: "pricing", title: dict.nav.pricing, text: dict.pricing.lead },
    { slug: "faq", title: dict.nav.faq, text: dict.faq.items[0].q },
  ];

  // One full screen per chapter: the studio, then each template.
  const slides: Slide[] = [
    {
      id: "intro",
      stage: { src: "/showroom/intro-stage.12466779.webp", backdrop: "/showroom/intro-stage-bg.60004db3.webp", ratio: 0.852, focus: [0.6, 0.3] },
      content: (
        <>
          <h1 className="ch-in max-w-[34rem] font-heading text-[2rem] font-bold uppercase leading-[1.02] text-heading hyphens-auto break-words sm:text-4xl xl:text-5xl" style={enterAt(500)}>
            {dict.hero.title}
          </h1>
          <p className="ch-in mt-7 hidden max-w-md font-body text-base leading-relaxed text-ink/90 sm:block" style={enterAt(700)}>
            {dict.hero.lead}
          </p>
          <div className="ch-in mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10" style={enterAt(850)}>
            <Link href={`/${lang}/templates`} className={primaryButton}>
              {dict.hero.primary}
            </Link>
            <Link href={`/${lang}/order`} className={keyLink}>
              {dict.hero.secondary}
              <KeyIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </>
      ),
    },
    ...shown.map((t, i) => ({
      id: t.id,
      number: i + 1,
      stage: t.images.stage!,
      content: (
        <>
          <h2 className="ch-in font-heading text-5xl font-bold uppercase leading-[0.9] tracking-wide text-heading lg:text-6xl" style={enterAt(550)}>
            {t.name}
          </h2>
          <p className="ch-in mt-6 max-w-sm font-body text-base leading-relaxed text-ink/90" style={enterAt(700)}>
            {dict.templates[t.id].description}
          </p>
          <p className="ch-in mt-3 font-heading text-xs uppercase tracking-[0.25em] text-muted" style={enterAt(780)}>
            {dict.listing.bestFor}: {dict.templates[t.id].bestFor}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
            <Link
              href={`/${lang}/demo/${t.id}`}
              data-enter={`/${lang}/demo/${t.id}`}
              className="group relative inline-flex items-center gap-4 pb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-heading transition-colors hover:text-accent-soft"
            >
              <span className="ch-in" style={enterAt(1100)}>
                {dict.listing.preview}
              </span>
              <KeyIcon className="ch-in transition-transform group-hover:translate-x-1" />
              <span aria-hidden="true" className="ch-line absolute inset-x-0 bottom-0 h-px bg-current" style={enterAt(900)} />
            </Link>
            <Link
              href={`/${lang}/order?template=${t.id}`}
              className="ch-in font-heading text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent-soft"
              style={enterAt(1200)}
            >
              {dict.listing.orderThis} · {t.price}
            </Link>
          </div>
        </>
      ),
    })),
  ];

  return (
    <PageShell>
      <ChapterStage slides={slides} />

      {/* The same site on a laptop and a phone */}
      <section id="screens" className="relative overflow-hidden border-t border-line py-32 sm:py-48">
        <div className="mx-auto grid max-w-[90rem] items-center gap-20 px-5 sm:px-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:pl-28">
          <div className="reveal">
            <h2 className="font-heading text-3xl font-bold uppercase leading-[1] text-heading hyphens-auto break-words sm:text-4xl">
              {dict.home.screensTitle}
            </h2>
            <p className="mt-6 max-w-sm font-body text-base leading-relaxed text-ink/90">{dict.home.screensLead}</p>
          </div>
          <div className="reveal">
            <UnlockDemo
              template={shown[0] ?? templates[0]}
              mock={dict.mock}
              planCopy={dict.demo.plans}
              lang={lang}
              labels={{ unlock: dict.hero.unlock, relock: dict.hero.relock }}
            />
          </div>
        </div>
      </section>

      {/* An index of the inner pages, numbered like chapters */}
      <section className="border-t border-line py-32 sm:py-48">
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <h2 className="reveal font-heading text-xs uppercase tracking-[0.3em] text-accent-soft">{dict.home.insideTitle}</h2>
          <ol className="mt-14 border-t border-line">
            {inside.map((row, i) => (
              <li key={row.slug} className="reveal border-b border-line">
                <Link
                  href={`/${lang}/${row.slug}`}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 py-10 transition-colors hover:bg-surface sm:gap-12 sm:px-6 sm:py-12"
                >
                  <span aria-hidden="true" className="numeral text-5xl transition-colors group-hover:[-webkit-text-stroke-color:var(--color-accent-soft)] sm:text-6xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-heading text-2xl font-bold uppercase leading-none tracking-wide text-heading sm:text-3xl">{row.title}</span>
                    <span className="mt-3 block max-w-lg font-body text-sm leading-relaxed text-muted sm:text-base">{row.text}</span>
                  </span>
                  <ArrowIcon className="size-5 text-heading transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
