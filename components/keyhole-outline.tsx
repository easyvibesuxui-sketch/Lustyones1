// A keyhole drawn on a 62 × 100 box: a circle on top of a widening trapezoid.
// The same shape is the stage mask in app/globals.css (.ch --keyhole).
export const keyholePath = "M31 0a27 27 0 0 1 14 50L58 100H4L17 50A27 27 0 0 1 31 0Z";

// Just the hairline keyhole, as an ornament.
export function KeyholeOutline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-1 -1 64 102" className={className} aria-hidden="true">
      <path d={keyholePath} fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
