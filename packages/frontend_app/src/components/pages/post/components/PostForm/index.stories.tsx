import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  __debugListeners,
  mockSession,
  __triggerAuthStateChange as triggerAuthStateChange,
} from "#src/supabase/client";
import { useUserContext } from "../../../../../context/UserContext";
import { PostForm } from ".";

const meta = {
  component: PostForm,
  tags: ["autodocs"],
} satisfies Meta<typeof PostForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const { sessionStatus } = useUserContext();
    return (
      <>
        <PostForm />
        <div className="hidden">{sessionStatus}</div>
      </>
    );
  },

  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    // リスナーが登録されるまで待つ
    await waitFor(
      async () => {
        console.info("Waiting for listener registration...");
        console.info("Debug listeners count:", __debugListeners.count);
      },
      { timeout: 5000 },
    );

    // リスナー登録完了を明示的に待つ
    await waitFor(
      async () => {
        const listenerCount = __debugListeners.count;
        console.info("Checking listeners count:", listenerCount);
        if (listenerCount === 0) {
          throw new Error("No listeners registered yet");
        }
        console.info("Listeners registered successfully");
      },
      { timeout: 5000 },
    );

    console.info("Triggering SIGNED_IN with session:", mockSession);
    console.info("Before trigger - listeners count:", __debugListeners.count);
    triggerAuthStateChange("SIGNED_IN", mockSession);

    await waitFor(async () => {
      await expect(canvas.getByText("loggedIn")).toBeInTheDocument();
    });

    const input = canvas.getByRole("textbox");
    await expect(input).toHaveValue("");
    const createPostButton = canvas.getByRole("button", {
      name: "Create Post",
    });
    await expect(createPostButton).toBeDisabled();

    await userEvent.type(input, "test");
    await expect(createPostButton).toBeEnabled();

    console.info("click createPostButton");
    await userEvent.click(createPostButton);
    await waitFor(async () => {
      await expect(input).toHaveValue("");
    });
    await expect(createPostButton).toBeDisabled();
  },
};
