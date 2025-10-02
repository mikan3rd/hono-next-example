import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PostIndex } from ".";

const meta = {
  component: PostIndex,
  tags: ["autodocs"],
} satisfies Meta<typeof PostIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
