import { env } from "../../env";
import { expect, test } from "../../fixtures";

test.beforeEach(async () => {
  const res = await fetch(`${env.BACKEND_APP_SERVER_URL}/initialize`, {
    method: "POST",
  });
  expect(res.status).toBe(200);
});

test("first visit shows splash then it disappears", async ({ page }) => {
  await page.goto("/en");
  const splash = page.getByTestId("splash-screen");
  await expect(splash).toBeVisible({ timeout: 15_000 });
  await expect(splash).toBeHidden({ timeout: 15_000 });
});

test("reload in same tab does not show splash again", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByTestId("splash-screen")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByTestId("splash-screen")).toBeHidden({
    timeout: 15_000,
  });
  await page.reload();
  await expect(page.getByTestId("splash-screen")).toHaveCount(0);
});
