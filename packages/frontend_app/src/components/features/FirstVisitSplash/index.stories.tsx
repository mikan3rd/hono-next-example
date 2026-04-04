import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { SESSION_STORAGE } from "../../../lib/sessionStorage/constants";
import { FirstVisitSplash } from ".";

const clearSplashSessionDecorator: Decorator = (StoryComponent) => {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(SESSION_STORAGE.FIRST_VISIT_SPLASH.KEY);
  }
  return <StoryComponent />;
};

const setSplashSeenDecorator: Decorator = (StoryComponent) => {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(
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
