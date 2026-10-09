import type { CSSProperties } from "react";

// Class strings shared by the showroom pages.
export const sectionTitle = "font-heading text-4xl font-bold uppercase leading-[0.95] text-heading sm:text-6xl";
export const primaryButton =
  "inline-flex items-center justify-center gap-3 rounded-(--radius-control) bg-accent px-7 py-3.5 font-heading text-lg font-bold uppercase tracking-wider text-night transition hover:bg-accent-soft";
export const secondaryButton =
  "inline-flex items-center justify-center gap-3 rounded-(--radius-control) border border-heading/50 px-7 py-3.5 font-heading text-lg font-medium uppercase tracking-wider text-heading transition hover:bg-heading hover:text-night";
// An underlined text link with a key, for "enter" actions.
export const keyLink =
  "group inline-flex items-center gap-4 border-b border-heading/70 pb-1.5 font-heading text-lg font-medium uppercase tracking-wider text-heading transition hover:border-accent hover:text-accent-soft";

// Start delay for `.animate-rise`, `.animate-float` and friends.
export const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

// Start delay for pieces of a home-page chapter as it comes on stage (`.ch-in`, `.ch-line`).
export const enterAt = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
