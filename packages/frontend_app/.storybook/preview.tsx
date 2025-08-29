import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";
import Providers from "../src/app/providers";

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
  },
  decorators: [
    (Story) => (
      <Providers >
        <Story />
      </Providers>
    ),
  ],
};

export default preview;
