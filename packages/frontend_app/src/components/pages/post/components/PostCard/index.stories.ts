import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PostCard } from ".";

const meta = {
  component: PostCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

type Props = ComponentProps<typeof PostCard>;
const postContent: Props["post"]["content"] = faker.lorem.paragraph();
const createMockPost = (
  overrides: Partial<Props["post"]> = {},
): Props["post"] => ({
  public_id: faker.string.uuid(),
  content: postContent,
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
  user: {
    public_id: faker.string.uuid(),
    display_name: faker.person.fullName(),
  },
  ...overrides,
});

const getPostCardElements = (canvas: ReturnType<typeof within>) => {
  const postCard = canvas.getByTestId(`PostCard`);
  const header = within(postCard).getByTestId("PostCard-header");
  const content = within(postCard).getByTestId("PostCard-content");
  const date = within(postCard).getByTestId("PostCard-date");

  return { postCard, header, content, date };
};

const enterEditMode = async (canvas: ReturnType<typeof within>) => {
  const { header, content } = getPostCardElements(canvas);

  const editButton = within(header).getByRole("button", { name: "Edit" });
  await expect(editButton).toBeEnabled();
  await userEvent.click(editButton);

  const textarea = within(content).getByRole("textbox");
  await expect(textarea).toBeVisible();
  await expect(textarea).toHaveValue(postContent);

  return { header, content, textarea };
};

const verifyPostStatus = async (header: HTMLElement, isUpdated: boolean) => {
  if (isUpdated) {
    await expect(within(header).getByText("Updated")).toBeVisible();
  } else {
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

export const CreatedPost: Story = {
  args: {
    post: createMockPost(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { header, content, date } = getPostCardElements(canvas);

    await expect(header).toBeVisible();
    await expect(
      within(header).getByText(args.post.user.display_name),
    ).toBeVisible();
    await verifyPostStatus(header, false);
    await expect(
      within(header).getByRole("button", { name: "Edit" }),
    ).toBeVisible();
    await expect(
      within(header).getByRole("button", { name: "Delete" }),
    ).toBeVisible();

    await expect(content).toBeVisible();
    await expect(within(content).getByText(args.post.content)).toBeVisible();

    await expect(date).toBeVisible();
    await verifyDateDisplay(date, false);
  },
};

export const UpdatedPost: Story = {
  args: {
    post: createMockPost({
      updated_at: "2025-01-02T12:00:00.000Z",
    }),
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
    post: createMockPost(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const { header } = await enterEditMode(canvas);

    const saveButton = within(header).getByRole("button", { name: "Save" });
    await expect(saveButton).toBeEnabled();

    const cancelButton = within(header).getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toBeEnabled();
  },
};

export const EditAndSavePost: Story = {
  args: {
    post: createMockPost(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const { header, textarea } = await enterEditMode(canvas);

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
      await expect(textarea).not.toBeVisible();
    });
  },
};

export const EditAndCancelPost: Story = {
  args: {
    post: createMockPost(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { header, content, textarea } = await enterEditMode(canvas);

    const cancelButton = within(header).getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toBeEnabled();
    await userEvent.click(cancelButton);

    await expect(textarea).not.toBeVisible();
    await expect(within(content).getByText(args.post.content)).toBeVisible();
  },
};

export const DeletePost: Story = {
  args: {
    post: createMockPost(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const { header } = getPostCardElements(canvas);

    const deleteButton = within(header).getByRole("button", { name: "Delete" });
    await expect(deleteButton).toBeEnabled();
    await userEvent.click(deleteButton);
  },
};
