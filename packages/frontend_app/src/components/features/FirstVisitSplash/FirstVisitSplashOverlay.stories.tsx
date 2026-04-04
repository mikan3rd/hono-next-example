import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { FirstVisitSplashOverlay } from "./FirstVisitSplashOverlay";

const meta = {
  component: FirstVisitSplashOverlay,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    appTitle: "hono-next-example",
    exiting: false,
  },
} satisfies Meta<typeof FirstVisitSplashOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("splash-screen")).toBeVisible();
  },
};
