import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { fn } from "storybook/test";
import { Button } from "../Button";
import { Toaster } from ".";

const meta = {
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultToast: Story = {
  render: () => {
    const showToast = () => {
      toast("Event has been created");
    };
    return (
      <>
        <Button onClick={showToast}>Show Toast</Button>
        <Toaster />
      </>
    );
  },
};

export const SuccessToast: Story = {
  render: () => {
    const showToast = () => {
      toast.success("Event has been created");
    };
    return (
      <>
        <Button onClick={showToast}>Show Toast</Button>
        <Toaster />
      </>
    );
  },
};

export const ErrorToast: Story = {
  render: () => {
    const showToast = () => {
      toast.error("Event has been created");
    };
    return (
      <>
        <Button onClick={showToast}>Show Toast</Button>
        <Toaster />
      </>
    );
  },
};

export const WarningToast: Story = {
  render: () => {
    const showToast = () => {
      toast.warning("Event has been created");
    };
    return (
      <>
        <Button onClick={showToast}>Show Toast</Button>
        <Toaster />
      </>
    );
  },
};

export const InfoToast: Story = {
  render: () => {
    const showToast = () => {
      toast.info("Event has been created");
    };
    return (
      <>
        <Button onClick={showToast}>Show Toast</Button>
        <Toaster />
      </>
    );
  },
};

export const DefaultToastWithOptions: Story = {
  render: () => {
    const showToast = () => {
      toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: fn(),
        },
      });
    };
    return (
      <>
        <Button onClick={showToast}>Show Toast</Button>
        <Toaster />
      </>
    );
  },
};
