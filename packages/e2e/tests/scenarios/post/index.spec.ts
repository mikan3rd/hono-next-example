import {
  expect,
  type PageAssertionsToHaveScreenshotOptions,
  test,
} from "@playwright/test";
import { env } from "../../env";

test.beforeEach(async () => {
  const res = await fetch(`${env.BACKEND_APP_SERVER_URL}/initialize`, {
    method: "POST",
  });
  expect(res.status).toBe(200);
});

test("post page", async ({ page }) => {
  const screenshotOptions: PageAssertionsToHaveScreenshotOptions = {
    fullPage: true,
    mask: [page.getByText(/Created:/), page.getByText(/Updated:/)],
  };

  await test.step("visit post page", async () => {
    await page.goto("/post");
    await expect(page).toHaveTitle(/posts: 0/);
    await expect(page.getByText("No posts yet")).toBeVisible();
    await expect.soft(page).toHaveScreenshot(screenshotOptions);
  });

  const createTextArea = page.getByPlaceholder(
    "Write your post content here...",
  );
  const firstPostContent = `This is first post content`;
  const secondPostContent = `This is second post content`;

  await test.step("create posts", async () => {
    await test.step("create first post", async () => {
      await createTextArea.fill(firstPostContent);
      await page.getByRole("button", { name: "Create Post" }).click();
      await expect(createTextArea).toHaveValue("");

      const postCards = page.getByTestId("postCard");
      const firstPostCard = postCards.filter({ hasText: firstPostContent });
      await expect(postCards).toHaveCount(1);
      await expect(firstPostCard).toBeVisible();
      await expect.soft(page).toHaveScreenshot(screenshotOptions);
    });

    await test.step("create second post", async () => {
      await createTextArea.fill(secondPostContent);
      await page.getByRole("button", { name: "Create Post" }).click();
      await expect(createTextArea).toHaveValue("");

      const postCards = page.getByTestId("postCard");
      const secondPostCard = postCards.filter({ hasText: secondPostContent });
      await expect(secondPostCard).toBeVisible();
      await expect.soft(page).toHaveScreenshot(screenshotOptions);
    });
  });

  const postCards = page.getByTestId("postCard");
  const firstPostCard = postCards.filter({ hasText: firstPostContent });
  const secondPostCard = postCards.filter({ hasText: secondPostContent });

  const updatedPostContent = `This is updated post content`;
  await test.step("update post", async () => {
    const editTextArea = firstPostCard.getByRole("textbox");

    await test.step("check first post edit button", async () => {
      await firstPostCard.getByRole("button", { name: "Edit" }).click();
      await expect(editTextArea).toBeVisible();
      await expect.soft(page).toHaveScreenshot(screenshotOptions);
    });

    await test.step("update first post", async () => {
      await expect(firstPostCard.getByText(firstPostContent)).toBeVisible();
      await expect(firstPostCard.getByText("New")).toBeVisible();

      await editTextArea.fill(updatedPostContent);
      await page.getByRole("button", { name: "Save" }).click();
      const updatedPostCard = postCards.filter({ hasText: updatedPostContent });
      await expect(updatedPostCard).toBeVisible();

      await expect(firstPostCard.getByText(firstPostContent)).not.toBeVisible();
      await expect(firstPostCard.getByText("New")).not.toBeVisible();

      await expect.soft(page).toHaveScreenshot(screenshotOptions);
    });

    await test.step("cancel update second post", async () => {
      await secondPostCard.getByRole("button", { name: "Edit" }).click();
      const notUpdatedPostContent = "This is not updated post content";
      await secondPostCard.getByRole("textbox").fill(notUpdatedPostContent);
      const updatingPostCard = postCards.filter({
        hasText: notUpdatedPostContent,
      });
      await expect(updatingPostCard).toBeVisible();

      await updatingPostCard.getByRole("button", { name: "Cancel" }).click();
      await expect(secondPostCard.getByText(secondPostContent)).toBeVisible();
      await expect(updatingPostCard).not.toBeVisible();
    });
  });

  await test.step("delete second post", async () => {
    await secondPostCard.getByRole("button", { name: "Delete" }).click();
    await expect(secondPostCard).not.toBeVisible();
    await expect.soft(page).toHaveScreenshot(screenshotOptions);
  });
});
