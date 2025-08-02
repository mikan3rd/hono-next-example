import { expect, test } from "@playwright/test";

test.describe("hello page", () => {
  test("has title and message", async ({ page }) => {
    await page.goto("/hello");
    await expect(page).toHaveTitle(/message: Hello Hono!/);
  });
});
