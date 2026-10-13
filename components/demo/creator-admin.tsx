"use client";

import { useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { plans, type Template } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { asset } from "@/lib/asset";
import {
  bundlePrice,
  fansCsv,
  monthlyRevenue,
  processorIds,
  regionIds,
  tierIds,
  useDemoState,
  type Fan,
  type FanStatus,
  type ProcessorId,
} from "@/lib/demo-store";

type Props = { template: Template; lang: Locale; t: Dictionary["studio"]; demo: Dictionary["demo"] };
type Tab = "fans" | "memberships" | "payments" | "compliance";

const tabs: Tab[] = ["fans", "memberships", "payments", "compliance"];
const fontVar = { display: "var(--font-display)", body: "var(--font-sans)", bold: "var(--font-wide)" } as const;

// Typical 2025 terms for adult merchants; each provider quotes its own after review.
const processors: Record<ProcessorId, { name: string; fee: [number, number] | "quote" | number; reserve?: [number, number] }> = {
  ccbill: { name: "CCBill", fee: [0.108, 0.145], reserve: [0.05, 6] },
  segpay: { name: "Segpay", fee: "quote", reserve: [0.05, 6] },
  verotel: { name: "Verotel", fee: [0.13, 0.155], reserve: [0.1, 6] },
  epoch: { name: "Epoch", fee: 0.15 },
};

// Made-up people who appear in the creator's content, with their paperwork.
const people = [
  { name: "", id: true, consent: 412 },
  { name: "Lina K.", id: true, consent: 96 },
  { name: "Sasha M.", id: false, consent: 0 },
];

function fill(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

function Card({ title, text, children, aside }: { title: string; text?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="rounded-3xl bg-(--t-surface) p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <h2 className="font-(family-name:--t-font) text-xl font-semibold">{title}</h2>
          {text && <p className="mt-1 text-sm text-(--t-muted)">{text}</p>}
        </div>
        {aside}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative h-6 w-11 shrink-0 rounded-full bg-(--t-muted)/40 transition aria-checked:bg-(--t-accent)"
    >
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left] ${on ? "left-5.5" : "left-0.5"}`} />
    </button>
  );
}

// The creator's own admin panel for a live demo: fan list, memberships, payments and compliance.
export function CreatorAdmin({ template, lang, t, demo }: Props) {
  const { theme, creator, images } = template;
  const [store, update, reset] = useDemoState(template.id);
  const [tab, setTab] = useState<Tab>("fans");
  const [filter, setFilter] = useState<FanStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [mailed, setMailed] = useState<number | null>(null);
  const [invited, setInvited] = useState(false);

  const money = new Intl.NumberFormat(lang, { style: "currency", currency: "USD" });
  const pct = new Intl.NumberFormat(lang, { style: "percent", maximumFractionDigits: 1 });
  const ago = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const daysAgo = (n: number) => (n < 45 ? ago.format(-n, "day") : ago.format(-Math.round(n / 30), "month"));

  const style = {
    "--t-bg": theme.bg,
    "--t-surface": theme.surface,
    "--t-text": theme.text,
    "--t-muted": theme.muted,
    "--t-accent": theme.accent,
    "--t-accent-text": theme.accentText,
    "--t-font": fontVar[theme.font],
  } as CSSProperties;

  const accentButton =
    "inline-flex items-center justify-center gap-2 rounded-full bg-(--t-accent) px-4 py-2.5 text-sm font-semibold text-(--t-accent-text) hover:opacity-90";
  const ghostButton =
    "inline-flex items-center justify-center gap-2 rounded-full border border-(--t-muted)/40 px-4 py-2.5 text-sm font-medium hover:border-(--t-text)";
  const input =
    "rounded-xl border border-(--t-muted)/40 bg-(--t-bg) px-3 py-2 text-(--t-text) outline-none focus:border-(--t-accent)";

  const subscribers = store.fans.filter((f) => f.status === "active" || f.status === "trial");
  const openReports = store.reports.filter((r) => r.status === "open");
  const kpis = [
    { label: t.kpis.mrr, value: money.format(monthlyRevenue(store)) },
    { label: t.kpis.active, value: String(subscribers.length) },
    { label: t.kpis.leads, value: String(store.fans.filter((f) => f.status === "lead").length) },
    { label: t.kpis.reports, value: String(openReports.length) },
  ];

  // --- Fans ---------------------------------------------------------------
  const q = query.trim().toLowerCase();
  const shown = store.fans.filter(
    (f) => (filter === "all" || f.status === filter) && (!q || f.handle.toLowerCase().includes(q) || f.email.toLowerCase().includes(q)),
  );
  const planLabel = (f: Fan) => (f.tier && f.plan ? `${demo.plans.tiers[f.tier]} · ${demo.plans[f.plan]}` : "—");

  function exportCsv() {
    const blob = new Blob([fansCsv(shown, t.fans.csvHeader)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `fans-${creator.handle}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  }

  const fansTab = (
    <Card
      title={t.tabs.fans}
      text={t.fans.intro}
      aside={
        <div className="flex flex-wrap gap-2">
          <button type="button" className={ghostButton} onClick={() => setMailed(shown.filter((f) => f.marketing).length)}>
            {t.fans.email}
          </button>
          <button type="button" className={accentButton} onClick={exportCsv}>
            <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="currentColor">
              <path d="M9.2 3h1.6v8.1l2.9-2.9 1.1 1.1L10 14.1 5.2 9.3l1.1-1.1 2.9 2.9zM4 15.4h12V17H4z" />
            </svg>
            {t.fans.export}
          </button>
        </div>
      }
    >
      {mailed !== null && (
        <p role="status" className="mb-4 rounded-2xl bg-(--t-accent)/15 px-4 py-3 text-sm">
          {fill(t.fans.emailDone, { n: mailed })}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "active", "trial", "lead", "expired"] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => {
              setFilter(f);
              setMailed(null);
            }}
            className="rounded-full border border-(--t-muted)/30 px-3 py-1.5 text-sm aria-pressed:border-(--t-accent) aria-pressed:bg-(--t-accent) aria-pressed:text-(--t-accent-text)"
          >
            {t.fans.filters[f]}
          </button>
        ))}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.fans.search}
          aria-label={t.fans.search}
          className={`${input} ml-auto w-full sm:w-64`}
        />
      </div>
      <p className="mt-4 text-sm text-(--t-muted)">{fill(t.fans.count, { n: shown.length })}</p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-(--t-muted)">
            <tr>
              {(["fan", "email", "plan", "since", "spent", "source", "marketing"] as const).map((c) => (
                <th key={c} scope="col" className="border-b border-(--t-muted)/20 py-2 pr-4 font-medium">
                  {t.fans.columns[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((f) => (
              <tr key={f.id} className="border-b border-(--t-muted)/10">
                <td className="py-2.5 pr-4">
                  <span className="font-semibold">{f.handle}</span>
                  <span className="ml-2 rounded-full bg-(--t-bg) px-2 py-0.5 text-xs text-(--t-muted)">{t.fans.status[f.status]}</span>
                </td>
                <td className="py-2.5 pr-4 text-(--t-muted)">{f.email}</td>
                <td className="py-2.5 pr-4">{planLabel(f)}</td>
                <td className="py-2.5 pr-4 text-(--t-muted)">{daysAgo(f.daysAgo)}</td>
                <td className="py-2.5 pr-4">{money.format(f.spent)}</td>
                <td className="py-2.5 pr-4 text-(--t-muted)">{t.fans.sources[f.source]}</td>
                <td className="py-2.5 pr-4">{f.marketing ? t.fans.yes : t.fans.no}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="py-6 text-center text-sm text-(--t-muted)">{t.fans.empty}</p>}
      </div>
    </Card>
  );

  // --- Memberships ----------------------------------------------------------
  const [newCode, setNewCode] = useState("");
  const [newPct, setNewPct] = useState(15);
  function addCode(e: FormEvent) {
    e.preventDefault();
    const code = newCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!code || store.codes.some((c) => c.code === code)) return;
    update((s) => ({ ...s, codes: [...s.codes, { code, pct: newPct, uses: 0 }] }));
    setNewCode("");
  }

  const membershipsTab = (
    <div className="flex flex-col gap-5">
      <Card title={t.memberships.tiers} text={t.memberships.tiersText}>
        <div className="grid gap-3 sm:grid-cols-2">
          {tierIds.map((id) => (
            <label key={id} className="flex items-center justify-between gap-3 rounded-2xl border border-(--t-muted)/25 p-4">
              <span>
                <span className="block font-semibold">{demo.plans.tiers[id]}</span>
                <span className="block text-xs text-(--t-muted)">{demo.plans.perks[id]}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm text-(--t-muted)">
                $
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  value={store.tiers[id]}
                  onChange={(e) => update((s) => ({ ...s, tiers: { ...s.tiers, [id]: Math.max(1, Number(e.target.value) || 1) } }))}
                  className={`${input} w-24`}
                />
                {t.memberships.perMonth}
              </span>
            </label>
          ))}
        </div>
      </Card>

      <Card title={t.memberships.bundles} text={t.memberships.bundlesText}>
        <ul className="flex flex-col divide-y divide-(--t-muted)/15">
          {plans.map((p) => {
            const b = store.bundles[p.id];
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-4 py-3">
                <Toggle
                  on={b.on}
                  label={demo.plans[p.id]}
                  onChange={(on) =>
                    update((s) => {
                      const bundles = { ...s.bundles, [p.id]: { ...b, on } };
                      return Object.values(bundles).some((x) => x.on) ? { ...s, bundles } : s;
                    })
                  }
                />
                <span className="w-24 font-semibold">{demo.plans[p.id]}</span>
                {p.months > 1 && (
                  <label className="flex items-center gap-2 text-sm text-(--t-muted)">
                    {t.memberships.discount}
                    <input
                      type="number"
                      min={0}
                      max={70}
                      value={b.pct}
                      onChange={(e) =>
                        update((s) => ({ ...s, bundles: { ...s.bundles, [p.id]: { ...b, pct: Math.min(70, Math.max(0, Number(e.target.value) || 0)) } } }))
                      }
                      className={`${input} w-20`}
                    />
                    %
                  </label>
                )}
                <span className="ml-auto text-sm text-(--t-muted)">{fill(t.memberships.total, { price: money.format(bundlePrice(store, "fan", p.id)) })}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card
        title={t.memberships.trial}
        text={t.memberships.trialText}
        aside={<Toggle on={store.trial.on} label={t.memberships.trialOn} onChange={(on) => update((s) => ({ ...s, trial: { ...s.trial, on } }))} />}
      >
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            {t.memberships.days}
            <select
              value={store.trial.days}
              onChange={(e) => update((s) => ({ ...s, trial: { ...s.trial, days: Number(e.target.value) } }))}
              className={input}
            >
              {[3, 7, 14].map((n) => (
                <option key={n} value={n}>
                  {fill(t.memberships.daysN, { n })}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            {t.memberships.price}
            <select
              value={store.trial.price}
              onChange={(e) => update((s) => ({ ...s, trial: { ...s.trial, price: Number(e.target.value) } }))}
              className={input}
            >
              {[0, 1, 2.99].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? t.memberships.free : money.format(n)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 rounded-2xl bg-(--t-bg) px-4 py-3 text-sm text-(--t-muted)">{t.memberships.rules}</p>
      </Card>

      <Card title={t.memberships.codes} text={t.memberships.codesText}>
        <ul className="flex flex-col divide-y divide-(--t-muted)/15">
          {store.codes.map((c) => (
            <li key={c.code} className="flex items-center gap-4 py-3 text-sm">
              <span className="font-mono font-semibold">{c.code}</span>
              <span>−{c.pct}%</span>
              <span className="text-(--t-muted)">
                {t.memberships.uses}: {c.uses}
              </span>
              <button
                type="button"
                className="ml-auto text-(--t-muted) underline-offset-4 hover:text-(--t-text) hover:underline"
                onClick={() => update((s) => ({ ...s, codes: s.codes.filter((x) => x.code !== c.code) }))}
              >
                {t.memberships.remove}
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addCode} className="mt-4 flex flex-wrap items-center gap-2">
          <input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder={t.memberships.code}
            aria-label={t.memberships.code}
            maxLength={16}
            className={`${input} w-40 uppercase`}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="number"
              min={5}
              max={80}
              value={newPct}
              onChange={(e) => setNewPct(Math.min(80, Math.max(5, Number(e.target.value) || 5)))}
              aria-label={t.memberships.discount}
              className={`${input} w-20`}
            />
            %
          </label>
          <button type="submit" className={accentButton}>
            {t.memberships.add}
          </button>
        </form>
      </Card>
    </div>
  );

  // --- Payments -------------------------------------------------------------
  const feeText = (fee: (typeof processors)[ProcessorId]["fee"]) =>
    fee === "quote" ? t.payments.quote : typeof fee === "number" ? fill(t.payments.from, { pct: pct.format(fee) }) : `${pct.format(fee[0])}–${pct.format(fee[1])}`;
  const pending = Math.round(monthlyRevenue(store) * 0.31 * 100) / 100;

  const paymentsTab = (
    <div className="flex flex-col gap-5">
      <Card title={t.tabs.payments} text={t.payments.intro}>
        <div className="grid gap-3 sm:grid-cols-2">
          {processorIds.map((id) => {
            const p = processors[id];
            const active = store.processor === id;
            return (
              <div key={id} className={`flex flex-col gap-3 rounded-2xl border p-4 ${active ? "border-(--t-accent)" : "border-(--t-muted)/25"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold">{p.name}</span>
                  {active && <span className="rounded-full bg-(--t-accent) px-2.5 py-0.5 text-xs font-semibold text-(--t-accent-text)">{t.payments.active}</span>}
                </div>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-(--t-muted)">{t.payments.fee}</dt>
                    <dd className="font-semibold">{feeText(p.fee)}</dd>
                  </div>
                  <div>
                    <dt className="text-(--t-muted)">{t.payments.reserve}</dt>
                    <dd className="font-semibold">{p.reserve ? fill(t.payments.held, { pct: pct.format(p.reserve[0]), n: p.reserve[1] }) : t.payments.onReview}</dd>
                  </div>
                </dl>
                {!active && (
                  <button type="button" className={`${ghostButton} mt-auto`} onClick={() => update((s) => ({ ...s, processor: id }))}>
                    {t.payments.use}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-(--t-muted)">{t.payments.feeNote}</p>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title={t.payments.descriptor} text={t.payments.descriptorText}>
          <input
            value={store.descriptor}
            maxLength={22}
            onChange={(e) => update((s) => ({ ...s, descriptor: e.target.value.toUpperCase() }))}
            aria-label={t.payments.descriptor}
            className={`${input} w-full font-mono uppercase`}
          />
        </Card>
        <Card title={t.payments.payout}>
          <p className="font-(family-name:--t-font) text-3xl font-semibold">{money.format(pending)}</p>
          <p className="mt-1 text-sm text-(--t-muted)">
            {t.payments.pending} · {processors[store.processor].name} · {fill(t.payments.inDays, { n: 4 })}
          </p>
        </Card>
      </div>
    </div>
  );

  // --- Compliance -------------------------------------------------------------
  const complianceTab = (
    <div className="flex flex-col gap-5">
      <Card title={t.compliance.age} text={t.compliance.ageText}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {regionIds.map((r) => (
            <li key={r} className="flex items-center justify-between gap-3 rounded-2xl border border-(--t-muted)/25 p-4">
              <span>
                <span className="block font-semibold">{demo.ageGate.regions[r]}</span>
                <span className="block text-xs text-(--t-muted)">{store.strictAge[r] ? t.compliance.strict : t.compliance.simple}</span>
              </span>
              <Toggle
                on={store.strictAge[r]}
                label={`${demo.ageGate.regions[r]}: ${t.compliance.strict}`}
                onChange={(on) => update((s) => ({ ...s, strictAge: { ...s.strictAge, [r]: on } }))}
              />
            </li>
          ))}
        </ul>
      </Card>

      <Card
        title={t.compliance.people}
        text={t.compliance.peopleText}
        aside={
          <button type="button" className={ghostButton} onClick={() => setInvited(true)}>
            {invited ? t.compliance.invited : t.compliance.add}
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-(--t-muted)">
              <tr>
                <th scope="col" className="border-b border-(--t-muted)/20 py-2 pr-4 font-medium">{t.compliance.name}</th>
                <th scope="col" className="border-b border-(--t-muted)/20 py-2 pr-4 font-medium">{t.compliance.idCheck}</th>
                <th scope="col" className="border-b border-(--t-muted)/20 py-2 pr-4 font-medium">{t.compliance.consent}</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.name || "creator"} className="border-b border-(--t-muted)/10">
                  <td className="py-2.5 pr-4 font-semibold">{p.name || creator.name}</td>
                  <td className="py-2.5 pr-4">{p.id ? "✓" : t.compliance.pending}</td>
                  <td className="py-2.5 pr-4 text-(--t-muted)">{p.consent ? daysAgo(p.consent) : t.compliance.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t.compliance.reports} text={t.compliance.reportsText}>
        {store.reports.length === 0 && <p className="text-sm text-(--t-muted)">{t.compliance.none}</p>}
        <ul className="flex flex-col gap-3">
          {store.reports.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-(--t-muted)/25 p-4 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{demo.report.reasons[r.reason]}</span>
                <span className="block text-(--t-muted)">
                  {fill(demo.report.postN, { n: r.post })} · {daysAgo(r.daysAgo)}
                  {r.status === "open" && ` · ${fill(t.compliance.due, { n: Math.max(1, 7 - r.daysAgo) })}`}
                </span>
              </span>
              {r.status === "open" ? (
                <span className="flex gap-2">
                  <button type="button" className={accentButton} onClick={() => update((s) => ({ ...s, reports: s.reports.map((x) => (x.id === r.id ? { ...x, status: "removed" } : x)) }))}>
                    {t.compliance.remove}
                  </button>
                  <button type="button" className={ghostButton} onClick={() => update((s) => ({ ...s, reports: s.reports.map((x) => (x.id === r.id ? { ...x, status: "kept" } : x)) }))}>
                    {t.compliance.keep}
                  </button>
                </span>
              ) : (
                <span className="rounded-full bg-(--t-bg) px-3 py-1 text-(--t-muted)">{r.status === "removed" ? t.compliance.removed : t.compliance.kept}</span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card title={t.compliance.records} text={t.compliance.recordsText}>
        <textarea
          value={store.custodian}
          rows={2}
          onChange={(e) => update((s) => ({ ...s, custodian: e.target.value }))}
          aria-label={t.compliance.records}
          className={`${input} w-full`}
        />
      </Card>
    </div>
  );

  const panels: Record<Tab, ReactNode> = { fans: fansTab, memberships: membershipsTab, payments: paymentsTab, compliance: complianceTab };

  return (
    <div style={style} className="min-h-dvh bg-(--t-bg) text-(--t-text)">
      <p className="bg-(--t-surface) px-4 py-2 text-center text-xs text-(--t-muted)">
        {t.notice}{" "}
        <button type="button" onClick={reset} className="underline underline-offset-4 hover:text-(--t-text)">
          {t.reset}
        </button>
      </p>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-center gap-4">
          <div
            className="size-12 rounded-full bg-(--t-surface) bg-cover bg-center"
            style={{ backgroundImage: images.avatar ? `url(${asset(images.avatar)})` : undefined }}
            aria-hidden="true"
          />
          <div>
            <h1 className="font-(family-name:--t-font) text-2xl font-semibold leading-tight">{creator.name}</h1>
            <p className="text-sm text-(--t-muted)">
              {t.title} · @{creator.handle}
            </p>
          </div>
          <Link href={`/${lang}/demo/${template.id}`} className={`${ghostButton} ml-auto`}>
            {demo.bar.fanView}
          </Link>
        </header>

        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl bg-(--t-surface) p-4">
              <dt className="text-sm text-(--t-muted)">{k.label}</dt>
              <dd className="mt-1 font-(family-name:--t-font) text-2xl font-semibold">{k.value}</dd>
            </div>
          ))}
        </dl>

        <div role="tablist" aria-label={t.title} className="mt-6 flex gap-1 overflow-x-auto rounded-full bg-(--t-surface) p-1">
          {tabs.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className="flex-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-(--t-muted) aria-selected:bg-(--t-accent) aria-selected:text-(--t-accent-text)"
            >
              {t.tabs[id]}
              {id === "compliance" && openReports.length > 0 && (
                <span className="ml-1.5 rounded-full bg-red-500 px-1.5 text-xs text-white">{openReports.length}</span>
              )}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-5 pb-16">
          {panels[tab]}
        </div>
      </div>
    </div>
  );
}
