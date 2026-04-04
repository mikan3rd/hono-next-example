import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { SESSION_STORAGE } from "../../../lib/sessionStorage/constants";
import {
  removeSessionStorageItem,
  writeSessionStorageItem,
} from "../../../lib/sessionStorage/safeSessionStorage";
import { FirstVisitSplash } from ".";

const clearSplashSessionDecorator: Decorator = (StoryComponent) => {
  if (typeof sessionStorage !== "undefined") {
    removeSessionStorageItem(SESSION_STORAGE.FIRST_VISIT_SPLASH);
  }
  return <StoryComponent />;
};

const setSplashSeenDecorator: Decorator = (StoryComponent) => {
  if (typeof sessionStorage !== "undefined") {
    writeSessionStorageItem(SESSION_STORAGE.FIRST_VISIT_SPLASH);
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

export const FirstVisitShowsSplash = {
  name: "First visit (splash visible)",
  render: () => (
    <div className="relative min-h-screen">
      <FirstVisitSplash appTitle="hono-next-example" />
      <main data-testid="splash-story-underlying-ui">
        <p className="p-4 text-foreground">Underlying app content</p>
      </main>
    </div>
  ),
  decorators: [clearSplashSessionDecorator],
  parameters: {
    chromatic: { disable: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      () => {
        expect(canvas.getByTestId("splash-screen")).toBeVisible();
      },
      { timeout: 10_000 },
    );
  },
} satisfies StoryObj;

export const AlreadySeenInTab = {
  name: "Already seen (no overlay)",
  render: () => (
    <div className="relative min-h-screen">
      <FirstVisitSplash appTitle="hono-next-example" />
      <main data-testid="splash-story-underlying-ui">
        <p className="p-4 text-foreground">Underlying app content</p>
      </main>
    </div>
  ),
  decorators: [setSplashSeenDecorator],
  parameters: {
    chromatic: { disable: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.queryByTestId("splash-screen")).not.toBeInTheDocument();
    });
    await expect(
      canvas.getByTestId("splash-story-underlying-ui"),
    ).toBeVisible();
  },
} satisfies StoryObj;
