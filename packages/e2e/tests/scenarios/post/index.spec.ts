import { expect, test } from "@playwright/test";
import { env } from "../../env";

test.beforeEach(async () => {
  const res = await fetch(`${env.BACKEND_APP_SERVER_URL}/initialize`, {
    method: "POST",
  });
  expect(res.status).toBe(200);
});

test.describe("post page", () => {
  test.skip("has title and message", async ({ page }) => {
    await page.goto("/post");
    await expect(page).toHaveTitle(/posts: 0/);
    await expect(page.getByText("No posts yet")).toBeVisible();
    await expect(page).toHaveScreenshot();
  });

  test("post content is displayed", async ({ page }, { project }) => {
    await page.goto("/post");
    const postContent = `This is test content for ${project.name}`;
    const textArea = page.getByPlaceholder("Write your post content here...");
    await textArea.fill(postContent);
    await page.getByRole("button", { name: "Create Post" }).click();
    await expect(textArea).toHaveValue("");
    await expect(page.getByText(postContent)).toBeVisible();
  });
});
