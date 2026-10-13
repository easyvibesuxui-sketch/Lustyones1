"use client";

import { useCallback, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { plans, twoColumnFeed, type PlanId, type Template } from "@/lib/templates";
import { bundlePrice, regionIds, tierIds, useDemoState, type RegionId, type TierId } from "@/lib/demo-store";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { asset } from "@/lib/asset";
import { Modal } from "./modal";

type Props = { template: Template; lang: Locale; t: Dictionary["demo"]; mock: Dictionary["mock"] };

type PostKind = "free" | "locked" | "ppv";
type Post = { image: string; kind: PostKind; photos: number; videos: number; daysAgo: number; pinned?: boolean };
type Choice = PlanId | "trial";
type Checkout = { kind: "sub"; tier: TierId; plan: Choice } | { kind: "ppv"; post: number } | null;

const ppvPrice = 14.99;
const tipAmounts = [5, 10, 20];
const tipGoal = 500;
const ageKey = "demo-age-ok";
const processorNames = { ccbill: "CCBill", segpay: "Segpay", verotel: "Verotel", epoch: "Epoch" } as const;
const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// A first guess at the visitor's region from their time zone. A live site would use their IP.
function guessRegion(): RegionId {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (zone === "Europe/London") return "uk";
    if (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Detroit|Anchorage|Boise|Indiana|Kentucky)/.test(zone)) return "us";
    if (zone.startsWith("Europe/")) return "eu";
  } catch {
    // No time zone: treat as elsewhere.
  }
  return "other";
}
const noop = () => () => {};

// Which feed position is free, pay-per-view or for subscribers only.
const kinds: PostKind[] = ["locked", "free", "locked", "ppv", "locked", "free", "locked", "locked", "locked"];
const fontVar = { display: "var(--font-display)", body: "var(--font-sans)", bold: "var(--font-wide)" } as const;

function fill(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

// Age-gate answer, kept in localStorage with an in-memory fallback for blocked storage.
let ageOkInMemory = false;
const ageListeners = new Set<() => void>();

function readAgeOk() {
  if (ageOkInMemory) return true;
  try {
    return localStorage.getItem(ageKey) === "1";
  } catch {
    return false;
  }
}

function confirmAge() {
  ageOkInMemory = true;
  try {
    localStorage.setItem(ageKey, "1");
  } catch {
    // Storage blocked: the gate shows again on the next visit.
  }
  ageListeners.forEach((notify) => notify());
}

function subscribeAge(notify: () => void) {
  ageListeners.add(notify);
  window.addEventListener("storage", notify);
  return () => {
    ageListeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
}

function LockIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function DemoSite({ template, lang, t, mock }: Props) {
  const { theme, creator, images } = template;
  const money = new Intl.NumberFormat(lang, { style: "currency", currency: "USD" });
  const compact = new Intl.NumberFormat(lang, { notation: "compact", maximumFractionDigits: 1 });
  const ago = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  const posts: Post[] = images.feed.map((image, i) => ({
    image,
    kind: kinds[i] ?? "locked",
    photos: 6 + ((i * 7) % 18),
    videos: (i * 3) % 4,
    daysAgo: i * 2 + 1,
    pinned: i === 0,
  }));

  // The static HTML always starts with the gate shown.
  const ageOk = useSyncExternalStore(subscribeAge, readAgeOk, () => false);
  const guessedRegion = useSyncExternalStore(noop, guessRegion, () => "other" as RegionId);
  const [regionChoice, setRegionChoice] = useState<RegionId | null>(null);
  const region = regionChoice ?? guessedRegion;
  const [ageMethod, setAgeMethod] = useState<"face" | "id" | null>(null);
  const [ageChecked, setAgeChecked] = useState(false);
  const [store, update] = useDemoState(template.id);
  const [tier, setTier] = useState<TierId>("fan");
  const [plan, setPlan] = useState<Choice>("three");
  const [codeInput, setCodeInput] = useState("");
  const [code, setCode] = useState<{ code: string; pct: number } | null>(null);
  const [codeError, setCodeError] = useState(false);
  const [marketing, setMarketing] = useState(true);
  const [trialOk, setTrialOk] = useState(false);
  const [followEmail, setFollowEmail] = useState("");
  const [followed, setFollowed] = useState(false);
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set());
  const [checkout, setCheckout] = useState<Checkout>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(10);
  const [tipSent, setTipSent] = useState(false);
  const [tipped, setTipped] = useState(320);
  const [votes, setVotes] = useState([128, 96, 74]);
  const [voted, setVoted] = useState<number | null>(null);

  const closeCheckout = useCallback(() => {
    if (!processing) setCheckout(null);
  }, [processing]);
  const closeWelcome = useCallback(() => setWelcome(false), []);
  const closeTip = useCallback(() => {
    setTipOpen(false);
    setTipSent(false);
  }, []);

  const closeRecords = useCallback(() => setRecordsOpen(false), []);
  const closeReport = useCallback(() => {
    setReportOpen(false);
    setReportSent(false);
  }, []);

  // What the fan can pick: the trial (monthly Fan tier only) and the bundles the creator offers.
  const trialOffered = store.trial.on && tier === "fan";
  const offered = plans.filter((p) => store.bundles[p.id].on);
  const choice: Choice = plan === "trial" && !trialOffered ? offered[0]?.id ?? "month" : plan;
  const priceOf = (c: Choice, tr: TierId = tier) => (c === "trial" ? store.trial.price : bundlePrice(store, tr, c));
  const subtotal = checkout?.kind === "ppv" ? ppvPrice : checkout?.kind === "sub" ? priceOf(checkout.plan, checkout.tier) : 0;
  const discount = code && !(checkout?.kind === "sub" && checkout.plan === "trial") ? Math.round(subtotal * code.pct) / 100 : 0;
  const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
  const isTrial = checkout?.kind === "sub" && checkout.plan === "trial";
  const choiceLabel = (c: Choice) => (c === "trial" ? fill(t.plans.trial, { days: store.trial.days, price: money.format(store.trial.price) }) : t.plans[c]);

  function applyCode() {
    const found = store.codes.find((c) => c.code === codeInput.trim().toUpperCase());
    setCode(found ? { code: found.code, pct: found.pct } : null);
    setCodeError(!found);
  }

  function pay(e: FormEvent) {
    e.preventDefault();
    if (!validEmail(email)) {
      setEmailError(true);
      return;
    }
    if (isTrial && !trialOk) return;
    setEmailError(false);
    setProcessing(true);
    const done = checkout;
    const paid = total;
    const usedCode = discount > 0 ? code?.code : undefined;
    setTimeout(() => {
      setProcessing(false);
      setCheckout(null);
      // The payment lands in the creator's fan list, as it would on a live site.
      update((st) => {
        const others = st.fans.filter((f) => f.email !== email);
        const before = st.fans.find((f) => f.email === email);
        const fan = {
          id: `fan-${Date.now()}`,
          handle: before?.handle ?? `@${email.split("@")[0]}`,
          email,
          status: before?.status ?? ("lead" as const),
          tier: before?.tier,
          plan: before?.plan,
          daysAgo: 0,
          spent: (before?.spent ?? 0) + paid,
          source: before?.source ?? ("direct" as const),
          marketing,
        };
        if (done?.kind === "sub") {
          fan.status = done.plan === "trial" ? "trial" : "active";
          fan.tier = done.tier;
          fan.plan = done.plan === "trial" ? "month" : done.plan;
        }
        const codes = st.codes.map((c) => (c.code === usedCode ? { ...c, uses: c.uses + 1 } : c));
        return { ...st, fans: [fan, ...others], codes };
      });
      if (done?.kind === "sub") {
        setSubscribed(true);
        setWelcome(true);
      } else if (done?.kind === "ppv") {
        setUnlocked((prev) => new Set(prev).add(done.post));
      }
    }, 1200);
  }

  function follow(e: FormEvent) {
    e.preventDefault();
    if (!validEmail(followEmail)) return;
    update((st) =>
      st.fans.some((f) => f.email === followEmail)
        ? st
        : {
            ...st,
            fans: [
              { id: `lead-${Date.now()}`, handle: `@${followEmail.split("@")[0]}`, email: followEmail, status: "lead", daysAgo: 0, spent: 0, source: "direct", marketing: true },
              ...st.fans,
            ],
          },
    );
    setFollowed(true);
  }

  function sendReport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    update((st) => ({
      ...st,
      reports: [{ id: `r-${Date.now()}`, reason: Number(d.get("reason")), post: Number(d.get("post")), daysAgo: 0, status: "open" }, ...st.reports],
    }));
    setReportSent(true);
  }

  function verifyAge(method: "face" | "id") {
    setAgeMethod(method);
    setTimeout(() => setAgeChecked(true), 1400);
    setTimeout(confirmAge, 2200);
  }

  function sendTip() {
    setTipped((v) => Math.min(tipGoal, v + tipAmount));
    setTipSent(true);
  }

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
    "inline-flex items-center justify-center rounded-full bg-(--t-accent) px-5 py-3 font-semibold text-(--t-accent-text) hover:opacity-90 disabled:opacity-60";
  const ghostButton =
    "inline-flex items-center justify-center rounded-full border border-(--t-muted)/40 px-5 py-3 font-medium hover:border-(--t-text)";

  const field =
    "w-full rounded-xl border border-(--t-muted)/40 bg-(--t-bg) px-4 py-3 text-(--t-text) outline-none focus:border-(--t-accent)";

  const planOption = (c: Choice, price: number, note: string, save?: number) => (
    <label
      key={c}
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3.5 ${
        choice === c ? "border-(--t-accent)" : "border-(--t-muted)/30"
      }`}
    >
      <span className="flex items-center gap-3">
        <input type="radio" name="plan" value={c} checked={choice === c} onChange={() => setPlan(c)} className="accent-(--t-accent)" />
        <span>
          <span className="flex items-center gap-2 font-semibold">
            {c === "trial" ? t.plans.trialBadge : t.plans[c]}
          </span>
          <span className="block text-sm text-(--t-muted)">{note}</span>
        </span>
      </span>
      <span className="text-right">
        <span className="block font-semibold">{money.format(price)}</span>
        {save !== undefined && save > 0 && (
          <span className="block text-xs font-semibold text-(--t-accent)">{fill(t.plans.save, { pct: save })}</span>
        )}
      </span>
    </label>
  );

  const plansCard = (
    <section aria-labelledby="plans-title" className="rounded-3xl bg-(--t-surface) p-5">
      <h2 id="plans-title" className="font-(family-name:--t-font) text-xl font-semibold">
        {t.plans.title}
      </h2>
      <div role="radiogroup" aria-label={t.plans.title} className="mt-4 grid grid-cols-2 rounded-full bg-(--t-bg) p-1">
        {tierIds.map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={tier === id}
            onClick={() => setTier(id)}
            className="rounded-full py-2 text-sm font-semibold text-(--t-muted) aria-checked:bg-(--t-accent) aria-checked:text-(--t-accent-text)"
          >
            {t.plans.tiers[id]}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-(--t-muted)">{t.plans.perks[tier]}</p>
      <fieldset className="mt-4 flex flex-col gap-2">
        <legend className="sr-only">{t.plans.title}</legend>
        {trialOffered &&
          planOption(
            "trial",
            store.trial.price,
            `${fill(t.plans.trial, { days: store.trial.days, price: money.format(store.trial.price) })}. ${fill(t.plans.trialThen, { price: money.format(store.tiers.fan) })}`,
          )}
        {offered.map((p) =>
          planOption(p.id, bundlePrice(store, tier, p.id), fill(t.plans.perMonth, { price: money.format(bundlePrice(store, tier, p.id) / p.months) }), store.bundles[p.id].pct),
        )}
      </fieldset>
      <button type="button" className={`${accentButton} mt-4 w-full`} onClick={() => setCheckout({ kind: "sub", tier, plan: choice })}>
        {fill(t.plans.cta, { price: money.format(priceOf(choice)) })}
      </button>
    </section>
  );

  const followCard = (
    <section aria-labelledby="follow-title" className="rounded-3xl border border-(--t-muted)/25 p-5">
      <h2 id="follow-title" className="font-semibold">
        {t.follow.title}
      </h2>
      {followed ? (
        <p role="status" className="mt-2 text-sm text-(--t-muted)">
          {t.follow.done}
        </p>
      ) : (
        <form onSubmit={follow} className="mt-2 flex flex-col gap-3">
          <p className="text-sm text-(--t-muted)">{t.follow.text}</p>
          <input
            type="email"
            required
            value={followEmail}
            onChange={(e) => setFollowEmail(e.target.value)}
            aria-label={t.follow.email}
            placeholder={t.follow.email}
            className={field}
          />
          <label className="flex gap-2 text-xs text-(--t-muted)">
            <input type="checkbox" required className="mt-0.5 accent-(--t-accent)" />
            {t.follow.consent}
          </label>
          <button type="submit" className={ghostButton}>
            {t.follow.button}
          </button>
        </form>
      )}
    </section>
  );

  const tipCard = (
    <section aria-labelledby="tip-title" className="rounded-3xl bg-(--t-surface) p-5">
      <h2 id="tip-title" className="font-semibold">
        {t.tip.goal}
      </h2>
      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-(--t-bg)"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={tipGoal}
        aria-valuenow={tipped}
        aria-label={t.tip.goal}
      >
        <div className="h-full rounded-full bg-(--t-accent) transition-[width] duration-500" style={{ width: `${(tipped / tipGoal) * 100}%` }} />
      </div>
      <p className="mt-2 text-sm text-(--t-muted)">{fill(t.tip.progress, { pct: Math.round((tipped / tipGoal) * 100) })}</p>
      <button type="button" className={`${accentButton} mt-4 w-full`} onClick={() => setTipOpen(true)}>
        {t.tip.button}
      </button>
    </section>
  );

  const totalVotes = votes.reduce((a, b) => a + b, 0);
  const pollCard = (
    <section aria-labelledby="poll-title" className="rounded-3xl bg-(--t-surface) p-5">
      <h2 id="poll-title" className="font-semibold">
        {t.poll.title}
      </h2>
      <ul className="mt-3 flex flex-col gap-2">
        {t.poll.options.map((option, i) => {
          const pct = Math.round((votes[i] / totalVotes) * 100);
          return (
            <li key={option}>
              <button
                type="button"
                aria-pressed={voted === i}
                disabled={voted !== null}
                onClick={() => {
                  setVotes((v) => v.map((n, k) => (k === i ? n + 1 : n)));
                  setVoted(i);
                }}
                className="relative w-full overflow-hidden rounded-xl border border-(--t-muted)/30 px-3 py-2.5 text-left text-sm enabled:hover:border-(--t-accent) aria-pressed:border-(--t-accent)"
              >
                {voted !== null && (
                  <span className="absolute inset-y-0 left-0 bg-(--t-accent)/20" style={{ width: `${pct}%` }} aria-hidden="true" />
                )}
                <span className="relative flex justify-between gap-2">
                  <span>{option}</span>
                  {voted !== null && <span className="font-semibold">{pct}%</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-(--t-muted)" aria-live="polite">
        {voted !== null ? t.poll.thanks : fill(t.poll.votes, { n: totalVotes })}
      </p>
    </section>
  );

  return (
    <div style={style} className="min-h-dvh bg-(--t-bg) pb-24 text-(--t-text) lg:pb-0">
      <p className="bg-(--t-surface) px-4 py-2 text-center text-xs text-(--t-muted)">{t.notice}</p>

      {/* Profile */}
      <div
        className="h-44 bg-cover bg-center sm:h-64"
        style={{ backgroundImage: images.cover ? `url(${asset(images.cover)})` : undefined }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div
              className="-mt-14 size-28 rounded-full border-4 border-(--t-bg) bg-(--t-surface) bg-cover bg-center"
              style={{ backgroundImage: images.avatar ? `url(${asset(images.avatar)})` : undefined }}
              role="img"
              aria-label={creator.name}
            />
            <h1 className="mt-3 font-(family-name:--t-font) text-4xl font-semibold leading-tight">{creator.name}</h1>
            <p className="text-(--t-muted)">@{creator.handle}</p>
          </div>
          {subscribed && (
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-(--t-accent) px-4 py-2 text-sm font-semibold text-(--t-accent-text) sm:self-auto">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
                <path d="M6.2 11.6 2.6 8l1.1-1.1 2.5 2.5 6.1-6.1L13.4 4.4z" />
              </svg>
              {t.subscribed}
            </span>
          )}
        </div>
        <p className="mt-4 max-w-xl text-lg">{t.bios[template.id]}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-(--t-muted)">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="4.5" width="14" height="12" rx="2" />
            <path d="M3 8.5h14M7 2.5v4M13 2.5v4" />
          </svg>
          {t.schedule}
        </p>
        <dl className="mt-4 flex gap-6 text-sm">
          {(
            [
              [creator.posts, mock.posts],
              [creator.photos, mock.photos],
              [creator.videos, mock.videos],
            ] as const
          ).map(([value, label]) => (
            <div key={label} className="flex gap-1.5">
              <dt className="sr-only">{label}</dt>
              <dd className="font-semibold">{compact.format(value)}</dd>
              <dd className="text-(--t-muted)">{label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid gap-8 pb-16 lg:grid-cols-[1fr_320px]">
          {/* Feed */}
          <div className={`grid content-start gap-4 ${twoColumnFeed.has(template.id) ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
            {posts.map((post, i) => {
              const open = post.kind === "free" || (post.kind === "locked" && subscribed) || (post.kind === "ppv" && unlocked.has(i));
              return (
                <article key={i} className="flex flex-col gap-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-(--t-surface)">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-[filter,transform] duration-700"
                      style={{
                        backgroundImage: `url(${asset(post.image)})`,
                        filter: open ? "none" : "blur(18px)",
                        transform: open ? "scale(1)" : "scale(1.15)",
                      }}
                    />
                    <div className="absolute left-2 top-2 flex gap-1.5">
                      {post.pinned && (
                        <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">{t.post.pinned}</span>
                      )}
                      {post.kind === "free" && (
                        <span className="rounded-full bg-(--t-accent) px-2 py-0.5 text-[11px] font-semibold text-(--t-accent-text)">
                          {t.post.free}
                        </span>
                      )}
                      {post.kind === "ppv" && (
                        <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">{t.post.ppvLabel}</span>
                      )}
                    </div>
                    {!open && (
                      <button
                        type="button"
                        onClick={() => setCheckout(post.kind === "ppv" ? { kind: "ppv", post: i } : { kind: "sub", tier, plan: choice })}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/25 p-3 text-center text-sm font-semibold text-white"
                      >
                        <LockIcon />
                        {post.kind === "ppv" ? fill(t.post.ppv, { price: money.format(ppvPrice) }) : t.post.locked}
                      </button>
                    )}
                  </div>
                  <p className="flex flex-wrap justify-between gap-x-2 text-xs text-(--t-muted)">
                    <span>{ago.format(-post.daysAgo, "day")}</span>
                    <span className="flex gap-3">
                      <span className="flex items-center gap-1">
                        <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
                          <circle cx="10" cy="10" r="2.8" />
                        </svg>
                        {post.photos}
                        <span className="sr-only">{mock.photos}</span>
                      </span>
                      {post.videos > 0 && (
                        <span className="flex items-center gap-1">
                          <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true" fill="currentColor">
                            <path d="M6 4.5v11l9-5.5z" />
                          </svg>
                          {post.videos}
                          <span className="sr-only">{mock.videos}</span>
                        </span>
                      )}
                    </span>
                  </p>
                </article>
              );
            })}
          </div>

          {/* Sidebar: plans before subscribing, tips and poll after */}
          <aside className="order-first flex flex-col gap-4 lg:sticky lg:top-16 lg:order-none lg:self-start">
            {subscribed ? (
              <>
                {tipCard}
                {pollCard}
              </>
            ) : (
              <>
                {plansCard}
                {followCard}
              </>
            )}
          </aside>
        </div>
      </div>

      <footer className="border-t border-(--t-muted)/20">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-(--t-muted) sm:px-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li>{t.footer.terms}</li>
            <li>{t.footer.privacy}</li>
            <li>{t.footer.ai}</li>
            <li>
              <button type="button" className="underline-offset-4 hover:text-(--t-text) hover:underline" onClick={() => setRecordsOpen(true)}>
                {t.footer.records}
              </button>
            </li>
            <li>
              <button type="button" className="underline-offset-4 hover:text-(--t-text) hover:underline" onClick={() => setReportOpen(true)}>
                {t.footer.report}
              </button>
            </li>
          </ul>
          <p>{t.footer.note}</p>
        </div>
      </footer>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-(--t-muted)/20 bg-(--t-bg)/95 p-3 backdrop-blur lg:hidden">
        {subscribed ? (
          <button type="button" className={`${accentButton} w-full`} onClick={() => setTipOpen(true)}>
            {t.tip.button}
          </button>
        ) : (
          <button type="button" className={`${accentButton} w-full`} onClick={() => setCheckout({ kind: "sub", tier, plan: choice })}>
            {fill(t.plans.cta, { price: money.format(priceOf(choice)) })}
          </button>
        )}
      </div>

      {checkout && (
        <Modal
          title={checkout.kind === "sub" ? fill(t.checkout.titleSub, { name: creator.name }) : t.checkout.titlePpv}
          onClose={closeCheckout}
          closeLabel={t.checkout.close}
        >
          <form onSubmit={pay} noValidate className="flex flex-col gap-4">
            <div className="rounded-2xl bg-(--t-bg) px-4 py-3 text-sm">
              <p className="flex justify-between gap-3">
                <span>{checkout.kind === "sub" ? `${t.plans.tiers[checkout.tier]} · ${choiceLabel(checkout.plan)}` : t.post.ppvLabel}</span>
                <span>{money.format(subtotal)}</span>
              </p>
              {discount > 0 && (
                <p className="mt-1 flex justify-between gap-3 text-(--t-accent)">
                  <span>{code?.code}</span>
                  <span>−{money.format(discount)}</span>
                </p>
              )}
              <p className="mt-2 flex justify-between gap-3 border-t border-(--t-muted)/20 pt-2 text-base font-semibold">
                <span>{t.checkout.total}</span>
                <span>{money.format(total)}</span>
              </p>
            </div>
            {!isTrial && (
              <div>
                <label htmlFor="demo-code" className="text-sm font-semibold">
                  {t.checkout.code}
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    id="demo-code"
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value);
                      setCodeError(false);
                    }}
                    placeholder="WELCOME20"
                    aria-invalid={codeError}
                    aria-describedby="demo-code-help"
                    className={`${field} uppercase aria-invalid:border-red-500`}
                  />
                  <button type="button" onClick={applyCode} className={`${ghostButton} shrink-0 px-4`}>
                    {t.checkout.apply}
                  </button>
                </div>
                <p id="demo-code-help" aria-live="polite" className={`mt-1.5 text-xs ${codeError ? "text-red-500" : "text-(--t-accent)"}`}>
                  {codeError ? t.checkout.codeBad : code ? fill(t.checkout.codeOk, { code: code.code, pct: code.pct }) : ""}
                </p>
              </div>
            )}
            <div>
              <label htmlFor="demo-email" className="text-sm font-semibold">
                {t.checkout.email}
              </label>
              <input
                id="demo-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                aria-invalid={emailError}
                aria-describedby="demo-email-help"
                className={`${field} mt-1.5 aria-invalid:border-red-500`}
              />
              <p id="demo-email-help" className={`mt-1.5 text-xs ${emailError ? "text-red-500" : "text-(--t-muted)"}`}>
                {emailError ? t.checkout.emailError : t.checkout.emailHint}
              </p>
            </div>
            <label className="flex gap-2.5 text-sm text-(--t-muted)">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 accent-(--t-accent)" />
              {t.checkout.marketing}
            </label>
            {isTrial && (
              <label className="flex gap-2.5 text-sm">
                <input type="checkbox" required checked={trialOk} onChange={(e) => setTrialOk(e.target.checked)} className="mt-0.5 accent-(--t-accent)" />
                {fill(t.checkout.trialConsent, { days: store.trial.days, price: money.format(store.tiers.fan) })}
              </label>
            )}
            <ul className="flex flex-col gap-1.5 text-xs text-(--t-muted)">
              <li className="flex items-center gap-1.5 font-semibold text-(--t-text)">
                <LockIcon size={14} />
                {fill(t.checkout.secure, { processor: processorNames[store.processor] })}
              </li>
              <li>{fill(t.checkout.discreet, { descriptor: store.descriptor })}</li>
              {checkout.kind === "sub" && <li>{isTrial ? t.checkout.trialReminder : t.checkout.cancel}</li>}
            </ul>
            <button type="submit" disabled={processing || (isTrial && !trialOk)} className={accentButton}>
              {processing ? t.checkout.processing : fill(t.checkout.pay, { price: money.format(total) })}
            </button>
          </form>
        </Modal>
      )}

      {recordsOpen && (
        <Modal title={t.records.title} onClose={closeRecords} closeLabel={t.checkout.close}>
          <p className="text-sm text-(--t-muted)">{t.records.text}</p>
          <p className="mt-3 rounded-2xl bg-(--t-bg) px-4 py-3 text-sm">{store.custodian}</p>
        </Modal>
      )}

      {reportOpen && (
        <Modal title={t.report.title} onClose={closeReport} closeLabel={t.checkout.close}>
          {reportSent ? (
            <p role="status" className="text-(--t-muted)">
              {t.report.sent}
            </p>
          ) : (
            <form onSubmit={sendReport} className="flex flex-col gap-4">
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-semibold">{t.report.reason}</legend>
                {t.report.reasons.map((r, k) => (
                  <label key={r} className="flex gap-2.5 text-sm">
                    <input type="radio" name="reason" value={k} required defaultChecked={k === 0} className="mt-0.5 accent-(--t-accent)" />
                    {r}
                  </label>
                ))}
              </fieldset>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                {t.report.post}
                <select name="post" className={field}>
                  {posts.map((_, k) => (
                    <option key={k} value={k + 1}>
                      {fill(t.report.postN, { n: k + 1 })}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                {t.report.details}
                <textarea name="details" rows={3} className={field} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                {t.report.email}
                <input name="email" type="email" required className={field} />
              </label>
              <button type="submit" className={accentButton}>
                {t.report.send}
              </button>
            </form>
          )}
        </Modal>
      )}

      {welcome && (
        <Modal title={t.welcome.title} onClose={closeWelcome} closeLabel={t.checkout.close}>
          <p className="text-(--t-muted)">{t.welcome.text}</p>
          <button type="button" className={`${accentButton} mt-5 w-full`} onClick={closeWelcome}>
            {t.welcome.ok}
          </button>
        </Modal>
      )}

      {tipOpen && (
        <Modal title={fill(t.tip.title, { name: creator.name })} onClose={closeTip} closeLabel={t.checkout.close}>
          {tipSent ? (
            <p className="text-lg" role="status">
              {t.tip.thanks}
            </p>
          ) : (
            <>
              <div role="radiogroup" aria-label={t.tip.button} className="grid grid-cols-3 gap-2">
                {tipAmounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    role="radio"
                    aria-checked={tipAmount === a}
                    onClick={() => setTipAmount(a)}
                    className="rounded-2xl border border-(--t-muted)/40 py-3 font-semibold aria-checked:border-(--t-accent) aria-checked:bg-(--t-accent) aria-checked:text-(--t-accent-text)"
                  >
                    {money.format(a)}
                  </button>
                ))}
              </div>
              <button type="button" className={`${accentButton} mt-4 w-full`} onClick={sendTip}>
                {fill(t.tip.send, { amount: money.format(tipAmount) })}
              </button>
            </>
          )}
        </Modal>
      )}

      {!ageOk && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-(--t-bg)/90 p-4 backdrop-blur-xl">
          <div role="dialog" aria-modal="true" aria-labelledby="age-title" className="w-full max-w-sm rounded-3xl bg-(--t-surface) p-7 text-center">
            <p className="font-(family-name:--t-font) text-5xl font-semibold text-(--t-accent)">18+</p>
            <h2 id="age-title" className="mt-3 text-xl font-semibold">
              {store.strictAge[region] ? t.ageGate.strictTitle : t.ageGate.title}
            </h2>
            <p className="mt-2 text-sm text-(--t-muted)">{store.strictAge[region] ? t.ageGate.strictText : t.ageGate.text}</p>
            <label className="mt-5 flex items-center justify-between gap-3 text-left text-sm">
              <span className="text-(--t-muted)">{t.ageGate.region}</span>
              <select
                value={region}
                onChange={(e) => setRegionChoice(e.target.value as RegionId)}
                disabled={ageMethod !== null}
                className="rounded-full border border-(--t-muted)/40 bg-(--t-bg) px-3 py-1.5 text-(--t-text)"
              >
                {regionIds.map((r) => (
                  <option key={r} value={r}>
                    {t.ageGate.regions[r]}
                  </option>
                ))}
              </select>
            </label>
            {store.strictAge[region] ? (
              ageMethod ? (
                <p role="status" className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-(--t-bg) px-4 py-4 font-semibold">
                  {ageChecked ? (
                    <>
                      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor" className="text-(--t-accent)">
                        <path d="M6.2 11.6 2.6 8l1.1-1.1 2.5 2.5 6.1-6.1L13.4 4.4z" />
                      </svg>
                      {t.ageGate.verified}
                    </>
                  ) : (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-(--t-accent) border-t-transparent" aria-hidden="true" />
                      {t.ageGate.checking}
                    </>
                  )}
                </p>
              ) : (
                <div className="mt-6 flex flex-col gap-2 text-left">
                  {(["face", "id"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => verifyAge(m)}
                      className="rounded-2xl border border-(--t-muted)/40 px-4 py-3 hover:border-(--t-accent)"
                    >
                      <span className="block font-semibold">{t.ageGate[m]}</span>
                      <span className="block text-sm text-(--t-muted)">{t.ageGate[m === "face" ? "faceText" : "idText"]}</span>
                    </button>
                  ))}
                  <p className="mt-1 text-center text-xs text-(--t-muted)">{t.ageGate.demoNote}</p>
                  <Link href={`/${lang}/templates`} className={`${ghostButton} mt-2`}>
                    {t.ageGate.leave}
                  </Link>
                </div>
              )
            ) : (
              <div className="mt-6 flex flex-col gap-2">
                <button type="button" autoFocus className={accentButton} onClick={confirmAge}>
                  {t.ageGate.enter}
                </button>
                <Link href={`/${lang}/templates`} className={ghostButton}>
                  {t.ageGate.leave}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
