import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { templates } from "@/lib/templates";
import { TemplateGrid } from "@/components/template-grid";

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
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="font-display text-5xl font-semibold leading-none text-blush sm:text-7xl">{dict.listing.title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-haze">{dict.listing.lead}</p>
      <div className="mt-10">
        <TemplateGrid templates={templates} dict={dict} lang={lang} />
      </div>
    </div>
  );
}
