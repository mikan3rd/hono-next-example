import { expect, test } from "@playwright/test";
import { env } from "../../env";

test.beforeEach(async () => {
  const res = await fetch(`${env.BACKEND_APP_SERVER_URL}/initialize`, {
    method: "POST",
  });
  expect(res.status).toBe(200);
});

test("post page", async ({ page }) => {
  await test.step("visit post page", async () => {
    await page.goto("/post");
    await expect(page).toHaveTitle(/posts: 0/);
    await expect(page.getByText("No posts yet")).toBeVisible();
    await expect.soft(page).toHaveScreenshot();
  });

  await test.step("create post", async () => {
    const postContent = `This is test content`;
    const textArea = page.getByPlaceholder("Write your post content here...");
    await textArea.fill(postContent);
    await page.getByRole("button", { name: "Create Post" }).click();
    await expect(textArea).toHaveValue("");
    await expect(page.getByText(postContent)).toBeVisible();
    await expect.soft(page).toHaveScreenshot({
      mask: [page.getByText(/Created:/)],
    });
  });
});
