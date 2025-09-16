import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId } from "react";
import { Button } from "../Button";
import { Label } from "../Label";
import { Input } from ".";

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
  },
};

export const File: Story = {
  render: () => {
    const pictureId = useId();
    return (
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor={pictureId}>Picture</Label>
        <Input id={pictureId} type="file" />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    type: "email",
    placeholder: "Email",
  },
};

export const WithLabel: Story = {
  render: () => {
    const emailId = useId();
    return (
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor={emailId}>Email</Label>
        <Input type="email" id={emailId} placeholder="Email" />
      </div>
    );
  },
};

export const WithButton: Story = {
  render: () => {
    return (
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input type="email" placeholder="Email" />
        <Button type="submit" variant="outline">
          Subscribe
        </Button>
      </div>
    );
  },
};

// TODO: Form
