import type { CSSProperties } from "react";

// Class strings shared by the showroom pages.
export const sectionTitle = "font-display text-4xl font-semibold leading-tight text-blush sm:text-5xl";
export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-control) bg-lipstick px-6 py-3.5 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(216,30,79,0.9)] transition hover:-translate-y-0.5 hover:bg-lipstick-deep";
export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-control) border border-blush/40 px-6 py-3.5 font-medium text-blush transition hover:-translate-y-0.5 hover:border-blush hover:bg-blush/10";

// Start delay for `.animate-rise`, `.animate-float` and friends.
export const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;
