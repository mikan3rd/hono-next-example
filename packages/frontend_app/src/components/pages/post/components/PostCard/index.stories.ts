import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";
import { PostCard } from ".";

const meta = {
  component: PostCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreatedPost: Story = {
  args: {
    post: {
      id: 1,
      content: "Hello, world!",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
    },
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const postCard = canvas.getByTestId("PostCard-1");
    await expect(postCard).toBeVisible();

    const header = within(postCard).getByTestId("PostCard-header");
    await expect(within(header).getByText("New")).toBeVisible();
    await expect(within(header).queryByText("Updated")).toBeNull();
    await expect(
      within(header).getByRole("button", { name: "Edit" }),
    ).toBeVisible();
    await expect(
      within(header).getByRole("button", { name: "Delete" }),
    ).toBeVisible();

    const content = within(postCard).getByTestId("PostCard-content");
    await expect(content).toBeVisible();
    await expect(within(content).getByText("Hello, world!")).toBeVisible();

    const date = within(postCard).getByTestId("PostCard-date");
    await expect(date).toBeVisible();
    await expect(within(date).getByText(/Created:/)).toBeVisible();
    await expect(within(date).queryByText(/Updated:/)).toBeNull();
  },
};

export const UpdatedPost: Story = {
  args: {
    post: {
      id: 2,
      content:
        "This is an updated post with longer content that should demonstrate the line-clamp functionality and show the updated status.",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-02T12:00:00.000Z",
    },
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const postCard = canvas.getByTestId("PostCard-2");
    await expect(postCard).toBeVisible();

    const header = within(postCard).getByTestId("PostCard-header");
    await expect(header).toBeVisible();
    await expect(within(header).queryByText("New")).toBeNull();
    await expect(within(header).getByText("Updated")).toBeVisible();

    const date = within(postCard).getByTestId("PostCard-date");
    await expect(date).toBeVisible();
    await expect(within(date).getByText(/Created:/)).toBeVisible();
    await expect(within(date).getByText(/Updated:/)).toBeVisible();
  },
};

export const EditPost: Story = {
  args: {
    post: {
      id: 4,
      content: "Original content",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
    },
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const postCard = canvas.getByTestId("PostCard-4");
    await expect(postCard).toBeVisible();

    const header = within(postCard).getByTestId("PostCard-header");
    await expect(header).toBeVisible();
    const editButton = within(header).getByRole("button", { name: "Edit" });
    await expect(editButton).toBeEnabled();
    await userEvent.click(editButton);

    const content = within(postCard).getByTestId("PostCard-content");
    const textarea = within(content).getByRole("textbox");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue("Original content");

    const saveButton = within(header).getByRole("button", { name: "Save" });
    await expect(saveButton).toBeEnabled();

    const cancelButton = within(header).getByRole("button", {
      name: "Cancel",
    });
    await expect(cancelButton).toBeEnabled();
  },
};

export const EditAndSavePost: Story = {
  args: {
    post: {
      id: 5,
      content: "Test content for save/cancel",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
    },
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement, userEvent, args }) => {
    const canvas = within(canvasElement);

    const postCard = canvas.getByTestId("PostCard-5");
    await expect(postCard).toBeVisible();

    const content = within(postCard).getByTestId("PostCard-content");
    await expect(content).toBeVisible();
    const editButton = within(content).getByRole("button", { name: "Edit" });
    await expect(editButton).toBeEnabled();
    await userEvent.click(editButton);

    const textarea = within(content).getByRole("textbox");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue("Test content for save/cancel");

    const saveButton = within(content).getByRole("button", { name: "Save" });
    await expect(saveButton).toBeEnabled();

    await userEvent.clear(textarea);
    await expect(saveButton).toBeDisabled();

    await userEvent.type(textarea, "Updated content");
    await expect(saveButton).toBeEnabled();

    await userEvent.click(saveButton);
    await expect(args.invalidatePostsQuery).toBeCalledTimes(1);
    await expect(textarea).not.toBeVisible();
    await expect(within(content).getByText("Updated content")).toBeVisible();
  },
};

export const EditAndCancelPost: Story = {
  args: {
    post: {
      id: 6,
      content: "Original content for cancel test",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
    },
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const postCard = canvas.getByTestId("PostCard-6");
    await expect(postCard).toBeVisible();

    const content = within(postCard).getByTestId("PostCard-content");
    await expect(content).toBeVisible();
    const editButton = within(content).getByRole("button", { name: "Edit" });
    await expect(editButton).toBeEnabled();
    await userEvent.click(editButton);

    const textarea = within(content).getByRole("textbox");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue("Original content for cancel test");
    const cancelButton = within(content).getByRole("button", {
      name: "Cancel",
    });
    await expect(cancelButton).toBeEnabled();
    await userEvent.click(cancelButton);

    await expect(textarea).not.toBeVisible();
    await expect(
      within(content).getByText("Original content for cancel test"),
    ).toBeVisible();
  },
};

export const DeletePost: Story = {
  args: {
    post: {
      id: 7,
      content: "Post to be deleted",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
    },
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement, userEvent, args }) => {
    const canvas = within(canvasElement);

    const postCard = canvas.getByTestId("PostCard-7");
    await expect(postCard).toBeVisible();
    const content = within(postCard).getByTestId("PostCard-content");
    await expect(content).toBeVisible();
    const deleteButton = within(content).getByRole("button", {
      name: "Delete",
    });
    await expect(deleteButton).toBeEnabled();
    await userEvent.click(deleteButton);
    await expect(args.invalidatePostsQuery).toBeCalledTimes(1);
  },
};
