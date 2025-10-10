import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import {
  getBackendAppOpenAPIMock,
  getGetPostsMockHandler,
  getGetPostsResponseMock,
  getGetUserLoginMockHandler,
} from "../../../client/index.msw";
import type { User } from "../../../client/index.schemas";
import {
  mockSession,
  triggerAuthStateChange,
  waitForAuthStateChange,
} from "../../../supabase/client/mockFunc";
import { PostIndex } from ".";

const user: User = {
  public_id: faker.string.uuid(),
  display_name: faker.person.fullName(),
};

const anotherUser: User = {
  public_id: faker.string.uuid(),
  display_name: faker.person.fullName(),
};

const GetLoginUserMockHandler = getGetUserLoginMockHandler(user);

const posts = getGetPostsResponseMock().posts.map((post) => ({
  ...post,
  user: faker.helpers.arrayElement([user, anotherUser]),
}));

const meta = {
  component: PostIndex,
  tags: ["autodocs"],
  parameters: {
    msw: {
      handlers: [
        GetLoginUserMockHandler,
        getGetPostsMockHandler({ posts }),
        ...getBackendAppOpenAPIMock(),
      ],
    },
  },
} satisfies Meta<typeof PostIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

const waitForLoggedOut = async (canvas: ReturnType<typeof within>) => {
  triggerAuthStateChange("SIGNED_OUT", null);
  await waitFor(async () => {
    await expect(canvas.getByText("Sign Up Dialog")).toBeInTheDocument();
  });
};

const waitForLoggedIn = async (canvas: ReturnType<typeof within>) => {
  triggerAuthStateChange("SIGNED_IN", mockSession);
  await waitFor(async () => {
    await expect(canvas.getByText("Sign Out Dialog")).toBeInTheDocument();
  });
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForAuthStateChange();
    await waitForLoggedOut(canvas);
  },
};

export const WithLoggedIn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForAuthStateChange();
    await waitForLoggedIn(canvas);
  },
};

export const NoPosts: Story = {
  parameters: {
    msw: {
      handlers: [getGetPostsMockHandler({ posts: [] })],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForAuthStateChange();
    await waitForLoggedOut(canvas);
  },
};

export const OnePost: Story = {
  parameters: {
    msw: {
      handlers: [
        getGetPostsMockHandler({
          posts: [
            (() => {
              const post = getGetPostsResponseMock().posts[0];
              if (!post) {
                throw new Error("Post not found");
              }
              return post;
            })(),
          ],
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForAuthStateChange();
    await waitForLoggedIn(canvas);
  },
};

export const IsEditing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForAuthStateChange();
    await waitForLoggedIn(canvas);

    const postCards = await canvas.findAllByTestId("PostCard");
    const postCard = postCards[0];

    if (!postCard) {
      throw new Error("Post card not found");
    }

    const header = within(postCard).getByTestId("PostCard-header");
    await waitFor(async () => {
      within(header).getByRole("button", { name: "Actions" });
    });
    const editButton = within(header).getByRole("button", { name: "Actions" });
    await userEvent.click(editButton);

    const editItem = screen.getByRole("menuitem", {
      name: "Edit",
    });
    await waitFor(async () => {
      await expect(editItem).toBeVisible();
    });
    await userEvent.click(editItem);

    const content = within(postCard).getByTestId("PostCard-content");
    await waitFor(async () => {
      const textarea = within(content).getByRole("textbox");
      await expect(textarea).toBeVisible();
    });
  },
};

export const WithSignUpDialog: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForAuthStateChange();
    await waitForLoggedOut(canvas);

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

export const WithSignOutDialog: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForAuthStateChange();
    await waitForLoggedIn(canvas);

    const signOutDialogBtn = await canvas.findByRole("button", {
      name: "Sign Out Dialog",
    });
    await userEvent.click(signOutDialogBtn);

    const signOutBtn = await screen.findByRole("button", { name: "Sign Out" });
    await waitFor(async () => {
      await expect(signOutBtn).toBeVisible();
    });
  },
};
