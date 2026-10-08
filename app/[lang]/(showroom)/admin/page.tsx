import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/page-metadata";
import { AdminDashboard } from "@/components/admin-dashboard";
import { CtaBand } from "@/components/cta-band";
import { PageHero, PageShell } from "@/components/page-shell";

export async function generateMetadata({ params }: PageProps<"/[lang]/admin">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "admin", dict.nav.admin);
}

export default async function AdminPage({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <PageShell>
      <PageHero title={dict.admin.title} lead={dict.admin.lead} />

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <AdminDashboard t={dict.dashboard} lang={lang} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.admin.items.map((item, i) => (
            <div
              key={item.title}
              className="reveal group rounded-(--radius-panel) border border-plum-line bg-plum/50 p-6 transition duration-300 hover:-translate-y-1 hover:border-lipstick/60 hover:bg-plum"
            >
              <span aria-hidden="true" className="font-display text-4xl font-semibold text-lipstick/70 transition group-hover:text-lipstick">
                {String(i + 1).padStart(2, "0")}
              </span>
              <dt className="mt-3 font-semibold text-blush">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-haze">{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
