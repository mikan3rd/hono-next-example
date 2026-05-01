import { test as base, expect } from "@playwright/test";
import { attachConsoleErrorThrow } from "./helpers/attachConsoleErrorThrow";

/** `test` を拡張し、すべてのテストでブラウザの console error を検知する */
export const test = base.extend({
  page: async ({ page }, use) => {
    attachConsoleErrorThrow(page);
    await use(page);
  },
});

export { expect };
