import { expect, test } from "@playwright/test";

test.describe("post page", () => {
  // TODO: データを初期化した状態でテストする
  test.skip("has title and message", async ({ page }) => {
    await page.goto("/post");
    await expect(page).toHaveTitle(/posts: 0/);
    await expect(page.getByText("No posts yet")).toBeVisible();
    await expect(page).toHaveScreenshot();
  });

  test("post content is displayed", async ({ page }) => {
    await page.goto("/post");
    const postContent = "This is test content";
    await page
      .getByPlaceholder("Write your post content here...")
      .fill(postContent);
    await page.getByRole("button", { name: "Create Post" }).click();
    await expect(
      page.getByRole("button", { name: "Create Post" }),
    ).toBeDisabled();
    await expect(page.getByText(postContent)).toBeVisible();
  });
});
