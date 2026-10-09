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
      <PageHero title={dict.admin.title} lead={dict.admin.lead} number={3} backdrop="/demo/editorial/bg.webp" />

      <section className="mx-auto max-w-6xl px-5 pb-28 sm:px-10 sm:pb-36">
        <AdminDashboard t={dict.dashboard} lang={lang} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-32 sm:px-10 sm:pb-40">
        <dl className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {dict.admin.items.map((item, i) => (
            <div
              key={item.title}
              className="reveal group border-t border-line pt-6 transition-colors duration-300 hover:border-accent"
            >
              <span aria-hidden="true" className="numeral text-5xl transition-colors group-hover:[-webkit-text-stroke-color:var(--color-accent-soft)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <dt className="mt-5 font-heading text-lg font-bold uppercase tracking-wide text-heading">{item.title}</dt>
              <dd className="mt-3 font-body text-sm leading-relaxed text-muted">{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
