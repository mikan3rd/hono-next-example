import type { NextRequest, NextResponse } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import { defaultLocale, locales } from "./locales/constants";
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
    sessionResponse.cookies.set(cookie.name, cookie.value);
  }
  const localeHeader = intlResponse.headers.get("x-next-locale");
  if (localeHeader) {
    sessionResponse.headers.set("x-next-locale", localeHeader);
  }
  return sessionResponse;
}

export async function proxy(request: NextRequest) {
  const intlResponse = I18nMiddleware(request);

  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const sessionResponse = await updateSession(request);
  return mergeIntlIntoSession(intlResponse, sessionResponse);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
