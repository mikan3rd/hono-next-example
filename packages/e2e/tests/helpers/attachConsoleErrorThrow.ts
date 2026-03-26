import type { Page } from "@playwright/test";

/** Fail the test when the browser logs a console error (helps catch React/runtime issues). */
export function attachConsoleErrorThrow(page: Page): void {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const error = new Error(msg.text());
      error.name = "ConsoleError";
      throw error;
    }
  });
}
