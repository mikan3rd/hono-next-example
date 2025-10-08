import "../src/app/globals.css";

import { faker } from "@faker-js/faker";
import type { Preview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { getBackendAppOpenAPIMock } from "../src/client/index.msw";
import { RootProviders } from "../src/lib/RootProviders";

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({ onUnhandledRequest: "bypass" }, getBackendAppOpenAPIMock());

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "off",
    },

    nextjs: {
      appDirectory: true,
    },

    chromatic: {
      modes: {
        desktop: { viewport: MINIMAL_VIEWPORTS.desktop.styles },
        mobile: { viewport: MINIMAL_VIEWPORTS.mobile1.styles },
      },
    },
  },

  loaders: [mswLoader],

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
