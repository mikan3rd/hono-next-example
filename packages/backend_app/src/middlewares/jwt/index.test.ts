import { beforeEach, describe, expect, it } from "bun:test";
import { Hono } from "hono";
import type { ClientRequestOptions } from "hono/client";
import { testClient } from "hono/testing";
import { jwtMiddleware } from ".";

describe("jwtMiddleware", () => {
  let header: ClientRequestOptions["headers"];

  const subject = async () => {
    const app = new Hono();
    app.use(jwtMiddleware);
    const routes = app.get("/", (c) => c.json({ message: "Hello Hono!" }));
    return testClient(routes).index.$get({ header });
  };

  beforeEach(() => {
    header = { Authorization: "Bearer test" };
  });

  it("should return 200 Response", async () => {
    const res = await subject();
    expect(res.status).toBe(200);
  });
});
