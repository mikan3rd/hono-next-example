import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { expect, fn, userEvent, within } from "storybook/test";
import { Input } from ".";
import { Label } from "../Label";
import { Button } from "../Button";

const meta = {
  component: Input,
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "email",
    placeholder: "Email",
  }
};

export const File: Story = {
  render: () => {
    return(
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
    );
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    type: "email",
    placeholder: "Email",
  }
}

export const WithLabel: Story = {
  render: () => {
    return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
    )
  }
}

export const WithButton: Story = {
  render: () => {
    return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="email" placeholder="Email" />
      <Button type="submit" variant="outline">
        Subscribe
      </Button>
    </div>
    )
  }
}

// TODO: Form
