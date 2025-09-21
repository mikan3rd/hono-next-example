import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { SignUpDialog } from ".";

const meta = {
  component: SignUpDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof SignUpDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Sign Up Dialog" }),
    );
    await waitFor(async () => {
      await expect(
        screen.getByRole("button", { name: "Sign Up" }),
      ).toBeVisible();
    });
  },
};

export const SignUpSuccess: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Sign Up Dialog" }),
    );
    await waitFor(async () => {
      await expect(
        screen.getByRole("button", { name: "Sign Up" }),
      ).toBeVisible();
    });
    await userEvent.click(screen.getByRole("button", { name: "Sign Up" }));
    await waitFor(async () => {
      await expect(screen.getByText("Signed up successfully")).toBeVisible();
      await expect(
        screen.getByRole("button", { name: "Sign Up" }),
      ).not.toBeVisible();
    });
  },
};
