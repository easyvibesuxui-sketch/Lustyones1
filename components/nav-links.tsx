"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

type Props = { links: { href: string; label: string }[]; variant: "bar" | "menu" };

// Menu links that mark the current page and, in the mobile menu, close it after a pick.
export function NavLinks({ links, variant }: Props) {
  const pathname = usePathname();
  const closeMenu = (e: MouseEvent<HTMLAnchorElement>) => e.currentTarget.closest("details")?.removeAttribute("open");

  return (
    <ul className={variant === "bar" ? "flex gap-1 text-sm" : "flex flex-col"}>
      {links.map((l) => {
        const current = pathname.replace(/\/$/, "") === l.href;
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={current ? "page" : undefined}
              onClick={variant === "menu" ? closeMenu : undefined}
              className={
                variant === "bar"
                  ? "relative block rounded-full px-3 py-1.5 text-haze transition-colors hover:text-ink aria-[current=page]:bg-plum aria-[current=page]:text-blush"
                  : "block rounded-xl px-3 py-2.5 text-ink hover:bg-aubergine aria-[current=page]:text-blush"
              }
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
