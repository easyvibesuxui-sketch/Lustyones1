import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  localeCookie,
  localeForCountry,
  localeFromAcceptLanguage,
  locales,
  type Locale,
} from "@/lib/i18n/config";

// Country header set by the host in front of the app.
function visitorCountry(request: NextRequest): string | null {
  return (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("cloudfront-viewer-country")
  );
}

// Order: the visitor's own choice, then their location, then their browser language.
function pickLocale(request: NextRequest): Locale {
  const chosen = request.cookies.get(localeCookie)?.value;
  if (isLocale(chosen)) return chosen;
  return (
    localeForCountry(visitorCountry(request)) ??
    localeFromAcceptLanguage(request.headers.get("accept-language")) ??
    defaultLocale
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  // The target depends on who is asking, so shared caches must not keep it.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Cookie, Accept-Language");
  return response;
}

export const config = {
  // Everything except Next internals and files with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
