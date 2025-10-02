import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import {
  __debugListeners,
  __triggerAuthStateChange,
  mockSession,
} from "#src/supabase/client";
import { getGetPostsMockHandler } from "../../../client/index.msw";
import { PostIndex } from ".";

const meta = {
  component: PostIndex,
  tags: ["autodocs"],
  beforeEach: () => {
    faker.seed(123);
  },
} satisfies Meta<typeof PostIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

// TODO: 共通化
const waitForAuthStateChange = async () => {
  await waitFor(
    async () => {
      const listenerCount = __debugListeners.count;
      if (listenerCount === 0) {
        throw new Error("No listeners registered yet");
      }
    },
    { timeout: 5000 },
  );
};

const waitForLoggedOut = async (canvas: ReturnType<typeof within>) => {
  __triggerAuthStateChange("SIGNED_OUT", null);
  await waitFor(async () => {
    await expect(canvas.getByText("Sign Up Dialog")).toBeInTheDocument();
  });
};

const waitForLoggedIn = async (canvas: ReturnType<typeof within>) => {
  __triggerAuthStateChange("SIGNED_IN", mockSession);
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
    await expect(signUpBtn).toBeVisible();
  },
};
