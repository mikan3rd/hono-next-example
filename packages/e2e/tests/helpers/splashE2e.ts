import { expect, type Page } from "@playwright/test";

export async function waitForFirstVisitSplashComplete(
  page: Page,
): Promise<void> {
  await expect(page.getByTestId("splash-screen")).not.toBeVisible({
    timeout: 15_000,
  });
}
