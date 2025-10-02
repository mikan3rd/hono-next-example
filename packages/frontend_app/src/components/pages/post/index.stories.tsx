import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { waitFor } from "storybook/test";
import {
  __debugListeners,
  __triggerAuthStateChange,
} from "#src/supabase/client";
import { PostIndex } from ".";

const meta = {
  component: PostIndex,
  tags: ["autodocs"],
} satisfies Meta<typeof PostIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    await waitFor(
      async () => {
        const listenerCount = __debugListeners.count;
        console.info("Checking listeners count:", listenerCount);
        if (listenerCount === 0) {
          throw new Error("No listeners registered yet");
        }
      },
      { timeout: 5000 },
    );

    __triggerAuthStateChange("SIGNED_OUT", null);
  },
};
