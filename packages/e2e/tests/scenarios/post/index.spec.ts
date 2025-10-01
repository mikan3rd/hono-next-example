import { expect, takeSnapshot, test } from "@chromatic-com/playwright";
import { env } from "../../env";

test.use({
  ignoreSelectors: [`[data-testid="PostCard-date"]`],
});

test.beforeEach(async () => {
  const res = await fetch(`${env.BACKEND_APP_SERVER_URL}/initialize`, {
    method: "POST",
  });
  expect(res.status).toBe(200);
  console.info("backend app initialized");
});

test("post page", async ({ page }, testInfo) => {
  // TODO: 共通化
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const error = new Error(msg.text());
      error.name = "ConsoleError";
      throw error;
    }
  });

  await test.step("visit post page", async () => {
    await page.goto("/");
    await expect(page).toHaveTitle(/posts: 0/);
    await expect(page.getByText("No posts yet")).toBeVisible();
    await takeSnapshot(page, testInfo);
  });

  await test.step("login", async () => {
    const signUpDialogBtn = page.getByRole("button", {
      name: "Sign Up Dialog",
    });
    const signUpBtn = page.getByRole("button", { name: "Sign Up" });

    await expect(signUpDialogBtn).toBeVisible();

    await signUpDialogBtn.click();

    const displayNameInput = page.getByLabel("Your Name");
    await expect(displayNameInput).toBeVisible();
    await takeSnapshot(page, testInfo);

    await displayNameInput.fill("Test User");
    await expect(signUpBtn).toBeEnabled();

    await signUpBtn.click();
    await expect(signUpBtn).not.toBeVisible();
    await expect(signUpDialogBtn).not.toBeVisible();
  });

  const firstPostContent = `This is first post content`;
  const secondPostContent = `This is second post content`;

  const firstPostCard = page.getByTestId("PostCard-1");
  const secondPostCard = page.getByTestId("PostCard-2");

  await test.step("create posts", async () => {
    const createTextArea = page.getByPlaceholder(
      "Write your post content here...",
    );
    const createPostButton = page.getByRole("button", { name: "Create Post" });

    await test.step("create first post", async () => {
      await createTextArea.fill(firstPostContent);
      await createPostButton.click();
      await expect(createTextArea).toHaveValue("");

      await expect(firstPostCard).toBeVisible();
      await takeSnapshot(page, testInfo);
    });

    await test.step("create second post", async () => {
      await createTextArea.fill(secondPostContent);
      await createPostButton.click();
      await expect(createTextArea).toHaveValue("");

      await expect(secondPostCard).toBeVisible();
      await takeSnapshot(page, testInfo);
    });
  });

  await test.step("update post", async () => {
    const editTextArea = firstPostCard.getByRole("textbox");
    const updatedPostContent = `This is updated post content`;

    await test.step("check first post edit button", async () => {
      await firstPostCard.getByRole("button", { name: "Edit" }).click();
      await expect(editTextArea).toBeVisible();
      await takeSnapshot(page, testInfo);
    });

    await test.step("update first post", async () => {
      await expect(firstPostCard.getByText(firstPostContent)).toBeVisible();
      await expect(firstPostCard.getByText("New")).toBeVisible();

      await editTextArea.fill(updatedPostContent);
      await firstPostCard.getByRole("button", { name: "Save" }).click();
      await expect(firstPostCard.getByText(updatedPostContent)).toBeVisible();
      await expect(firstPostCard.getByText("New")).not.toBeVisible();
      await takeSnapshot(page, testInfo);
    });

    await test.step("cancel update second post", async () => {
      await secondPostCard.getByRole("button", { name: "Edit" }).click();
      await secondPostCard
        .getByRole("textbox")
        .fill("This is not updated post content");
      await secondPostCard.getByRole("button", { name: "Cancel" }).click();
      await expect(secondPostCard.getByText(secondPostContent)).toBeVisible();
    });
  });

  await test.step("delete second post", async () => {
    await secondPostCard.getByRole("button", { name: "Delete" }).click();
    await expect(secondPostCard).not.toBeVisible();
    await takeSnapshot(page, testInfo);
  });

  await test.step("logout", async () => {
    const logoutDialogBtn = page.getByRole("button", {
      name: "Sign Out Dialog",
    });
    const logoutBtn = page.getByRole("button", { name: "Sign Out" });

    await expect(logoutDialogBtn).toBeVisible();

    await logoutDialogBtn.click();
    await expect(logoutBtn).toBeVisible();
    await takeSnapshot(page, testInfo);

    await logoutBtn.click();
    await expect(logoutBtn).not.toBeVisible();
    await expect(logoutDialogBtn).not.toBeVisible();
  });
});
