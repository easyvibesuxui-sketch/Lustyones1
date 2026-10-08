import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { delay } from "@/lib/ui";
import { CountUp } from "./count-up";

type Props = { t: Dictionary["dashboard"]; lang: Locale };

// Weekly revenue, as a share of the best week.
const weeks = [0.32, 0.38, 0.35, 0.47, 0.52, 0.49, 0.61, 0.66, 0.63, 0.78, 0.86, 1];
const activity = [
  { kind: "sub", fan: "@nightowl", amount: 25.47, minutes: 2 },
  { kind: "tip", fan: "@marco_v", amount: 10, minutes: 9 },
  { kind: "ppv", fan: "@lukas88", amount: 14.99, minutes: 17 },
] as const;

// A made-up day in the creator's admin panel, animated in as the page opens.
export function AdminDashboard({ t, lang }: Props) {
  const money = new Intl.NumberFormat(lang, { style: "currency", currency: "USD" });
  const ago = new Intl.RelativeTimeFormat(lang, { numeric: "auto", style: "short" });
  const kpis = [
    { label: t.revenue, value: 18420, format: { style: "currency", currency: "USD", maximumFractionDigits: 0 } },
    { label: t.subscribers, value: 1284, format: {} },
    { label: t.conversion, value: 0.068, format: { style: "percent", maximumFractionDigits: 1 } },
  ] satisfies { label: string; value: number; format: Intl.NumberFormatOptions }[];

  return (
    <div className="animate-rise rounded-(--radius-panel) border border-plum-line bg-plum/80 p-5 shadow-[0_40px_120px_-40px_rgba(216,30,79,0.45)] backdrop-blur sm:p-7" style={delay(200)}>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-ink">{t.title}</p>
        <p className="flex items-center gap-2 text-sm text-haze">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-lipstick opacity-75" />
            <span className="relative size-2.5 rounded-full bg-lipstick" />
          </span>
          {t.live}
        </p>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {kpis.map((k, i) => (
          <div key={k.label} className="animate-rise rounded-2xl bg-aubergine/70 p-4" style={delay(350 + i * 100)}>
            <dt className="text-sm text-haze">{k.label}</dt>
            <dd className="mt-1 font-display text-4xl font-semibold text-blush">
              <CountUp value={k.value} format={k.format} lang={lang} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <figure className="min-w-0 rounded-2xl bg-aubergine/70 p-4">
          <figcaption className="text-sm text-haze">{t.chart}</figcaption>
          <div className="mt-4 flex h-40 items-end gap-1.5" aria-hidden="true">
            {weeks.map((w, i) => (
              <div
                key={i}
                className="animate-grow flex-1 rounded-t-md bg-gradient-to-t from-lipstick-deep to-[#ff7fa3]"
                style={{ height: `${w * 100}%`, ...delay(500 + i * 60) }}
              />
            ))}
          </div>
        </figure>

        <div className="min-w-0 rounded-2xl bg-aubergine/70 p-4">
          <p className="text-sm text-haze">{t.activity}</p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {activity.map((a, i) => (
              <li key={a.fan} className="animate-rise flex items-center justify-between gap-3 rounded-xl bg-plum px-3 py-2.5" style={delay(900 + i * 150)}>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{t.events[a.kind]}</span>
                  <span className="block truncate text-xs text-haze">
                    {a.fan} · {ago.format(-a.minutes, "minute")}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-blush">+{money.format(a.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
