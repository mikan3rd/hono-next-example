import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  SPLASH_SESSION_STORAGE_KEY,
  SPLASH_STORAGE_VALUE,
} from "../../../lib/sessionStorage/constants";
import { FirstVisitSplash } from ".";

const clearSplashSessionDecorator: Decorator = (StoryComponent) => {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(SPLASH_SESSION_STORAGE_KEY);
  }
  return <StoryComponent />;
};

const setSplashSeenDecorator: Decorator = (StoryComponent) => {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(SPLASH_SESSION_STORAGE_KEY, SPLASH_STORAGE_VALUE);
  }
  return <StoryComponent />;
};

const meta = {
  component: FirstVisitSplash,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    chromatic: { delay: 400 },
  },
  args: {
    appTitle: "hono-next-example",
  },
} satisfies Meta<typeof FirstVisitSplash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstVisit: Story = {
  decorators: [clearSplashSessionDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      () => {
        expect(canvas.getByTestId("splash-screen")).toBeVisible();
      },
      { timeout: 10_000 },
    );
  },
};

export const AlreadySeenInTab: Story = {
  name: "Already seen (no overlay)",
  decorators: [setSplashSeenDecorator],
  parameters: {
    chromatic: { disable: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByTestId("splash-screen")).not.toBeInTheDocument();
  },
};
