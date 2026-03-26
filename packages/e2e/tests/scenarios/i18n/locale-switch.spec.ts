import { expect, test } from "@chromatic-com/playwright";

test.describe("locale", () => {
  test("switch en to ja and back via header buttons", async ({ page }) => {
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const error = new Error(msg.text());
        error.name = "ConsoleError";
        throw error;
      }
    });

    await page.goto("/en");
    await expect(
      page.getByRole("heading", { level: 1, name: "Posts" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "日本語" }).click();
    await expect(page).toHaveURL(/\/ja\/?$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "投稿" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Posts" }),
    ).toBeVisible();
  });

  test("direct /ja shows Japanese UI and html lang", async ({ page }) => {
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const error = new Error(msg.text());
        error.name = "ConsoleError";
        throw error;
      }
    });

    await page.goto("/ja");
    await expect(
      page.getByRole("heading", { level: 1, name: "投稿" }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });
});
