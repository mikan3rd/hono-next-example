import { beforeEach, describe, expect, it } from "bun:test";
import { app } from "../../apps";

describe("helloApp", () => {
  describe("getHelloRoute", () => {
    let name: string;
    const subject = () => app.request(`/hellos?name=${name}`);

    describe("when the name is provided", () => {
      beforeEach(() => {
        name = "Hono";
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

  describe("postHelloRoute", () => {
    let name: string;
    const subject = () =>
      app.request("/hellos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

    describe("when the name is provided", () => {
      beforeEach(() => {
        name = "Hono";
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
