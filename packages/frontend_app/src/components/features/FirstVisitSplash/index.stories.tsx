import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { expect, waitFor, within } from "storybook/test";
import { SESSION_STORAGE } from "../../../lib/sessionStorage/constants";
import {
  removeSessionStorageItem,
  writeSessionStorageItem,
} from "../../../lib/sessionStorage/safeSessionStorage";
import { FirstVisitSplash } from ".";

const SPLASH_STORY_UNDERLYING_UI_TEST_ID = "splash-story-underlying-ui";

function sessionStorageDecorator(setup: () => void): Decorator {
  return (StoryComponent) => {
    if (typeof sessionStorage !== "undefined") {
      setup();
    }
    return <StoryComponent />;
  };
}

const clearSplashSessionDecorator = sessionStorageDecorator(() => {
  removeSessionStorageItem(SESSION_STORAGE.FIRST_VISIT_SPLASH);
});

const setSplashSeenDecorator = sessionStorageDecorator(() => {
  writeSessionStorageItem(SESSION_STORAGE.FIRST_VISIT_SPLASH);
});

function FirstVisitSplashStoryScene(
  props: ComponentProps<typeof FirstVisitSplash>,
) {
  return (
    <div className="relative min-h-screen">
      <FirstVisitSplash {...props} />
      <main data-testid={SPLASH_STORY_UNDERLYING_UI_TEST_ID}>
        <p className="p-4 text-foreground">Underlying app content</p>
      </main>
    </div>
  );
}

const meta = {
  component: FirstVisitSplash,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    chromatic: { disable: true },
  },
  args: {
    appTitle: "hono-next-example",
  },
} satisfies Meta<typeof FirstVisitSplash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstVisitShowsSplash: Story = {
  name: "First visit (splash visible)",
  render: (args) => <FirstVisitSplashStoryScene {...args} />,
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
  render: (args) => <FirstVisitSplashStoryScene {...args} />,
  decorators: [setSplashSeenDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.queryByTestId("splash-screen")).not.toBeInTheDocument();
    });
    await expect(
      canvas.getByTestId(SPLASH_STORY_UNDERLYING_UI_TEST_ID),
    ).toBeVisible();
  },
};
