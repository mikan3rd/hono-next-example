import { beforeEach, describe, expect, it } from "bun:test";
import type { ClientRequestOptions } from "hono/client";
import { testClient } from "hono/testing";
import { app } from "../../apps";
import { db } from "../../db";
import { postsTable, usersTable } from "../../db/schema";
import { supabaseUid } from "../../test/supabase";

describe("postsApp", () => {
  let headers: ClientRequestOptions["headers"];
  let user: typeof usersTable.$inferSelect;

  beforeEach(() => {
    headers = { Authorization: "Bearer test" };
  });

  beforeEach(async () => {
    const users = await db
      .insert(usersTable)
      .values({ supabase_uid: supabaseUid })
      .returning();
    const createdUser = users[0];
    if (!createdUser) throw new Error("user is not found");
    user = createdUser;
  });

  describe("getPostsRoute", () => {
    const subject = () => testClient(app).posts.$get();

    describe("when there are no posts", () => {
      it("should return 200 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(200);

        if (!res.ok) throw new Error("res is not ok");
        const json = await res.json();
        expect(json.posts).toHaveLength(0);
      });
    });

    describe("when there are some posts", () => {
      beforeEach(async () => {
        await db
          .insert(postsTable)
          .values({ user_id: user.id, content: "test" });
        await db
          .insert(postsTable)
          .values({ user_id: user.id, content: "test2" });
      });

      it("should return 200 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(200);

        if (!res.ok) throw new Error("res is not ok");
        const json = await res.json();
        expect(json.posts).toHaveLength(2);
        expect(json.posts[0]).toMatchObject({
          id: 2,
          content: "test2",
        });
        expect(json.posts[1]).toMatchObject({
          id: 1,
          content: "test",
        });
      });
    });
  });

  describe("postPostRoute", () => {
    let content: string;

    const subject = () =>
      testClient(app).posts.$post({ json: { content } }, { headers });

    describe("when required fields are provided", () => {
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
        if (!post) throw new Error("post is not found");
        expect(post.content).toBe(content);
        expect(post.created_at).toEqual(post.updated_at);
      });
    });

    describe("when required fields are not provided", () => {
      beforeEach(() => {
        content = "";
      });

      it("should return 400 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(400);
      });
    });
  });

  describe("updatePostRoute", () => {
    let id: string;
    let content: string;

    const subject = () =>
      testClient(app).posts[":id"].$put(
        {
          param: { id: id.toString() },
          json: { content },
        },
        { headers },
      );

    describe("when required fields are provided", () => {
      beforeEach(() => {
        id = Number(1).toString();
        content = "test2";
      });

      it("should return 404 when post is not found", async () => {
        const res = await subject();
        expect(res.status).toBe(404);

        if (res.ok) throw new Error("res is ok");
        const json = await res.json();
        expect(json.message).toBe("Post is not found");
      });

      describe("when post is found", () => {
        beforeEach(async () => {
          await db
            .insert(postsTable)
            .values({ user_id: user.id, content: "test" });
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
          if (!post) throw new Error("post is not found");
          expect(post.content).toBe(content);
          expect(post.created_at.getTime()).toBeLessThan(
            post.updated_at.getTime(),
          );
        });
      });
    });

    describe("when required fields are not provided", () => {
      beforeEach(() => {
        id = Number(1).toString();
        content = "";
      });

      it("should return 400 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(400);
      });
    });

    describe("when id is not a number", () => {
      beforeEach(() => {
        id = "test";
      });

      it("should return 400 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(400);
      });
    });
  });

  describe("deletePostRoute", () => {
    let id: string;

    const subject = () =>
      testClient(app).posts[":id"].$delete({ param: { id } }, { headers });

    describe("when required fields are provided", () => {
      beforeEach(() => {
        id = Number(1).toString();
      });

      it("should return 404 when post is not found", async () => {
        const res = await subject();
        expect(res.status).toBe(404);

        if (res.ok) throw new Error("res is ok");
        const json = await res.json();
        expect(json.message).toBe("Post is not found");
      });

      describe("when post is found", () => {
        beforeEach(async () => {
          await db
            .insert(postsTable)
            .values({ user_id: user.id, content: "test" });
        });

        it("should return 200 Response", async () => {
          const res = await subject();
          expect(res.status).toBe(200);

          const posts = await db.select().from(postsTable);
          expect(posts).toHaveLength(0);
        });
      });
    });

    describe("when id is not a number", () => {
      beforeEach(() => {
        id = "test";
      });

      it("should return 400 Response", async () => {
        const res = await subject();
        expect(res.status).toBe(400);
      });
    });
  });
});
