import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { useUserContext } from "../../../../../context/UserContext";
import {
  mockSession,
  triggerAuthStateChange,
  waitForAuthStateChange,
} from "../../../../../supabase/client/mockFunc";
import { PostForm } from ".";

const meta = {
  component: PostForm,
  tags: ["autodocs"],
} satisfies Meta<typeof PostForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const { sessionState } = useUserContext();
    return (
      <>
        <PostForm />
        <div className="hidden">{sessionState.status}</div>
      </>
    );
  },

  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    await waitForAuthStateChange();
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

    await userEvent.click(createPostButton);
    await waitFor(async () => {
      await expect(input).toHaveValue("");
    });
    await expect(createPostButton).toBeDisabled();
  },
};
