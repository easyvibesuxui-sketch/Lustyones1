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

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <AdminDashboard t={dict.dashboard} lang={lang} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.admin.items.map((item, i) => (
            <div
              key={item.title}
              className="reveal group border-t border-line pt-6 transition-colors duration-300 hover:border-accent"
            >
              <span aria-hidden="true" className="numeral text-6xl transition-colors group-hover:[-webkit-text-stroke-color:var(--color-accent-soft)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <dt className="mt-4 font-heading text-xl font-bold uppercase tracking-wide text-heading">{item.title}</dt>
              <dd className="mt-2 font-body leading-relaxed text-muted">{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </PageShell>
  );
}
