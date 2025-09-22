import { expect, takeSnapshot, test } from "@chromatic-com/playwright";

test.use({
  ignoreSelectors: [`[data-testid="LogoutDialog-description"]`],
});

test("session page", async ({ page }, testInfo) => {
  await test.step("login", async () => {
    const signUpDialogBtn = page.getByRole("button", {
      name: "Sign Up Dialog",
    });
    const signUpBtn = page.getByRole("button", { name: "Sign Up" });

    await page.goto("/login");
    await expect(signUpDialogBtn).toBeVisible();
    await takeSnapshot(page, testInfo);

    await signUpDialogBtn.click();
    await expect(signUpBtn).toBeVisible();
    await takeSnapshot(page, testInfo);

    await signUpBtn.click();
    await expect(signUpBtn).not.toBeVisible();
    await expect(signUpDialogBtn).not.toBeVisible();
  });

  await test.step("logout", async () => {
    const logoutDialogBtn = page.getByRole("button", {
      name: "Sign Out Dialog",
    });
    const logoutBtn = page.getByRole("button", { name: "Sign Out" });

    await expect(page).toHaveURL("/logout");
    await takeSnapshot(page, testInfo);

    await expect(logoutDialogBtn).toBeVisible();
    await takeSnapshot(page, testInfo);

    await logoutDialogBtn.click();
    await expect(logoutBtn).toBeVisible();
    await takeSnapshot(page, testInfo);

    await logoutBtn.click();
    await expect(logoutBtn).not.toBeVisible();
    await expect(logoutDialogBtn).not.toBeVisible();
  });
});
