import { beforeEach, describe, expect, it } from "bun:test";
import { app } from "@/apps/index.js";
import { testClient } from "hono/testing";

describe("helloApp", () => {
  describe("getHelloRoute", () => {
    const subject = testClient(app).hellos.$get();

    it("should return 200 Response", async () => {
      const res = await subject;
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ message: "Hello Hono!" });
    });
  });

  describe("postHelloRoute", () => {
    let name: string;
    const subject = () => testClient(app).hellos.$post({ json: { name } });

    describe("when the name is provided", () => {
      beforeEach(() => {
        name = "mikan3rd";
      });

      it("should return 200 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ message: `Hello ${name}!` });
      });
    });

    describe("when the name is not provided", () => {
      beforeEach(() => {
        name = "";
      });

      it("should return 400 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(400);
      });
    });
  });
});
