import { keyholePath } from "./keyhole";

// Just the hairline keyhole, as an ornament.
export function KeyholeOutline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-1 -1 64 102" className={className} aria-hidden="true">
      <path d={keyholePath} fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
