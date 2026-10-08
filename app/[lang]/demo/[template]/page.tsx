import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { templates } from "@/lib/templates";
import { DemoBar } from "@/components/demo/demo-bar";
import { DemoSite } from "@/components/demo/demo-site";

// Only the four templates exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return templates.map((t) => ({ template: t.id }));
}

const findTemplate = (id: string) => templates.find((t) => t.id === id);

export async function generateMetadata({ params }: PageProps<"/[lang]/demo/[template]">): Promise<Metadata> {
  const { lang, template } = await params;
  const tpl = findTemplate(template);
  if (!isLocale(lang) || !tpl) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.demo.metaTitle.replace("{template}", tpl.name),
    // Demo pages show adult-themed sample content; keep them out of search results.
    robots: { index: false },
  };
}

export default async function DemoPage({ params }: PageProps<"/[lang]/demo/[template]">) {
  const { lang, template } = await params;
  const tpl = findTemplate(template);
  if (!isLocale(lang) || !tpl) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <DemoBar lang={lang} current={tpl.id} t={dict.demo.bar} />
      <main className="flex-1">
        <DemoSite template={tpl} lang={lang} t={dict.demo} mock={dict.mock} />
      </main>
    </>
  );
}
