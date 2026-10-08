import { ViewTransition, type ReactNode } from "react";
import { delay } from "@/lib/ui";

// Every showroom page sits in this, so moving between pages animates (see `.page` in globals.css).
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

type HeroProps = { title: string; lead?: string; children?: ReactNode };

// The heading block at the top of an inner page, with drifting light behind it.
export function PageHero({ title, lead, children }: HeroProps) {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true">
        <div className="aurora -left-24 -top-32 size-96 bg-accent" />
        <div className="aurora -right-16 top-0 size-80 bg-violet" style={delay(-6000)} />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
        <h1 className="animate-rise text-shimmer max-w-4xl font-heading text-[2.4rem] font-semibold leading-[1.05] tracking-tight hyphens-auto break-words sm:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="animate-rise mt-6 max-w-2xl text-lg leading-relaxed text-muted" style={delay(120)}>
            {lead}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
