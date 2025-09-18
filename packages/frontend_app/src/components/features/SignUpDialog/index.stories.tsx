import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignUpDialog } from ".";

const meta = {
  component: SignUpDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof SignUpDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
