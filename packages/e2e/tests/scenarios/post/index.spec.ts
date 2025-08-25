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
  await test.step("create posts", async () => {
    await test.step("create first post", async () => {
      await createTextArea.fill(firstPostContent);
      await page.getByRole("button", { name: "Create Post" }).click();
      await expect(createTextArea).toHaveValue("");
      await expect(page.getByText(firstPostContent)).toBeVisible();
      await expect.soft(page).toHaveScreenshot(screenshotOptions);
    });

    await test.step("create second post", async () => {
      const secondPostContent = `This is second post content`;
      await createTextArea.fill(secondPostContent);
      await page.getByRole("button", { name: "Create Post" }).click();
      await expect(createTextArea).toHaveValue("");
      await expect(page.getByText(secondPostContent)).toBeVisible();
      await expect.soft(page).toHaveScreenshot(screenshotOptions);
    });
  });

  const updatedPostContent = `This is updated post content`;
  await test.step("update post", async () => {
    const editTextArea = page.getByRole("textbox").nth(1);

    await test.step("check first post edit button", async () => {
      await page.getByRole("button", { name: "Edit" }).nth(1).click();
      await expect(editTextArea).toBeVisible();
      await expect.soft(page).toHaveScreenshot(screenshotOptions);
    });

    await test.step("update first post", async () => {
      await expect(page.getByText(firstPostContent)).toBeVisible();
      await expect(page.getByText("New").nth(2)).toBeVisible();

      await editTextArea.fill(updatedPostContent);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText(updatedPostContent)).toBeVisible();

      await expect(page.getByText(firstPostContent)).not.toBeVisible();
      await expect(page.getByText("New").nth(2)).not.toBeVisible();

      await expect.soft(page).toHaveScreenshot(screenshotOptions);
    });

    await test.step("cancel update first post", async () => {
      await page.getByRole("button", { name: "Edit" }).nth(1).click();
      await editTextArea.fill("This is not updated post content");
      await page.getByRole("button", { name: "Cancel" }).click();
      await expect(page.getByText(updatedPostContent)).toBeVisible();
    });
  });

  await test.step("delete first post", async () => {
    await page.getByRole("button", { name: "Delete" }).nth(1).click();
    await expect(page.getByText(updatedPostContent)).not.toBeVisible();
    await expect.soft(page).toHaveScreenshot(screenshotOptions);
  });
});
