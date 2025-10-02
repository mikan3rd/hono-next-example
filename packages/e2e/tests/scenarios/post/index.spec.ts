import { expect, test } from "@chromatic-com/playwright";
import { env } from "../../env";

test.use({
  ignoreSelectors: [
    `[data-testid="PostCard-publicId"]`,
    `[data-testid="PostCard-date"]`,
  ],
});

test.beforeEach(async () => {
  const res = await fetch(`${env.BACKEND_APP_SERVER_URL}/initialize`, {
    method: "POST",
  });
  expect(res.status).toBe(200);
  console.info("backend app initialized");
});

test("post page", async ({ page }) => {
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

    await displayNameInput.fill("Test User");
    await expect(signUpBtn).toBeEnabled();

    await signUpBtn.click();
    await expect(signUpBtn).not.toBeVisible();
    await expect(signUpDialogBtn).not.toBeVisible();
  });

  const createTextArea = page.getByPlaceholder(
    "Write your post content here...",
  );
  const createPostButton = page.getByRole("button", { name: "Create Post" });

  const firstPostContent = `This is first post content`;

  const postCards = page.getByTestId("PostCard");
  const firstPostCard = page.getByTestId("PostCard").first();

  await test.step("create posts", async () => {
    await createTextArea.fill(firstPostContent);
    await createPostButton.click();

    await expect(firstPostCard).toBeVisible();
  });

  await test.step("update post", async () => {
    const editTextArea = firstPostCard.getByRole("textbox");
    const updatedPostContent = `This is updated post content`;
    const editButton = firstPostCard.getByRole("button", { name: "Edit" });

    await test.step("check post edit button", async () => {
      await editButton.click();
      await expect(editTextArea).toBeVisible();
    });

    await test.step("cancel update post", async () => {
      await firstPostCard
        .getByRole("textbox")
        .fill("This is not updated post content");
      await firstPostCard.getByRole("button", { name: "Cancel" }).click();
      await expect(firstPostCard.getByText(firstPostContent)).toBeVisible();
    });

    await test.step("update post successfully", async () => {
      await expect(firstPostCard.getByText("New")).toBeVisible();

      await editButton.click();
      await editTextArea.fill(updatedPostContent);
      await firstPostCard.getByRole("button", { name: "Save" }).click();
      await expect(firstPostCard.getByText(updatedPostContent)).toBeVisible();
      await expect(firstPostCard.getByText("New")).not.toBeVisible();
    });
  });

  await test.step("delete second post", async () => {
    await firstPostCard.getByRole("button", { name: "Delete" }).click();
    await expect(firstPostCard).not.toBeVisible();
  });

  await test.step("create multiple posts", async () => {
    const contents = Array.from(
      { length: 3 },
      (_, index) => `This is No.${index + 1} post content`,
    );
    for (const content of contents) {
      await expect(createTextArea).toHaveValue("");
      await createTextArea.fill(content);
      await createPostButton.click();
    }
    await expect(postCards).toHaveCount(contents.length);
  });

  await test.step("logout", async () => {
    const logoutDialogBtn = page.getByRole("button", {
      name: "Sign Out Dialog",
    });
    const logoutBtn = page.getByRole("button", { name: "Sign Out" });

    await expect(logoutDialogBtn).toBeVisible();

    await logoutDialogBtn.click();
    await expect(logoutBtn).toBeVisible();

    await logoutBtn.click();
    await expect(logoutBtn).not.toBeVisible();
    await expect(logoutDialogBtn).not.toBeVisible();
  });
});
