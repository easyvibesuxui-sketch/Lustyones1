"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  title: string;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
};

// A dialog in the creator site's theme: Escape and the close button dismiss it,
// focus moves inside on open and returns to where it was on close.
export function Modal({ title, onClose, closeLabel, children }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("input, button:not([data-close]), a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-3xl bg-(--t-surface) p-6 text-(--t-text) shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          data-close
          onClick={onClose}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-(--t-muted) hover:bg-(--t-bg)"
        >
          <span className="sr-only">{closeLabel}</span>
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="currentColor">
            <path d="M5.1 4 4 5.1 8.9 10 4 14.9 5.1 16l4.9-4.9 4.9 4.9 1.1-1.1-4.9-4.9L16 5.1 14.9 4 10 8.9z" />
          </svg>
        </button>
        <h2 id="modal-title" className="pr-10 font-(family-name:--t-font) text-2xl font-semibold">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
