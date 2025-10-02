import { faker } from "@faker-js/faker";
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
  beforeEach: () => {
    faker.seed(123);
  },
} satisfies Meta<typeof PostIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    // TODO: 共通化
    await waitFor(
      async () => {
        const listenerCount = __debugListeners.count;
        if (listenerCount === 0) {
          throw new Error("No listeners registered yet");
        }
      },
      { timeout: 5000 },
    );

    __triggerAuthStateChange("SIGNED_OUT", null);
  },
};
