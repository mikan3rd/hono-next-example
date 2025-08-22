import { expect, test } from "@playwright/test";

test.describe("post page", () => {
  test("has title and message", async ({ page }) => {
    await page.goto("/post");
    await expect(page).toHaveTitle(/posts: 0/);
    await expect(page.getByText("No posts yet")).toBeVisible();
    await expect(page).toHaveScreenshot();
  });
});
