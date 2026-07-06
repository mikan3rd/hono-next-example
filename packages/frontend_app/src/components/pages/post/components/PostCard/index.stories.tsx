import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { getGetUserLoginMockHandler } from "../../../../../client/index.msw";
import { useUserContext } from "../../../../../context/UserContext";
import {
  createStoryPost,
  createStoryUser,
  STORY_POST_CONTENT,
  STORY_UPDATED_AT,
  storyNotOwnerUser,
} from "../../../../../lib/storybook/mockData";
import { withI18n } from "../../../../../lib/storybook/withI18n";
import {
  mockSession,
  triggerAuthStateChange,
  waitForAuthStateChange,
} from "../../../../../supabase/client/mockFunc";
import { PostCard } from ".";

type Props = ComponentProps<typeof PostCard>;
const user = createStoryUser();

const meta = {
  component: PostCard,
  tags: ["autodocs"],
  parameters: {
    msw: {
      handlers: [getGetUserLoginMockHandler(user)],
    },
  },
  decorators: [
    withI18n,
    (StoryFn) => {
      const { sessionState } = useUserContext();
      return (
        <>
          <StoryFn />
          <div className="hidden">{sessionState.status}</div>
        </>
      );
    },
  ],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const createMockPost = (
  overrides: Partial<Props["post"]> = {},
): Props["post"] => createStoryPost({ user, ...overrides });

const getPostCardElements = async (canvas: ReturnType<typeof within>) => {
  const postCard = await canvas.findByTestId(
    "PostCard",
    {},
    { timeout: 15_000 },
  );
  const header = within(postCard).getByTestId("PostCard-header");
  const content = within(postCard).getByTestId("PostCard-content");
  const date = within(postCard).getByTestId("PostCard-date");

  return { postCard, header, content, date };
};

const enterEditMode = async (canvas: ReturnType<typeof within>) => {
  const { header, content } = await getPostCardElements(canvas);

  const actionsButton = within(header).getByRole("button", { name: "Actions" });
  await expect(actionsButton).toBeEnabled();
  await userEvent.click(actionsButton);

  const editItem = screen.getByRole("menuitem", {
    name: "Edit",
  });
  await waitFor(async () => {
    await expect(editItem).toBeVisible();
  });
  await userEvent.click(editItem);

  const textarea = await within(content).findByRole("textbox");
  await expect(textarea).toBeVisible();
  await expect(textarea).toHaveValue(STORY_POST_CONTENT);

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

const waitForLoggedIn = async (canvas: ReturnType<typeof within>) => {
  await waitForAuthStateChange();
  triggerAuthStateChange("SIGNED_IN", mockSession);
  await waitFor(async () => {
    await expect(canvas.getByText("loggedIn")).toBeInTheDocument();
  });
};

export const CreatedPost: Story = {
  args: {
    post: createMockPost(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoggedIn(canvas);
    const { header, content, date } = await getPostCardElements(canvas);

    await expect(header).toBeVisible();
    await expect(
      within(header).getByText(args.post.user.display_name),
    ).toBeVisible();
    await verifyPostStatus(header, false);
    await expect(
      within(header).getByRole("button", { name: "Actions" }),
    ).toBeVisible();
    await expect(
      within(header).queryByRole("button", { name: "Edit" }),
    ).toBeNull();
    await expect(
      within(header).queryByRole("button", { name: "Delete" }),
    ).toBeNull();

    await expect(content).toBeVisible();
    await expect(within(content).getByText(args.post.content)).toBeVisible();

    await expect(date).toBeVisible();
    await verifyDateDisplay(date, false);
  },
};

export const UpdatedPost: Story = {
  args: {
    post: createMockPost({
      updated_at: STORY_UPDATED_AT,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForLoggedIn(canvas);
    const { header, date } = await getPostCardElements(canvas);

    await verifyPostStatus(header, true);
    await verifyDateDisplay(date, true);
  },
};

export const NotOwnerPost: Story = {
  args: {
    post: createMockPost({
      user: storyNotOwnerUser,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForLoggedIn(canvas);
    const { header } = await getPostCardElements(canvas);
    const actionsButton = within(header).queryByRole("button", {
      name: "Actions",
    });
    await expect(actionsButton).toBeNull();
  },
};

export const EditPost: Story = {
  args: {
    post: createMockPost(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitForLoggedIn(canvas);
    const { content } = await enterEditMode(canvas);

    const saveButton = within(content).getByRole("button", { name: "Save" });
    await expect(saveButton).toBeEnabled();

    const cancelButton = within(content).getByRole("button", {
      name: "Cancel",
    });
    await expect(cancelButton).toBeEnabled();
  },
};

export const EditAndSavePost: Story = {
  args: {
    post: createMockPost(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitForLoggedIn(canvas);
    const { content, textarea } = await enterEditMode(canvas);

    const saveButton = within(content).getByRole("button", { name: "Save" });
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

    await waitForLoggedIn(canvas);
    const { content, textarea } = await enterEditMode(canvas);

    const cancelButton = within(content).getByRole("button", {
      name: "Cancel",
    });
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

    await waitForLoggedIn(canvas);
    const { header } = await getPostCardElements(canvas);

    const actionsButton = within(header).getByRole("button", {
      name: "Actions",
    });
    await expect(actionsButton).toBeEnabled();
    await userEvent.click(actionsButton);

    const deleteItem = screen.getByRole("menuitem", {
      name: "Delete",
    });
    await waitFor(async () => {
      await expect(deleteItem).toBeVisible();
    });
    await userEvent.click(deleteItem);
  },
};
