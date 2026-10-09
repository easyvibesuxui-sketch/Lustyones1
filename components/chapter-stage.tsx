"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { asset } from "@/lib/asset";
import { Keyhole } from "./keyhole";
import { LineArrowDown } from "./icons";

export type Slide = { id: string; number?: number; backdrop: string; scene: string; content: ReactNode };

const lockMs = 1100;

// The home page's chapters, one screen at a time. The stage stays pinned while the page scrolls past it;
// each screen-height of scrolling swaps to the next chapter. With a mouse wheel one notch moves one chapter.
// Links with data-enter (set to their route) open through the keyhole: it widens to fill the screen, then the page changes.
export function ChapterStage({ slides }: { slides: Slide[] }) {
  const router = useRouter();
  const wrap = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [entering, setEntering] = useState(-1);
  const activeRef = useRef(0);
  const lockedUntil = useRef(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const last = slides.length - 1;
    const step = () => el.getBoundingClientRect().height / slides.length;

    const onScroll = () => {
      const i = Math.min(Math.max(Math.round(-el.getBoundingClientRect().top / step()), 0), last);
      if (i !== activeRef.current) {
        activeRef.current = i;
        setActive(i);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4 || e.ctrlKey) return;
      const top = el.getBoundingClientRect().top;
      const pinned = top <= 1 && -top <= last * step() + 1;
      if (!pinned) return;
      const target = activeRef.current + Math.sign(e.deltaY);
      if (target < 0 || target > last) return; // let the page scroll on past the stage
      e.preventDefault();
      if (performance.now() < lockedUntil.current) return;
      lockedUntil.current = performance.now() + lockMs;
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: window.scrollY + top + target * step(), behavior: smooth ? "smooth" : "auto" });
    };

    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("wheel", onWheel, { passive: false });
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("wheel", onWheel);
    };
  }, [slides.length]);

  const goTo = (i: number) => {
    const el = wrap.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    window.scrollTo({ top: top + i * (el.offsetHeight / slides.length), behavior: "smooth" });
  };

  const onClick = (e: MouseEvent<HTMLElement>, i: number) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-enter]");
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    setEntering(i);
    window.setTimeout(() => router.push(link.dataset.enter!), 900);
  };

  return (
    <section ref={wrap} className="relative" style={{ height: `${slides.length * 100}svh` }}>
      {/* Anchors for each chapter, at the scroll position that shows it */}
      {slides.map((s, i) => (
        <span key={s.id} id={s.id} className="absolute left-0 h-px w-px" style={{ top: `${i * 100}svh` }} />
      ))}

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="ch absolute inset-0"
            data-active={i === active}
            data-entering={i === entering}
            inert={i !== active}
            onClickCapture={(e) => onClick(e, i)}
          >
            <div aria-hidden="true" className="ch-bg absolute inset-0">
              <div className="flicker absolute inset-0 scale-105 bg-cover bg-center" style={{ backgroundImage: `url(${asset(s.backdrop)})` }} />
              <div className="vignette absolute inset-0" />
            </div>

            <div className="ch-zoom absolute left-1/2 top-[15%] h-[44svh] -translate-x-1/2 lg:left-[62%] lg:top-[19%] lg:h-[62svh]">
              <div className="ch-keyhole h-full">
                <Keyhole id={s.id} src={s.scene} className="h-full w-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.65)]" />
              </div>
            </div>

            {s.number !== undefined && (
              <span
                aria-hidden="true"
                className="ch-num numeral pointer-events-none absolute right-6 top-[12%] text-[5rem] sm:text-[7rem] lg:left-[67%] lg:right-auto lg:top-[50%] lg:text-[9rem]"
              >
                {String(s.number).padStart(2, "0")}
              </span>
            )}

            <div className="ch-content absolute inset-x-5 bottom-[9%] [text-shadow:0_2px_30px_rgb(0_0_0/0.55)] sm:inset-x-10 lg:bottom-auto lg:left-[13%] lg:right-auto lg:top-[36%] lg:w-[min(32rem,36vw)]">
              {s.content}
            </div>
          </div>
        ))}

        {/* The dashed rail; its marker shows where we are */}
        <div aria-hidden="true" className="absolute left-10 top-1/2 hidden h-48 -translate-y-1/2 lg:block">
          <div className="h-full w-3 bg-[repeating-linear-gradient(to_bottom,rgb(243_236_228/0.6)_0_1px,transparent_1px_7px)]" />
          <div
            className="absolute left-0 h-px w-7 bg-heading transition-[top] duration-700 ease-out"
            style={{ top: `${(active / Math.max(slides.length - 1, 1)) * 100}%` }}
          />
          <span
            className="absolute left-9 -translate-y-1/2 font-heading text-xs tracking-widest text-heading transition-[top] duration-700 ease-out"
            style={{ top: `${(active / Math.max(slides.length - 1, 1)) * 100}%` }}
          >
            {String(active + 1).padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => (active < slides.length - 1 ? goTo(active + 1) : goTo(slides.length))}
          className="absolute bottom-10 right-10 hidden text-heading/80 transition hover:translate-y-1 hover:text-accent-soft sm:block"
        >
          <LineArrowDown className="h-14 w-11" />
        </button>
      </div>
    </section>
  );
}
