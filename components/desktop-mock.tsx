import { plans, twoColumnFeed, type Template } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { asset } from "@/lib/asset";
import { LockIcon, fontClass, freeTiles, tileBackground, tileCount } from "./phone-mock";

type Props = {
  template: Template;
  mock: Dictionary["mock"];
  planCopy: Dictionary["demo"]["plans"];
  lang: Locale;
  unlocked?: boolean;
};

// The page is drawn as if on a 1280px-wide screen and scales with the frame's width.
const u = (px: number) => `${(px / 12.8).toFixed(3)}cqw`;

// The creator page in a browser window, laid out like the live demo on a laptop.
export function DesktopMock({ template, mock, planCopy, lang, unlocked = false }: Props) {
  const { theme, creator, images } = template;
  const compact = new Intl.NumberFormat(lang, { notation: "compact", maximumFractionDigits: 1 });
  const money = new Intl.NumberFormat(lang, { style: "currency", currency: "USD" });
  const columns = twoColumnFeed.has(template.id) ? 2 : 3;

  return (
    <div
      className="overflow-hidden rounded-xl border border-plum-line bg-plum shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
      aria-hidden="true"
    >
      <div className="@container">
        {/* Browser chrome */}
        <div className="flex items-center" style={{ height: u(44), padding: `0 ${u(18)}`, gap: u(18) }}>
          <div className="flex" style={{ gap: u(8), width: u(60) }}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="rounded-full bg-plum-line" style={{ width: u(12), height: u(12) }} />
            ))}
          </div>
          <div
            className="mx-auto flex flex-1 items-center justify-center rounded-full bg-aubergine text-haze"
            style={{ maxWidth: u(460), height: u(26), gap: u(6), fontSize: u(13) }}
          >
            <LockIcon size={u(12)} />
            {creator.handle}.com
          </div>
          <div style={{ width: u(60) }} />
        </div>

        {/* The creator's page */}
        <div className="relative overflow-hidden" style={{ height: u(756), background: theme.bg, color: theme.text }}>
          <div
            style={{
              height: u(220),
              background: images.cover ? `center / cover url(${asset(images.cover)})` : tileBackground(theme.tones, 3),
            }}
          />
          <div className="mx-auto" style={{ width: u(1024) }}>
            <div className="flex items-end justify-between">
              <div>
                <div
                  className="rounded-full"
                  style={{
                    width: u(112),
                    height: u(112),
                    marginTop: u(-56),
                    border: `${u(4)} solid ${theme.bg}`,
                    background: images.avatar ? `center / cover url(${asset(images.avatar)})` : tileBackground(theme.tones, 7),
                  }}
                />
                <p className={`font-semibold leading-tight ${fontClass[theme.font]}`} style={{ marginTop: u(12), fontSize: u(36) }}>
                  {creator.name}
                </p>
                <p style={{ color: theme.muted, fontSize: u(16) }}>@{creator.handle}</p>
              </div>
              <div
                className="rounded-full font-semibold"
                style={{ background: theme.accent, color: theme.accentText, padding: `${u(9)} ${u(20)}`, fontSize: u(14) }}
              >
                {unlocked ? `✓ ${creator.name}` : mock.subscribe}
              </div>
            </div>
            <div className="flex" style={{ marginTop: u(14), gap: u(24), fontSize: u(14) }}>
              {(
                [
                  [creator.posts, mock.posts],
                  [creator.photos, mock.photos],
                  [creator.videos, mock.videos],
                ] as const
              ).map(([value, label]) => (
                <p key={label} className="flex" style={{ gap: u(6) }}>
                  <span className="font-semibold">{compact.format(value)}</span>
                  <span style={{ color: theme.muted }}>{label}</span>
                </p>
              ))}
            </div>

            <div className="grid" style={{ marginTop: u(28), gap: u(32), gridTemplateColumns: `1fr ${u(320)}` }}>
              <div className="grid content-start" style={{ gap: u(16), gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: tileCount }, (_, i) => {
                  const free = freeTiles.has(i);
                  const locked = !free && !unlocked;
                  const image = images.feed[i];
                  return (
                    <div key={i} className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: u(16) }}>
                      <div
                        className="absolute inset-0 transition-[filter,transform] duration-700 ease-out"
                        style={{
                          background: image ? `center / cover url(${asset(image)})` : tileBackground(theme.tones, i),
                          filter: locked ? `blur(${u(14)}) saturate(1.2)` : "none",
                          transform: locked ? "scale(1.2)" : "scale(1)",
                        }}
                      />
                      {locked && (
                        <div className="absolute inset-0 grid place-items-center" style={{ color: theme.text }}>
                          <LockIcon size={u(30)} />
                        </div>
                      )}
                      {free && (
                        <span
                          className="absolute rounded-full font-semibold"
                          style={{
                            left: u(10),
                            top: u(10),
                            padding: `${u(3)} ${u(9)}`,
                            fontSize: u(12),
                            background: theme.accent,
                            color: theme.accentText,
                          }}
                        >
                          {mock.free}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="self-start" style={{ background: theme.surface, borderRadius: u(24), padding: u(20) }}>
                <p className={`font-semibold ${fontClass[theme.font]}`} style={{ fontSize: u(20) }}>
                  {planCopy.title}
                </p>
                {plans.map((p) => {
                  const picked = p.id === "three";
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between"
                      style={{
                        marginTop: u(10),
                        padding: `${u(12)} ${u(14)}`,
                        borderRadius: u(16),
                        border: `${u(1.5)} solid ${picked ? theme.accent : `${theme.muted}55`}`,
                        fontSize: u(14),
                      }}
                    >
                      <span className="font-semibold">{planCopy[p.id]}</span>
                      <span className="text-right">
                        <span className="block font-semibold">{money.format(p.price)}</span>
                        {p.save > 0 && (
                          <span className="block font-semibold" style={{ color: theme.accent, fontSize: u(12) }}>
                            {planCopy.save.replace("{pct}", String(p.save))}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
                <div
                  className="rounded-full text-center font-semibold"
                  style={{ marginTop: u(14), padding: u(11), fontSize: u(14), background: theme.accent, color: theme.accentText }}
                >
                  {unlocked ? `✓ ${creator.name}` : mock.subscribe}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
