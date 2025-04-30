import { describe, expect, it } from "bun:test";
import { app } from "../../apps";

describe("healthzApp", () => {
  describe("/", () => {
    const subject = () => app.request("/healthz");

    it("should return 200 Response", async () => {
      const res = await subject();
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ status: "ok" });
    });
  });
});
