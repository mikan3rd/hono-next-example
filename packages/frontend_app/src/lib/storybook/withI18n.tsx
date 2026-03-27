import type { Decorator } from "@storybook/nextjs-vite";
import { I18nProviderClient } from "../../locales/client";
import { resolveStorybookLocale } from "./storybookLocale";

export const withI18n: Decorator = (Story, context) => {
  const locale = resolveStorybookLocale(context.globals);
  return (
    <I18nProviderClient locale={locale} fallback={null}>
      <Story />
    </I18nProviderClient>
  );
};
