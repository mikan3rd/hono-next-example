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

    const main = within(postCard).getByTestId("PostCard-main");
    await expect(main).toBeVisible();
    await expect(within(main).getByText("Hello, world!")).toBeVisible();
    await expect(within(main).getByText("New")).toBeVisible();
    await expect(within(main).getByText("Updated")).not.toBeVisible();
    await expect(
      within(main).getByRole("button", { name: "Edit" }),
    ).toBeVisible();
    await expect(
      within(main).getByRole("button", { name: "Delete" }),
    ).toBeVisible();

    const date = within(postCard).getByTestId("PostCard-date");
    await expect(date).toBeVisible();
    await expect(within(date).getByText(/Created:/)).toBeVisible();
    await expect(within(date).getByText(/Updated:/)).not.toBeVisible();
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

    const main = within(postCard).getByTestId("PostCard-main");
    await expect(main).toBeVisible();
    await expect(within(main).getByText("New")).not.toBeVisible();
    await expect(within(main).getByText("Updated")).toBeVisible();

    const date = within(postCard).getByTestId("PostCard-date");
    await expect(date).toBeVisible();
    await expect(within(date).getByText(/Created:/)).toBeVisible();
    await expect(within(date).getByText(/Updated:/)).toBeVisible();
  },
};

export const LongContent: Story = {
  args: {
    post: {
      id: 3,
      content:
        "This is a very long post content that should demonstrate how the component handles lengthy text. The content should be properly formatted and displayed with appropriate line breaks and spacing. This helps ensure that the UI remains clean and readable even with substantial amounts of text.",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
    },
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const postCard = canvas.getByTestId("PostCard-3");
    await expect(postCard).toBeVisible();

    const main = within(postCard).getByTestId("PostCard-main");
    await expect(main).toBeVisible();
    await expect(
      within(main).getByText(/This is a very long post content/),
    ).toBeVisible();
    await expect(
      within(main).getByText(/This helps ensure that the UI remains clean/),
    ).toBeInTheDocument();
  },
};

export const EditMode: Story = {
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

    const main = within(postCard).getByTestId("PostCard-main");
    await expect(main).toBeVisible();
    const editButton = within(main).getByRole("button", { name: "Edit" });
    await expect(editButton).toBeEnabled();
    await userEvent.click(editButton);

    const textarea = within(main).getByRole("textbox");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue("Original content");
    const saveButton = within(main).getByRole("button", { name: "Save" });
    await expect(saveButton).toBeEnabled();

    const cancelButton = within(main).getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toBeEnabled();
  },
};

export const SaveAndCancel: Story = {
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

    const main = within(postCard).getByTestId("PostCard-main");
    await expect(main).toBeVisible();
    const editButton = within(main).getByRole("button", { name: "Edit" });
    await expect(editButton).toBeEnabled();
    await userEvent.click(editButton);

    const textarea = within(main).getByRole("textbox");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue("Test content for save/cancel");

    const saveButton = within(main).getByRole("button", { name: "Save" });
    await expect(saveButton).toBeEnabled();

    await userEvent.clear(textarea);
    await expect(saveButton).toBeDisabled();

    await userEvent.type(textarea, "Updated content");
    await expect(saveButton).toBeEnabled();

    await userEvent.click(saveButton);
    await expect(args.invalidatePostsQuery).toBeCalledTimes(1);
    await expect(textarea).not.toBeVisible();
    await expect(within(main).getByText("Updated content")).toBeVisible();
  },
};

export const CancelEdit: Story = {
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

    const main = within(postCard).getByTestId("PostCard-main");
    await expect(main).toBeVisible();
    const editButton = within(main).getByRole("button", { name: "Edit" });
    await expect(editButton).toBeEnabled();
    await userEvent.click(editButton);

    const textarea = within(main).getByRole("textbox");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue("Original content for cancel test");
    const cancelButton = within(main).getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toBeEnabled();
    await userEvent.click(cancelButton);

    await expect(textarea).not.toBeVisible();
    await expect(
      within(main).getByText("Original content for cancel test"),
    ).toBeVisible();
  },
};

export const DeleteConfirmation: Story = {
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
    const main = within(postCard).getByTestId("PostCard-main");
    await expect(main).toBeVisible();
    const deleteButton = within(main).getByRole("button", { name: "Delete" });
    await expect(deleteButton).toBeEnabled();
    await userEvent.click(deleteButton);
    await expect(args.invalidatePostsQuery).toBeCalledTimes(1);
  },
};
