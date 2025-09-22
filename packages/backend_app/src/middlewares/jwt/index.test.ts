import { beforeEach, describe, expect, it } from "bun:test";
import { Hono } from "hono";
import type { ClientRequestOptions } from "hono/client";
import { testClient } from "hono/testing";
import type { ErrorResponse } from "../../dto/output/error";
import { jwtMiddleware } from ".";

describe("jwtMiddleware", () => {
  let header: ClientRequestOptions["headers"];

  const subject = async () => {
    const app = new Hono();
    app.use(jwtMiddleware);
    const routes = app.get("/", (c) =>
      c.json<{ message: string } | ErrorResponse>({ message: "Hello Hono!" }),
    );
    return testClient(routes).index.$get({ header });
  };

  beforeEach(() => {
    header = { Authorization: "Bearer test" };
  });

  it("should return 200 Response", async () => {
    const res = await subject();
    expect(res.status).toBe(200);
  });

  describe("when Authorization header is not provided", () => {
    beforeEach(() => {
      header = undefined;
    });

    it("should return 401 Response", async () => {
      const res = await subject();
      expect(res.status).toBe(401);

      const body = await res.json();
      expect(body).toEqual({
        code: "Unauthorized",
        message: "Missing authorization header",
      });
    });
  });

  describe("when Authorization header is not valid", () => {
    beforeEach(() => {
      header = { Authorization: "invalid" };
    });

    it("should return 401 Response", async () => {
      const res = await subject();
      expect(res.status).toBe(401);

      const body = await res.json();
      expect(body).toEqual({
        code: "Unauthorized",
        message: "Missing token",
      });
    });
  });
});
