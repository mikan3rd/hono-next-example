import { beforeEach, describe, expect, it } from "bun:test";
import { app } from "../../apps";

describe("initializeApp", () => {
  describe("/", () => {
    const subject = () => app.request("/initialize");

    describe("when ENABLE_DB_INITIALIZE is true", () => {
      beforeEach(() => {
        process.env.ENABLE_DB_INITIALIZE = "true";
      });

      it("should return 200 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(200);
      });
    });

    describe("when ENABLE_DB_INITIALIZE is false", () => {
      beforeEach(() => {
        process.env.ENABLE_DB_INITIALIZE = "false";
      });

      it("should return 403 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(403);
      });
    });
  });
});
