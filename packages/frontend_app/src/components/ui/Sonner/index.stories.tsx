import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
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

const testToastDisplay = async (canvas: ReturnType<typeof within>) => {
  const button = canvas.getByRole("button");
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(canvas.getByText("Event has been created")).toBeVisible();
  });
};

export const DefaultToast: Story = {
  render: () => {
    const showToast = () => {
      toast("Event has been created");
    };
    return <Button onClick={showToast}>Show Toast</Button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testToastDisplay(canvas);
  },
};

export const SuccessToast: Story = {
  render: () => {
    const showToast = () => {
      toast.success("Event has been created");
    };
    return <Button onClick={showToast}>Show Toast</Button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testToastDisplay(canvas);
  },
};

export const ErrorToast: Story = {
  render: () => {
    const showToast = () => {
      toast.error("Event has been created");
    };
    return <Button onClick={showToast}>Show Toast</Button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testToastDisplay(canvas);
  },
};

export const WarningToast: Story = {
  render: () => {
    const showToast = () => {
      toast.warning("Event has been created");
    };
    return <Button onClick={showToast}>Show Toast</Button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testToastDisplay(canvas);
  },
};

export const InfoToast: Story = {
  render: () => {
    const showToast = () => {
      toast.info("Event has been created");
    };
    return <Button onClick={showToast}>Show Toast</Button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testToastDisplay(canvas);
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
    return <Button onClick={showToast}>Show Toast</Button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testToastDisplay(canvas);
    await expect(
      canvas.getByText("Sunday, December 03, 2023 at 9:00 AM"),
    ).toBeVisible();
    await expect(canvas.getByText("Undo")).toBeVisible();
  },
};
