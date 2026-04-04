import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { SESSION_STORAGE } from "../../../lib/sessionStorage/constants";
import { writeSessionStorageItem } from "../../../lib/sessionStorage/safeSessionStorage";
import { FirstVisitSplash } from ".";

const setSplashSeenDecorator: Decorator = (StoryComponent) => {
  if (typeof sessionStorage !== "undefined") {
    writeSessionStorageItem(
      SESSION_STORAGE.FIRST_VISIT_SPLASH.KEY,
      SESSION_STORAGE.FIRST_VISIT_SPLASH.VALUE,
    );
  }
  return <StoryComponent />;
};

const meta = {
  component: FirstVisitSplash,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    appTitle: "hono-next-example",
  },
} satisfies Meta<typeof FirstVisitSplash>;

export default meta;

export const AlreadySeenInTab = {
  name: "Already seen (no overlay)",
  render: () => <FirstVisitSplash appTitle="hono-next-example" />,
  decorators: [setSplashSeenDecorator],
  parameters: {
    chromatic: { disable: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.queryByTestId("splash-screen")).not.toBeInTheDocument();
    });
  },
} satisfies StoryObj;
