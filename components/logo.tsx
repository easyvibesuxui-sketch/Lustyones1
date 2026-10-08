import { site } from "@/lib/site";

// Wordmark with a keyhole in place of the "o".
export function Logo() {
  return (
    <span className="font-heading text-xl font-semibold tracking-tight text-heading">
      <span aria-hidden="true" className="flex items-baseline">
        <span>Unl</span>
        <svg viewBox="0 0 16 20" width="13" height="17" className="mx-0.5 self-center text-accent-soft" fill="currentColor">
          <path d="M8 1a5 5 0 0 0-2.4 9.4L4 19h8l-1.6-8.6A5 5 0 0 0 8 1z" />
        </svg>
        <span>ckd</span>
      </span>
      <span className="sr-only">{site.name}</span>
    </span>
  );
}
