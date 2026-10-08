import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = { title: "Unlockd" };

// Root layout for the language-less entry pages, which only redirect.
export default function RedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center">{children}</body>
    </html>
  );
}
