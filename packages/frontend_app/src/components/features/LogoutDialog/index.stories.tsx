import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { LogoutDialog } from ".";

const meta = {
  component: LogoutDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof LogoutDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const logoutDialogBtn = await canvas.findByRole("button", {
      name: "Sign Out Dialog",
    });
    await userEvent.click(logoutDialogBtn);

    const signOutBtn = await screen.findByRole("button", { name: "Sign Out" });
    await waitFor(async () => {
      await expect(signOutBtn).toBeVisible();
    });
  },
};
