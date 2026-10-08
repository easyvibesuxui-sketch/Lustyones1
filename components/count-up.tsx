"use client";

import { useEffect, useRef } from "react";

type Props = { value: number; format: Intl.NumberFormatOptions; lang: string };

// A number that counts up from zero the first time it scrolls into view.
// The final value is in the HTML, so it reads correctly without JavaScript or with reduced motion.
export function CountUp({ value, format, lang }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fmt = new Intl.NumberFormat(lang, format);
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1400, 1);
        el.textContent = fmt.format(value * (1 - (1 - t) ** 3));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, format, lang]);

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat(lang, format).format(value)}
    </span>
  );
}
