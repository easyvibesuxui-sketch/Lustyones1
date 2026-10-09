import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { templates } from "@/lib/templates";
import { TemplateGrid } from "@/components/template-grid";
import { CtaBand } from "@/components/cta-band";
import { PageHero, PageShell } from "@/components/page-shell";

export async function generateMetadata({ params }: PageProps<"/[lang]/templates">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.templatesTitle,
    alternates: {
      canonical: `/${lang}/templates`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/templates`])),
    },
  };
}

export default async function TemplatesPage({ params }: PageProps<"/[lang]/templates">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <PageShell>
      <PageHero title={dict.listing.title} lead={dict.listing.lead} number={1} backdrop="/demo/velvet/bg.webp" />
      <div className="mx-auto max-w-6xl px-5 pb-32 sm:px-10 sm:pb-40">
        <TemplateGrid templates={templates} dict={dict} lang={lang} />
      </div>
      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
