import { NextRequest, type NextResponse } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import {
  defaultLocale,
  isLocale,
  locales,
  PATHNAME_LOCALE_HEADER,
} from "./locales/constants";
import { updateSession } from "./supabase/middleware";

const I18nMiddleware = createI18nMiddleware({
  locales: [...locales],
  defaultLocale,
});

function mergeIntlIntoSession(
  intlResponse: NextResponse,
  sessionResponse: NextResponse,
) {
  for (const cookie of intlResponse.cookies.getAll()) {
    sessionResponse.cookies.set(cookie);
  }
  const localeHeader = intlResponse.headers.get("x-next-locale");
  if (localeHeader) {
    sessionResponse.headers.set("x-next-locale", localeHeader);
  }
  return sessionResponse;
}

function requestWithPathnameLocaleHeader(request: NextRequest): NextRequest {
  const requestHeaders = new Headers(request.headers);
  const first = request.nextUrl.pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) {
    requestHeaders.set(PATHNAME_LOCALE_HEADER, first);
  }
  return new NextRequest(request.url, { headers: requestHeaders });
}

export async function proxy(request: NextRequest) {
  const req = requestWithPathnameLocaleHeader(request);
  const intlResponse = I18nMiddleware(req);

  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const sessionResponse = await updateSession(req);
  return mergeIntlIntoSession(intlResponse, sessionResponse);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
