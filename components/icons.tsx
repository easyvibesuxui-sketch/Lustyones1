export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className={className} fill="currentColor">
      <path d="M6.2 11.6 2.6 8l1.1-1.1 2.5 2.5 6.1-6.1L13.4 4.4z" />
    </svg>
  );
}

export function KeyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 12" width="24" height="10" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="5.5" cy="6" r="4" />
      <path d="M9.5 6H27M22 6v4M25.5 6v3" />
    </svg>
  );
}

// A long hairline arrow pointing down.
export function LineArrowDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" width="60" height="80" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M26 0v52H12l18 26 18-26H34V0z" />
    </svg>
  );
}
