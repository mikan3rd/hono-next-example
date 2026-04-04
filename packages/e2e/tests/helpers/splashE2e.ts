import { expect, type Page } from "@playwright/test";

export const SPLASH_SESSION_STORAGE_KEY = "splash_shown_tab_v1";

export async function waitForFirstVisitSplashComplete(
  page: Page,
): Promise<void> {
  await expect(page.getByTestId("splash-screen")).not.toBeVisible({
    timeout: 15_000,
  });
}
