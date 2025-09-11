import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { PostForm } from ".";

const meta = {
  component: PostForm,
  tags: ["autodocs"],
} satisfies Meta<typeof PostForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement, userEvent, args }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole("textbox");
    await expect(input).toHaveValue("");
    const createPostButton = canvas.getByRole("button", {
      name: "Create Post",
    });
    await expect(createPostButton).toBeDisabled();

    await userEvent.type(input, "test");
    await expect(createPostButton).toBeEnabled();

    await userEvent.click(createPostButton);
    await waitFor(async () => {
      await expect(args.invalidatePostsQuery).toHaveBeenCalledOnce();
    });
    await expect(input).toHaveValue("");
    await expect(createPostButton).toBeDisabled();
  },
};
