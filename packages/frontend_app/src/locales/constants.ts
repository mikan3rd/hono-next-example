export const locales = ["en", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Set by proxy from the first path segment; root layout uses for html lang before cookie exists. */
export const PATHNAME_LOCALE_HEADER = "x-pathname-locale";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
