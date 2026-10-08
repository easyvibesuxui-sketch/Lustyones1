import type { Template } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { asset } from "@/lib/asset";

type Props = {
  template: Template;
  mock: Dictionary["mock"];
  lang: Locale;
  unlocked?: boolean;
  size?: "large" | "small";
};

// Posts shown free in the preview grid; the rest are locked.
const freeTiles = new Set([1, 5]);
const tileCount = 9;

const fontClass = { display: "font-display", body: "font-sans", bold: "font-wide" } as const;

// Abstract stand-ins for photos until the demo images are added.
function tileBackground(tones: [string, string, string], i: number) {
  const [a, b, c] = tones;
  const x = 20 + ((i * 37) % 60);
  const y = 25 + ((i * 53) % 50);
  return `radial-gradient(circle at ${x}% ${y}%, ${c} 0%, transparent 45%), radial-gradient(circle at ${100 - x}% ${100 - y}%, ${b} 0%, transparent 55%), ${a}`;
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function PhoneMock({ template, mock, lang, unlocked = false, size = "large" }: Props) {
  const { theme, creator, images } = template;
  const compact = new Intl.NumberFormat(lang, { notation: "compact", maximumFractionDigits: 1 });
  const small = size === "small";

  return (
    <div
      className={`relative overflow-hidden rounded-(--radius-device) border border-plum-line shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] ${
        small ? "h-[440px] w-[220px]" : "h-[580px] w-[290px]"
      }`}
      style={{ background: theme.bg, color: theme.text }}
      aria-hidden="true"
    >
      <div
        className={small ? "h-16" : "h-24"}
        style={{
          background: images.cover ? `center / cover url(${asset(images.cover)})` : tileBackground(theme.tones, 3),
        }}
      />
      <div className={small ? "px-3" : "px-4"}>
        <div
          className={`-mt-7 rounded-full border-4 ${small ? "size-12" : "size-16"}`}
          style={{
            borderColor: theme.bg,
            background: images.avatar ? `center / cover url(${asset(images.avatar)})` : tileBackground(theme.tones, 7),
          }}
        />
        <p className={`mt-2 leading-tight ${fontClass[theme.font]} ${small ? "text-base" : "text-xl"} font-semibold`}>
          {creator.name}
        </p>
        <p className="text-xs" style={{ color: theme.muted }}>
          @{creator.handle}
        </p>
        <dl className={`mt-3 flex gap-3 ${small ? "text-[10px]" : "text-xs"}`}>
          {(
            [
              [creator.posts, mock.posts],
              [creator.photos, mock.photos],
              [creator.videos, mock.videos],
            ] as const
          ).map(([value, label]) => (
            <div key={label} className="flex gap-1">
              <dt className="sr-only">{label}</dt>
              <dd className="font-semibold">{compact.format(value)}</dd>
              <dd style={{ color: theme.muted }}>{label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={`mt-3 grid grid-cols-3 gap-0.5 ${small ? "" : "mt-4"}`}>
        {Array.from({ length: tileCount }, (_, i) => {
          const free = freeTiles.has(i);
          const locked = !free && !unlocked;
          const image = images.feed[i];
          return (
            <div key={i} className="relative aspect-[4/5] overflow-hidden">
              <div
                className="absolute inset-0 transition-[filter,transform] duration-700 ease-out"
                style={{
                  background: image ? `center / cover url(${asset(image)})` : tileBackground(theme.tones, i),
                  filter: locked ? "blur(10px) saturate(1.2)" : "none",
                  transform: locked ? "scale(1.2)" : "scale(1)",
                }}
              />
              {locked && (
                <div className="absolute inset-0 grid place-items-center" style={{ color: theme.text }}>
                  <LockIcon />
                </div>
              )}
              {free && (
                <span
                  className="absolute left-1 top-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                  style={{ background: theme.accent, color: theme.accentText }}
                >
                  {mock.free}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3" style={{ background: `linear-gradient(transparent, ${theme.bg} 40%)` }}>
        <div
          className={`rounded-full text-center font-semibold ${small ? "py-2 text-xs" : "py-3 text-sm"}`}
          style={{ background: theme.accent, color: theme.accentText }}
        >
          {unlocked ? `✓ ${creator.name}` : mock.subscribe}
        </div>
        {!unlocked && !small && (
          <p className="mt-1.5 text-center text-[10px]" style={{ color: theme.muted }}>
            {mock.locked}
          </p>
        )}
      </div>
    </div>
  );
}
