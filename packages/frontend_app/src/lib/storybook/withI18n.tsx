import type { ReactNode } from "react";
import { I18nProviderClient } from "../../locales/client";

export function withI18n(Story: () => ReactNode) {
  return (
    <I18nProviderClient locale="en" fallback={null}>
      <Story />
    </I18nProviderClient>
  );
}
