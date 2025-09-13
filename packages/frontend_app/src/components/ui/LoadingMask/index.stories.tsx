import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoadingMask } from ".";

const meta = {
  component: LoadingMask,
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingMask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
