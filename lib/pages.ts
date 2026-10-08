import type { Dictionary } from "@/lib/i18n/get-dictionary";

// The showroom's pages, in menu order. `nav` names the menu label in the dictionary.
export const showroomPages = [
  { slug: "templates", nav: "templates" },
  { slug: "how-it-works", nav: "how" },
  { slug: "admin", nav: "admin" },
  { slug: "pricing", nav: "pricing" },
  { slug: "faq", nav: "faq" },
] as const satisfies { slug: string; nav: keyof Dictionary["nav"] }[];
