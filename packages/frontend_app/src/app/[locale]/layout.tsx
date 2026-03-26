import type { ReactNode } from "react";
import { I18nProviderClient } from "../../locales/client";
import { getStaticParams } from "../../locales/server";

export { getStaticParams };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <I18nProviderClient locale={locale} fallback={null}>
      {children}
    </I18nProviderClient>
  );
}
