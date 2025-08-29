import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PostCard } from ".";
import { fn } from "storybook/test";

const meta = {
  component: PostCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    post: {
      id: 1,
      content: "Hello, world!",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
    },
    invalidatePostsQuery: fn(),
  },
};
