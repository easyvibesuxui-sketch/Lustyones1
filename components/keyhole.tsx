"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

// A keyhole drawn on a 62 × 100 box: a circle on top of a widening trapezoid.
export const keyholePath = "M31 0a27 27 0 0 1 14 50L58 100H4L17 50A27 27 0 0 1 31 0Z";

type Props = { id: string; src: string; className?: string };

// A sharp photo seen through a keyhole. On devices with a mouse the photo drifts slightly with the pointer.
export function Keyhole({ id, src, className = "" }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", (e.clientX / innerWidth - 0.5).toFixed(3));
        el.style.setProperty("--my", (e.clientY / innerHeight - 0.5).toFixed(3));
      });
    };
    addEventListener("pointermove", move);
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg ref={ref} viewBox="-4 -4 70 108" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <clipPath id={`keyhole-${id}`}>
          <path d={keyholePath} />
        </clipPath>
      </defs>
      {/* A second outline, offset like a shadow of the lock */}
      <path
        d={keyholePath}
        fill="none"
        stroke="rgb(243 236 228 / 0.35)"
        strokeWidth="0.3"
        className="transition-transform duration-700 ease-out"
        style={{ transform: "translate(calc(3px + var(--mx, 0) * 4px), calc(3px + var(--my, 0) * 4px))" }}
      />
      <g clipPath={`url(#keyhole-${id})`}>
        <image
          href={asset(src)}
          x="-6"
          y="-6"
          width="74"
          height="112"
          preserveAspectRatio="xMidYMid slice"
          className="transition-transform duration-700 ease-out"
          style={{ transform: "translate(calc(var(--mx, 0) * -8px), calc(var(--my, 0) * -8px))" }}
        />
      </g>
      <path d={keyholePath} fill="none" stroke="rgb(243 236 228 / 0.85)" strokeWidth="0.35" />
    </svg>
  );
}
