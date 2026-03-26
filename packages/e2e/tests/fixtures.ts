import { test as base, expect } from "@chromatic-com/playwright";
import { attachConsoleErrorThrow } from "./helpers/attachConsoleErrorThrow";

/** Chromatic の `test` を拡張し、すべてのテストでブラウザの console error を検知する */
export const test = base.extend({
  page: async ({ page }, use) => {
    attachConsoleErrorThrow(page);
    await use(page);
  },
});

export { expect };
