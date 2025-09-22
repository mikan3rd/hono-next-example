import { describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";
import { app } from "../../apps";

describe("userApp", () => {
  describe("signupRoute", () => {
    const subject = () => testClient(app).user.signup.$post();

    it("should return 200 Response", async () => {
      const res = await subject();
      expect(res.status).toBe(200);
    });
  });
});
