import { beforeEach, describe, expect, it } from "bun:test";
import type { ClientRequestOptions } from "hono/client";
import { testClient } from "hono/testing";
import { app } from "../../apps";
import { db } from "../../db";
import { usersTable } from "../../db/schema";

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

      const users = await db.select().from(usersTable);
      expect(users).toHaveLength(1);

      const user = users[0];
      if (!user) throw new Error("user is not found");
      expect(user.supabase_uid).toBe("11111111-1111-1111-1111-111111111111");
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
