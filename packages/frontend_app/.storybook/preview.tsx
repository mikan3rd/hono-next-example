import "../src/app/globals.css";

import type { Preview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
// import { sb } from "storybook/test";
import Providers from "../src/app/providers";
import { getBackendAppOpenAPIMock } from "../src/client/index.msw";
import { Toaster } from "../src/components/ui/Sonner";

// Vite alias in main.ts already redirects '@supabase/ssr' to a mock file.
// If you later remove the alias, you can enable automocking like:
// import { sb } from "storybook/test";
// sb.mock(import("@supabase/ssr"), { spy: true });

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({}, getBackendAppOpenAPIMock());

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
      test: "todo",
    },

    nextjs: {
      appDirectory: true,
    },
  },

  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <Providers>
        <Story />
        <Toaster />
      </Providers>
    ),
  ],
};

export default preview;
