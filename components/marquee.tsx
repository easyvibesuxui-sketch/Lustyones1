// An endless strip of short phrases. The list is drawn twice so the loop has no seam.
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap">
          <span>{item}</span>
          <svg viewBox="0 0 16 20" width="11" height="14" aria-hidden="true" className="text-accent-soft" fill="currentColor">
            <path d="M8 1a5 5 0 0 0-2.4 9.4L4 19h8l-1.6-8.6A5 5 0 0 0 8 1z" />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-y border-line/60 bg-surface/50 py-5 text-lg text-ink [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
