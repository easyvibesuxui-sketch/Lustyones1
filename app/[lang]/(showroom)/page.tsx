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
  const shown = templates.filter((t) => t.images.scene && t.images.backdrop);

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
      backdrop: "/showroom/intro-bg.webp",
      scene: "/showroom/intro-scene.webp",
      content: (
        <>
          <h1 className="ch-in font-heading text-[2.6rem] font-bold uppercase leading-[0.92] text-heading hyphens-auto break-words sm:text-6xl xl:text-7xl" style={enterAt(500)}>
            {dict.hero.title}
          </h1>
          <p className="ch-in mt-6 hidden max-w-lg font-body text-lg leading-relaxed text-ink sm:block" style={enterAt(700)}>
            {dict.hero.lead}
          </p>
          <div className="ch-in mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center" style={enterAt(850)}>
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
      backdrop: t.images.backdrop!,
      scene: t.images.scene!,
      content: (
        <>
          <h2 className="ch-in font-heading text-7xl font-bold uppercase leading-[0.85] text-heading sm:text-8xl lg:text-9xl" style={enterAt(550)}>
            {t.name}
          </h2>
          <p className="ch-in mt-5 max-w-md font-body text-xl leading-relaxed text-ink" style={enterAt(700)}>
            {dict.templates[t.id].description}
          </p>
          <p className="ch-in mt-2 font-heading text-sm uppercase tracking-widest text-muted" style={enterAt(780)}>
            {dict.listing.bestFor}: {dict.templates[t.id].bestFor}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-5">
            <Link
              href={`/${lang}/demo/${t.id}`}
              data-enter={`/${lang}/demo/${t.id}`}
              className="group relative inline-flex items-center gap-4 pb-2 font-heading text-lg font-medium uppercase tracking-wider text-heading transition-colors hover:text-accent-soft"
            >
              <span className="ch-in" style={enterAt(1100)}>
                {dict.listing.preview}
              </span>
              <KeyIcon className="ch-in transition-transform group-hover:translate-x-1" />
              <span aria-hidden="true" className="ch-line absolute inset-x-0 bottom-0 h-px bg-current" style={enterAt(900)} />
            </Link>
            <Link
              href={`/${lang}/order`}
              className="ch-in font-heading text-base uppercase tracking-widest text-muted transition-colors hover:text-accent-soft"
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
      <section id="screens" className="relative overflow-hidden border-t border-line py-28 sm:py-36">
        <div className="mx-auto grid max-w-[90rem] items-center gap-16 px-5 sm:px-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:pl-28">
          <div className="reveal">
            <h2 className="font-heading text-5xl font-bold uppercase leading-[0.92] text-heading hyphens-auto break-words sm:text-7xl">
              {dict.home.screensTitle}
            </h2>
            <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-ink">{dict.home.screensLead}</p>
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
      <section className="border-t border-line py-28 sm:py-36">
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <h2 className="reveal font-heading text-sm uppercase tracking-[0.3em] text-accent-soft">{dict.home.insideTitle}</h2>
          <ol className="mt-10 border-t border-line">
            {inside.map((row, i) => (
              <li key={row.slug} className="reveal border-b border-line">
                <Link
                  href={`/${lang}/${row.slug}`}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 py-8 transition-colors hover:bg-surface sm:gap-10 sm:px-4"
                >
                  <span aria-hidden="true" className="numeral text-6xl transition-colors group-hover:[-webkit-text-stroke-color:var(--color-accent-soft)] sm:text-8xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-heading text-3xl font-bold uppercase leading-none text-heading sm:text-5xl">{row.title}</span>
                    <span className="mt-3 block max-w-xl font-body text-muted">{row.text}</span>
                  </span>
                  <ArrowIcon className="size-6 text-heading transition-transform duration-300 group-hover:translate-x-2" />
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
