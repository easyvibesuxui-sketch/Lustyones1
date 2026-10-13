import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { templates } from "@/lib/templates";
import { CreatorAdmin } from "@/components/demo/creator-admin";
import { DemoBar } from "@/components/demo/demo-bar";

export const dynamicParams = false;

export function generateStaticParams() {
  return templates.map((t) => ({ template: t.id }));
}

const findTemplate = (id: string) => templates.find((t) => t.id === id);

export async function generateMetadata({ params }: PageProps<"/[lang]/demo/[template]/admin">): Promise<Metadata> {
  const { lang, template } = await params;
  const tpl = findTemplate(template);
  if (!isLocale(lang) || !tpl) return {};
  const dict = await getDictionary(lang);
  return { title: dict.studio.metaTitle.replace("{template}", tpl.name), robots: { index: false } };
}

// The creator's side of a live demo: fan list, memberships, payments and compliance.
export default async function DemoAdminPage({ params }: PageProps<"/[lang]/demo/[template]/admin">) {
  const { lang, template } = await params;
  const tpl = findTemplate(template);
  if (!isLocale(lang) || !tpl) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <DemoBar lang={lang} current={tpl.id} t={dict.demo.bar} view="admin" />
      <main className="flex-1">
        <CreatorAdmin template={tpl} lang={lang} t={dict.studio} demo={dict.demo} />
      </main>
    </>
  );
}
