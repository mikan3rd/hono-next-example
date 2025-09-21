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

    const signUpDialogBtn = await canvas.findByRole("button", {
      name: "Sign Up Dialog",
    });
    await userEvent.click(signUpDialogBtn);

    const signUpBtn = await screen.findByRole("button", { name: "Sign Up" });
    await waitFor(async () => {
      await expect(signUpBtn).toBeVisible();
    });
  },
};

export const SignUpSuccess: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const signUpDialogBtn = await canvas.findByRole("button", {
      name: "Sign Up Dialog",
    });
    await userEvent.click(signUpDialogBtn);

    const signUpBtn = await screen.findByRole("button", { name: "Sign Up" });
    await waitFor(async () => {
      await expect(signUpBtn).toBeVisible();
    });

    await userEvent.click(signUpBtn);
    const successToast = await screen.findByText("Signed up successfully");

    await waitFor(async () => {
      await expect(successToast).toBeVisible();
      await expect(signUpBtn).not.toBeVisible();
    });
  },
};
