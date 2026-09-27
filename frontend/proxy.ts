import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const cookie = request.cookies.get("ds-locale")?.value;
  const header = request.headers.get("accept-language") ?? "";
  const wanted = locales.includes(cookie as never)
    ? cookie
    : header.toLowerCase().startsWith("en")
      ? "en"
      : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${wanted}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|img|icons|.*\\..*).*)"],
};
