import type { CSSProperties } from "react";

// Class strings shared by the showroom pages.
export const sectionTitle = "font-heading text-3xl font-semibold leading-tight tracking-tight text-heading sm:text-4xl";
export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-control) bg-[linear-gradient(110deg,var(--color-accent),var(--color-violet))] px-6 py-3.5 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(227,23,91,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-10px_rgba(124,92,255,0.9)]";
export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-control) border border-heading/25 bg-white/[0.03] px-6 py-3.5 font-medium text-heading backdrop-blur transition hover:-translate-y-0.5 hover:border-heading/60 hover:bg-white/10";

// Start delay for `.animate-rise`, `.animate-float` and friends.
export const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;
