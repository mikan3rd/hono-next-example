import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from ".";

const meta = {
  component: EmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
