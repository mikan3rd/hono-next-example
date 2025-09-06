import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from ".";

const meta = {
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await expect(button).toBeEnabled();
    await expect(button).toHaveTextContent("Button");

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <ChevronRightIcon />
      </Button>
    </div>
  ),
};

export const Icon: Story = {
  args: {
    children: <ChevronRightIcon />,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <ChevronRightIcon />
        With Icon
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Loader2Icon className="animate-spin" />
        Please wait
      </>
    ),
  },
};

export const LinkAsButton: Story = {
  args: {
    asChild: true,
    children: <Link href="/">Link</Link>,
  },
};
