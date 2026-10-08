"use client";

import { useEffect, useState } from "react";

// The dashed rail at the left edge of the home page; its marker follows the chapter in view.
// It repeats what scrolling already shows, so it is hidden from assistive technology.
export function ChapterNav({ ids }: { ids: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(ids.indexOf(entry.target.id));
        }
      },
      { threshold: 0.5 },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return (
    <div aria-hidden="true" className="fixed left-8 top-1/2 z-30 hidden h-56 -translate-y-1/2 lg:block">
      <div className="h-full w-3 bg-[repeating-linear-gradient(to_bottom,rgb(243_236_228/0.6)_0_1px,transparent_1px_7px)]" />
      <div
        className="absolute left-0 h-px w-7 bg-heading transition-[top] duration-500 ease-out"
        style={{ top: `${(active / Math.max(ids.length - 1, 1)) * 100}%` }}
      />
      <span
        className="absolute left-9 -translate-y-1/2 font-heading text-xs tracking-widest text-heading transition-[top] duration-500 ease-out"
        style={{ top: `${(active / Math.max(ids.length - 1, 1)) * 100}%` }}
      >
        {String(active + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
