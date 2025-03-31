import { beforeEach, describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";
import { app } from "../../apps";

describe("postsApp", () => {
  describe("postPostRoute", () => {
    let content: string;

    const subject = () => testClient(app).posts.$post({ json: { content } });

    beforeEach(() => {
      content = "test";
    });

    it("should return 200 Response", async () => {
      const res = await subject();
      expect(res.status).toBe(200);
    });
  });
});
