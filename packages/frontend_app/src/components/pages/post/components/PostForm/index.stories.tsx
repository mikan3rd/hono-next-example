import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";
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
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole("textbox");
    expect(input).toHaveValue("");
    const createPostButton = canvas.getByRole("button", {
      name: "Create Post",
    });
    expect(createPostButton).toBeDisabled();

    await userEvent.type(input, "test");
    expect(createPostButton).toBeEnabled();
  },
};
