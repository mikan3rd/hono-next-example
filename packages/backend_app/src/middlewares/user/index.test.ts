import { beforeEach, describe, expect, it } from "bun:test";
import { Hono } from "hono";
import type { ClientRequestOptions } from "hono/client";
import { testClient } from "hono/testing";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import type { ErrorResponse } from "../../dto/output/error";
import { supabaseUid } from "../../test/supabase";
import { userMiddleware } from ".";

describe("userMiddleware", () => {
  let header: ClientRequestOptions["headers"];

  const subject = async () => {
    const app = new Hono();
    app.use(userMiddleware);
    const routes = app.get("/", (c) =>
      c.json<{ message: string } | ErrorResponse>({ message: "Hello Hono!" }),
    );
    return testClient(routes).index.$get({ header });
  };

  beforeEach(() => {
    header = { Authorization: "Bearer test" };
  });

  it("should return 401 Response", async () => {
    const res = await subject();
    expect(res.status).toBe(401);
  });

  describe("when user is found", () => {
    beforeEach(async () => {
      await db.insert(usersTable).values({ supabase_uid: supabaseUid });
    });

    it("should return 200 Response", async () => {
      const res = await subject();
      expect(res.status).toBe(200);
    });
  });
});
