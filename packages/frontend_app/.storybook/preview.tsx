import "../src/app/globals.css";

import { faker } from "@faker-js/faker";
import type { Preview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { getBackendAppOpenAPIMock } from "../src/client/index.msw";
import { RootProviders } from "../src/lib/RootProviders";
import { resolveStorybookLocale } from "../src/lib/storybook/storybookLocale";

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize(
  {
    onUnhandledRequest: "bypass",
    quiet: true,
  },
  getBackendAppOpenAPIMock(),
);

const preview: Preview = {
  globalTypes: {
    locale: {
      description: "UI locale (next-international)",
      toolbar: {
        title: "Locale",
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "ja", title: "日本語" },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    nextjs: {
      appDirectory: true,
      // 既定は en。Vitest portable stories では loader が走らないため、next-international の useCurrentLocale 用に静的に必須。
      navigation: {
        pathname: "/en",
        segments: [["locale", "en"]],
      },
    },

    chromatic: {
      modes: {
        desktop: { viewport: MINIMAL_VIEWPORTS.desktop.styles },
        mobile: { viewport: MINIMAL_VIEWPORTS.mobile1.styles },
      },
    },
  },

  initialGlobals: {
    a11y: {
      // Optional flag to prevent the automatic check
      manual: true,
    },
    locale: "en",
  },

  loaders: [
    async ({ globals }) => {
      const locale = resolveStorybookLocale(globals);
      return {
        parameters: {
          nextjs: {
            appDirectory: true,
            navigation: {
              pathname: `/${locale}`,
              segments: [["locale", locale]],
            },
          },
        },
      };
    },
    mswLoader,
  ],

  beforeAll: () => {
    faker.seed(123);
    faker.setDefaultRefDate(new Date("2025-01-01"));
  },

  decorators: [
    (Story) => (
      <RootProviders>
        <Story />
      </RootProviders>
    ),
  ],
};

export default preview;
