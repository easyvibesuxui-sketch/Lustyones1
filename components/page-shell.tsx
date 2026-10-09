import { ViewTransition, type ReactNode } from "react";
import { asset } from "@/lib/asset";
import { delay } from "@/lib/ui";

// Every showroom page sits in this, so moving between pages animates (see `.page` in globals.css).
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

// A blurred photo behind a section, darkened at the edges.
export function Backdrop({ src }: { src: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 scale-110 bg-cover bg-center" style={{ backgroundImage: `url(${asset(src)})` }} />
      <div className="vignette absolute inset-0" />
    </div>
  );
}

type HeroProps = { title: string; lead?: string; number?: number; backdrop?: string; children?: ReactNode };

// The opening of an inner page: chapter number, condensed title, serif lead.
export function PageHero({ title, lead, number, backdrop, children }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {backdrop && <Backdrop src={backdrop} />}
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-40 sm:px-10 sm:pb-28 sm:pt-56">
        {number !== undefined && (
          <span aria-hidden="true" className="numeral parallax pointer-events-none absolute right-4 top-24 text-[6rem] sm:right-10 sm:text-[10rem]">
            {String(number).padStart(2, "0")}
          </span>
        )}
        <h1 className="animate-rise relative max-w-3xl font-heading text-4xl font-bold uppercase leading-[1] text-heading hyphens-auto break-words sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="animate-rise relative mt-8 max-w-xl font-body text-base leading-relaxed text-ink/90 sm:text-lg" style={delay(120)}>
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
