import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { app } from "../../apps";
import { env } from "../../env";

describe("initializeApp", () => {
  describe("/", () => {
    const subject = () => app.request("/initialize", { method: "POST" });

    afterEach(() => {
      mock.restore();
    });

    describe("when ENABLE_DB_INITIALIZE is true", () => {
      beforeEach(() => {
        mock.module("../../env", () => ({
          env: {
            ENABLE_DB_INITIALIZE: true,
          },
        }));
      });

      it("should return 200 Response", async () => {
        expect(env.ENABLE_DB_INITIALIZE).toBe(true);

        const res = await subject();
        expect(res.status).toBe(200);
      });
    });

    describe("when ENABLE_DB_INITIALIZE is false", () => {
      beforeEach(() => {
        mock.module("../../env", () => ({
          env: {
            ENABLE_DB_INITIALIZE: false,
          },
        }));
      });

      it("should return 403 Response", async () => {
        expect(env.ENABLE_DB_INITIALIZE).toBe(false);

        const res = await subject();
        expect(res.status).toBe(403);
      });
    });
  });
});
