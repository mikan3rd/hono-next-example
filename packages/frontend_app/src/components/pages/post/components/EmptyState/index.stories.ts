import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { withI18n } from "../../../../../lib/storybook/withI18n";
import { EmptyState } from ".";

const meta = {
  component: EmptyState,
  tags: ["autodocs"],
  decorators: [withI18n],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
