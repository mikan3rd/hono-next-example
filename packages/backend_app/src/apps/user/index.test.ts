import { beforeEach, describe, expect, it } from "bun:test";
import type { ClientRequestOptions } from "hono/client";
import { testClient } from "hono/testing";
import { app } from "../../apps";

describe("userApp", () => {
  describe("signupRoute", () => {
    let headers: ClientRequestOptions["headers"];

    const subject = () =>
      testClient(app).user.signup.$post(undefined, {
        headers,
      });

    beforeEach(() => {
      headers = { Authorization: "Bearer test" };
    });

    it("should return 200 Response", async () => {
      const res = await subject();
      expect(res.status).toBe(200);
    });

    describe("when Authorization header is not provided", () => {
      beforeEach(() => {
        headers = undefined;
      });

      it("should return 401 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(401);
      });
    });
  });
});
