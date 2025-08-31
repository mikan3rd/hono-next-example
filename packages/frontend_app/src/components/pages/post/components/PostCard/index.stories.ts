import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import type { ComponentProps } from "react";
import { expect, fn, waitFor, within } from "storybook/test";
import { env } from "../../../../../env";
import { PostCard } from ".";

const meta = {
  component: PostCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

type Props = ComponentProps<typeof PostCard>;
const postId: Props["post"]["id"] = 1;
const createMockPost = (
  overrides: Partial<Props["post"]> = {},
): Props["post"] => ({
  id: postId,
  content: "Hello, world!",
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
  ...overrides,
});

const getPostCardElements = (canvas: ReturnType<typeof within>) => {
  const postCard = canvas.getByTestId(`PostCard-${postId}`);
  const header = within(postCard).getByTestId("PostCard-header");
  const content = within(postCard).getByTestId("PostCard-content");
  const date = within(postCard).getByTestId("PostCard-date");

  return { postCard, header, content, date };
};

const verifyPostStatus = async (header: HTMLElement, isUpdated: boolean) => {
  if (isUpdated) {
    await expect(within(header).queryByText("New")).toBeNull();
    await expect(within(header).getByText("Updated")).toBeVisible();
  } else {
    await expect(within(header).getByText("New")).toBeVisible();
    await expect(within(header).queryByText("Updated")).toBeNull();
  }
};

const verifyDateDisplay = async (date: HTMLElement, isUpdated: boolean) => {
  await expect(within(date).getByText(/Created:/)).toBeVisible();
  if (isUpdated) {
    await expect(within(date).getByText(/Updated:/)).toBeVisible();
  } else {
    await expect(within(date).queryByText(/Updated:/)).toBeNull();
  }
};

const mswHandlers = {
  updatePost: http.put(
    `${env.NEXT_PUBLIC_BACKEND_APP_URL}/posts/:id`,
    async () => {
      return HttpResponse.json({});
    },
  ),
  deletePost: http.delete(
    `${env.NEXT_PUBLIC_BACKEND_APP_URL}/posts/:id`,
    async () => {
      return HttpResponse.json({});
    },
  ),
};

export const CreatedPost: Story = {
  args: {
    post: createMockPost(),
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const { header, content, date } = getPostCardElements(canvas);

    await expect(header).toBeVisible();
    await verifyPostStatus(header, false);
    await expect(
      within(header).getByRole("button", { name: "Edit" }),
    ).toBeVisible();
    await expect(
      within(header).getByRole("button", { name: "Delete" }),
    ).toBeVisible();

    await expect(content).toBeVisible();
    await expect(within(content).getByText("Hello, world!")).toBeVisible();

    await expect(date).toBeVisible();
    await verifyDateDisplay(date, false);
  },
};

export const UpdatedPost: Story = {
  args: {
    post: createMockPost({
      content:
        "This is an updated post with longer content that should demonstrate the line-clamp functionality and show the updated status.",
      updated_at: "2025-01-02T12:00:00.000Z",
    }),
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const { header, date } = getPostCardElements(canvas);

    await verifyPostStatus(header, true);
    await verifyDateDisplay(date, true);
  },
};

export const EditPost: Story = {
  args: {
    post: createMockPost({
      content: "Original content",
    }),
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const { header, content } = getPostCardElements(canvas);

    const editButton = within(header).getByRole("button", { name: "Edit" });
    await expect(editButton).toBeEnabled();
    await userEvent.click(editButton);

    const textarea = within(content).getByRole("textbox");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue("Original content");

    const saveButton = within(header).getByRole("button", { name: "Save" });
    await expect(saveButton).toBeEnabled();

    const cancelButton = within(header).getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toBeEnabled();
  },
};

export const EditAndSavePost: Story = {
  parameters: {
    msw: {
      handlers: [mswHandlers.updatePost],
    },
  },
  args: {
    post: createMockPost({
      content: "Test content for save/cancel",
    }),
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement, userEvent, args }) => {
    const canvas = within(canvasElement);
    const { header, content } = getPostCardElements(canvas);

    const editButton = within(header).getByRole("button", { name: "Edit" });
    await expect(editButton).toBeEnabled();
    await userEvent.click(editButton);

    const textarea = within(content).getByRole("textbox");
    await expect(textarea).toHaveValue("Test content for save/cancel");

    const saveButton = within(header).getByRole("button", { name: "Save" });
    await expect(saveButton).toBeEnabled();

    await userEvent.clear(textarea);
    await waitFor(async () => {
      await expect(saveButton).toBeDisabled();
    });

    await userEvent.type(textarea, "Updated content");
    await expect(saveButton).toBeEnabled();

    await userEvent.click(saveButton);
    await waitFor(async () => {
      await expect(args.invalidatePostsQuery).toHaveBeenCalledOnce();
    });

    await expect(textarea).not.toBeVisible();
  },
};

export const EditAndCancelPost: Story = {
  args: {
    post: createMockPost({
      content: "Original content for cancel test",
    }),
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const { header, content } = getPostCardElements(canvas);

    const editButton = within(header).getByRole("button", { name: "Edit" });
    await expect(editButton).toBeEnabled();
    await userEvent.click(editButton);

    const textarea = within(content).getByRole("textbox");
    await expect(textarea).toHaveValue("Original content for cancel test");

    const cancelButton = within(header).getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toBeEnabled();
    await userEvent.click(cancelButton);

    await expect(textarea).not.toBeVisible();
    await expect(
      within(content).getByText("Original content for cancel test"),
    ).toBeVisible();
  },
};

export const DeletePost: Story = {
  parameters: {
    msw: {
      handlers: [mswHandlers.deletePost],
    },
  },
  args: {
    post: createMockPost({
      content: "Post to be deleted",
    }),
    invalidatePostsQuery: fn(),
  },
  play: async ({ canvasElement, userEvent, args }) => {
    const canvas = within(canvasElement);
    const { header } = getPostCardElements(canvas);

    const deleteButton = within(header).getByRole("button", { name: "Delete" });
    await expect(deleteButton).toBeEnabled();
    await userEvent.click(deleteButton);

    await waitFor(async () => {
      await expect(args.invalidatePostsQuery).toHaveBeenCalledOnce();
    });
  },
};
