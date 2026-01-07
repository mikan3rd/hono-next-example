import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import type { ClientRequestOptions } from "hono/client";
import { testClient } from "hono/testing";
import { app } from "../../apps";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { supabaseUid } from "../../test/supabase";

describe("userApp", () => {
  describe("signupRoute", () => {
    let headers: ClientRequestOptions["headers"];

    const subject = () =>
      testClient(app).user.signup.$post(
        { json: { display_name: faker.person.fullName() } },
        {
          headers,
        },
      );

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
      expect(user.supabase_uid).toBe(supabaseUid);
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

    describe("when supabase_uid is already registered", () => {
      beforeEach(async () => {
        await db.insert(usersTable).values({
          public_id: crypto.randomUUID(), // FIXME
          supabase_uid: supabaseUid,
          display_name: faker.person.fullName(),
        });
      });

      it("should return 200 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(200);

        const users = await db.select().from(usersTable);
        expect(users).toHaveLength(1);

        const user = users[0];
        if (!user) throw new Error("user is not found");
        expect(user.supabase_uid).toBe(supabaseUid);
      });
    });
  });

  describe("getCurrentUserRoute", () => {
    let headers: ClientRequestOptions["headers"];
    let user: typeof usersTable.$inferSelect;

    const subject = () =>
      testClient(app).user.login.$get(undefined, { headers });

    beforeEach(() => {
      headers = { Authorization: "Bearer test" };
    });

    describe("when user signed up", () => {
      beforeEach(async () => {
        const _user = (
          await db
            .insert(usersTable)
            .values({
              public_id: crypto.randomUUID(), // FIXME
              supabase_uid: supabaseUid,
              display_name: faker.person.fullName(),
            })
            .returning()
        )[0];

        if (!_user) throw new Error("user is not found");
        user = _user;
      });
      it("should return 200 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(200);

        const resUser = await res.json();
        expect(resUser).toEqual({
          public_id: user.public_id,
          display_name: user.display_name,
        });
      });
    });

    describe("when user is not found", () => {
      it("should return 401 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(401);
      });
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
