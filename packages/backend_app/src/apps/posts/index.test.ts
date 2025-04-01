import { beforeEach, describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";
import { app } from "../../apps";
import { db } from "../../db";
import { postsTable } from "../../db/schema";

describe("postsApp", () => {
  describe("getPostsRoute", () => {
    it("should return 200 Response", async () => {
      const res = await testClient(app).posts.$get();
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toEqual({ posts: [] });
    });
  });

  describe("postPostRoute", () => {
    let content: string;

    const subject = () => testClient(app).posts.$post({ json: { content } });

    beforeEach(() => {
      content = "test";
    });

    it("should return 200 Response", async () => {
      const res = await subject();
      expect(res.status).toBe(200);

      if (!res.ok) throw new Error("res is not ok");
      const json = await res.json();
      expect(json.post.content).toBe(content);

      const posts = await db.select().from(postsTable);
      expect(posts).toHaveLength(1);

      const post = posts[0];
      if (!post) throw new Error("post is undefined");
      expect(post.content).toBe(content);
    });
  });
});
