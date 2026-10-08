"use client";

import { useCallback, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { plans, twoColumnFeed, type PlanId, type Template } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { asset } from "@/lib/asset";
import { Modal } from "./modal";

type Props = { template: Template; lang: Locale; t: Dictionary["demo"]; mock: Dictionary["mock"] };

type PostKind = "free" | "locked" | "ppv";
type Post = { image: string; kind: PostKind; photos: number; videos: number; daysAgo: number; pinned?: boolean };
type Checkout = { kind: "sub"; plan: PlanId } | { kind: "ppv"; post: number } | null;

const ppvPrice = 14.99;
const tipAmounts = [5, 10, 20];
const tipGoal = 500;
const ageKey = "demo-age-ok";

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
  const [plan, setPlan] = useState<PlanId>("three");
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

  const selected = plans.find((p) => p.id === plan)!;
  const checkoutPrice = checkout?.kind === "ppv" ? ppvPrice : selected.price;

  function pay(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setProcessing(true);
    const done = checkout;
    setTimeout(() => {
      setProcessing(false);
      setCheckout(null);
      if (done?.kind === "sub") {
        setSubscribed(true);
        setWelcome(true);
      } else if (done?.kind === "ppv") {
        setUnlocked((prev) => new Set(prev).add(done.post));
      }
    }, 1200);
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

  const plansCard = (
    <section aria-labelledby="plans-title" className="rounded-3xl bg-(--t-surface) p-5">
      <h2 id="plans-title" className="font-(family-name:--t-font) text-xl font-semibold">
        {t.plans.title}
      </h2>
      <fieldset className="mt-4 flex flex-col gap-2">
        <legend className="sr-only">{t.plans.title}</legend>
        {plans.map((p) => (
          <label
            key={p.id}
            className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3.5 ${
              plan === p.id ? "border-(--t-accent)" : "border-(--t-muted)/30"
            }`}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="plan"
                value={p.id}
                checked={plan === p.id}
                onChange={() => setPlan(p.id)}
                className="accent-(--t-accent)"
              />
              <span>
                <span className="block font-semibold">{t.plans[p.id]}</span>
                <span className="block text-sm text-(--t-muted)">
                  {fill(t.plans.perMonth, { price: money.format(p.price / p.months) })}
                </span>
              </span>
            </span>
            <span className="text-right">
              <span className="block font-semibold">{money.format(p.price)}</span>
              {p.save > 0 && (
                <span className="block text-xs font-semibold text-(--t-accent)">{fill(t.plans.save, { pct: p.save })}</span>
              )}
            </span>
          </label>
        ))}
      </fieldset>
      <button type="button" className={`${accentButton} mt-4 w-full`} onClick={() => setCheckout({ kind: "sub", plan })}>
        {fill(t.plans.cta, { price: money.format(selected.price) })}
      </button>
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
                        onClick={() => setCheckout(post.kind === "ppv" ? { kind: "ppv", post: i } : { kind: "sub", plan })}
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
              plansCard
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
            <li>{t.footer.report}</li>
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
          <button type="button" className={`${accentButton} w-full`} onClick={() => setCheckout({ kind: "sub", plan })}>
            {fill(t.plans.cta, { price: money.format(selected.price) })}
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
            <p className="flex justify-between rounded-2xl bg-(--t-bg) px-4 py-3">
              <span>{checkout.kind === "sub" ? t.plans[checkout.plan] : t.post.ppvLabel}</span>
              <span className="font-semibold">{money.format(checkoutPrice)}</span>
            </p>
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
                className="mt-1.5 w-full rounded-xl border border-(--t-muted)/40 bg-(--t-bg) px-4 py-3 text-(--t-text) outline-none focus:border-(--t-accent) aria-invalid:border-red-500"
              />
              <p id="demo-email-help" className={`mt-1.5 text-xs ${emailError ? "text-red-500" : "text-(--t-muted)"}`}>
                {emailError ? t.checkout.emailError : t.checkout.emailHint}
              </p>
            </div>
            <ul className="flex flex-col gap-1.5 text-sm text-(--t-muted)">
              <li>{t.checkout.discreet}</li>
              {checkout.kind === "sub" && <li>{t.checkout.cancel}</li>}
            </ul>
            <button type="submit" disabled={processing} className={accentButton}>
              {processing ? t.checkout.processing : fill(t.checkout.pay, { price: money.format(checkoutPrice) })}
            </button>
          </form>
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
              {t.ageGate.title}
            </h2>
            <p className="mt-2 text-sm text-(--t-muted)">{t.ageGate.text}</p>
            <div className="mt-6 flex flex-col gap-2">
              <button type="button" autoFocus className={accentButton} onClick={confirmAge}>
                {t.ageGate.enter}
              </button>
              <Link href={`/${lang}/templates`} className={ghostButton}>
                {t.ageGate.leave}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
