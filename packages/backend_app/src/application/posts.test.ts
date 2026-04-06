import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { postLogsTable, postsTable, usersTable } from "../db/schema";
import { supabaseUid } from "../test/supabase";
import {
  createPost,
  deletePostByPublicId,
  findPostWithUserById,
  findPostWithUserByPublicId,
  listPostsWithUser,
  updatePostByPublicId,
} from "./posts";

async function seedPostAsUser(input: { userId: number; content: string }) {
  const result = await createPost({
    userId: input.userId,
    content: input.content,
  });
  if (!result.ok) throw new Error("seed createPost failed");
  const row = await findPostWithUserById(result.id);
  if (!row) throw new Error("seed post not found");
  return { id: result.id, ...row };
}

describe("application/posts", () => {
  let user: typeof usersTable.$inferSelect;
  let anotherUser: typeof usersTable.$inferSelect;

  beforeEach(async () => {
    const _user = (
      await db
        .insert(usersTable)
        .values({
          public_id: faker.string.uuid(),
          supabase_uid: supabaseUid,
          display_name: faker.person.fullName(),
        })
        .returning()
    )[0];
    if (!_user) throw new Error("user is not found");
    user = _user;

    const _anotherUser = (
      await db
        .insert(usersTable)
        .values({
          public_id: faker.string.uuid(),
          supabase_uid: faker.string.uuid(),
          display_name: faker.person.fullName(),
        })
        .returning()
    )[0];
    if (!_anotherUser) throw new Error("another user is not found");
    anotherUser = _anotherUser;
  });

  describe("listPostsWithUser", () => {
    const subject = () => listPostsWithUser();

    describe("when there are no posts", () => {
      it("returns empty array", async () => {
        const posts = await subject();
        expect(posts).toHaveLength(0);
      });
    });

    describe("when there are some posts", () => {
      beforeEach(async () => {
        await seedPostAsUser({ userId: user.id, content: "older" });
        await seedPostAsUser({ userId: user.id, content: "newer" });
      });

      it("returns posts ordered by id descending with user relation", async () => {
        const posts = await subject();
        expect(posts).toHaveLength(2);
        expect(posts[0]).toMatchObject({
          content: "newer",
          user: { public_id: user.public_id },
        });
        expect(posts[1]).toMatchObject({
          content: "older",
          user: { public_id: user.public_id },
        });
      });
    });
  });

  describe("findPostWithUserById", () => {
    let lookupId: number;
    const subject = () => findPostWithUserById(lookupId);

    describe("when post does not exist", () => {
      beforeEach(() => {
        lookupId = 999_999_999;
      });

      it("returns undefined", async () => {
        expect(await subject()).toBeUndefined();
      });
    });

    describe("when post exists", () => {
      beforeEach(async () => {
        const inserted = await seedPostAsUser({
          userId: user.id,
          content: "hello",
        });
        lookupId = inserted.id;
      });

      it("returns post with user", async () => {
        const row = await subject();
        expect(row).toMatchObject({
          content: "hello",
          user: { public_id: user.public_id },
        });
      });
    });
  });

  describe("findPostWithUserByPublicId", () => {
    let lookupPublicId: string;
    const subject = () => findPostWithUserByPublicId(lookupPublicId);

    describe("when post does not exist", () => {
      beforeEach(() => {
        lookupPublicId = faker.string.uuid();
      });

      it("returns undefined", async () => {
        expect(await subject()).toBeUndefined();
      });
    });

    describe("when post exists", () => {
      beforeEach(async () => {
        const inserted = await seedPostAsUser({
          userId: user.id,
          content: "by-public",
        });
        lookupPublicId = inserted.public_id;
      });

      it("returns post with user", async () => {
        const row = await subject();
        expect(row).toMatchObject({
          content: "by-public",
          user: { display_name: user.display_name },
        });
      });
    });
  });

  describe("createPost", () => {
    let content: string;
    const subject = () => createPost({ userId: user.id, content });

    describe("when content is provided", () => {
      beforeEach(() => {
        content = faker.lorem.sentence();
      });

      it("returns ok with id and persists post and post_log", async () => {
        const result = await subject();

        expect(result.ok).toBe(true);
        if (!result.ok) throw new Error("expected ok");
        expect(typeof result.id).toBe("number");

        const row = await findPostWithUserById(result.id);
        if (!row) throw new Error("expected post");
        expect(row).toMatchObject({
          content,
          user: { public_id: user.public_id },
        });

        const logs = await db
          .select()
          .from(postLogsTable)
          .where(eq(postLogsTable.public_id, row.public_id));
        expect(logs).toHaveLength(1);
        const log = logs[0];
        if (!log) throw new Error("expected log");
        expect(log).toMatchObject({
          id: result.id,
          content,
          user_id: user.id,
          event_type: "created",
          first_created_at: row.first_created_at,
          created_at: row.created_at,
        });
        expect(log.occurred_at.getTime()).toBeGreaterThanOrEqual(
          row.created_at.getTime(),
        );
      });
    });
  });

  describe("updatePostByPublicId", () => {
    let publicId: string;
    let updateContent: string;
    const subject = () =>
      updatePostByPublicId({
        publicId,
        actorUserId: user.id,
        content: updateContent,
      });

    describe("when post is not found", () => {
      beforeEach(() => {
        publicId = faker.string.uuid();
        updateContent = "x";
      });

      it("returns not_found", async () => {
        expect(await subject()).toEqual({ ok: false, error: "not_found" });
      });
    });

    describe("when post belongs to another user", () => {
      beforeEach(async () => {
        updateContent = "hijack";
        const inserted = await seedPostAsUser({
          userId: anotherUser.id,
          content: "theirs",
        });
        publicId = inserted.public_id;
      });

      it("returns forbidden and does not change content", async () => {
        const result = await subject();
        expect(result).toEqual({ ok: false, error: "forbidden" });

        const rows = await db
          .select()
          .from(postsTable)
          .where(eq(postsTable.public_id, publicId));
        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({ content: "theirs" });
      });
    });

    describe("when post belongs to current user", () => {
      let firstAt: Date;

      beforeEach(async () => {
        updateContent = "after";
        const inserted = await seedPostAsUser({
          userId: user.id,
          content: "before",
        });
        publicId = inserted.public_id;
        firstAt = inserted.first_created_at;
      });

      it("returns ok and replaces content while keeping first_created_at and public_id", async () => {
        const result = await subject();
        expect(result).toEqual({ ok: true });

        const rows = await db.select().from(postsTable);
        expect(rows).toHaveLength(1);
        const post = rows[0];
        if (!post) throw new Error("post is not found");
        expect(post).toMatchObject({
          public_id: publicId,
          content: updateContent,
          first_created_at: firstAt,
        });

        const logs = await db
          .select()
          .from(postLogsTable)
          .where(eq(postLogsTable.public_id, publicId));
        expect(logs).toHaveLength(2);
        const log = logs.find((l) => l.event_type === "updated");
        if (!log) throw new Error("expected updated log");
        expect(log).toMatchObject({
          content: updateContent,
          id: post.id,
          event_type: "updated",
          first_created_at: firstAt,
          created_at: post.created_at,
        });
        expect(log.occurred_at.getTime()).toBeGreaterThanOrEqual(
          log.created_at.getTime(),
        );

        const withUser = await findPostWithUserByPublicId(publicId);
        expect(withUser).toMatchObject({ content: updateContent });
      });
    });
  });

  describe("deletePostByPublicId", () => {
    let publicId: string;
    const subject = () =>
      deletePostByPublicId({ publicId, actorUserId: user.id });

    describe("when post is not found", () => {
      beforeEach(() => {
        publicId = faker.string.uuid();
      });

      it("returns not_found", async () => {
        expect(await subject()).toEqual({ ok: false, error: "not_found" });
      });
    });

    describe("when post belongs to another user", () => {
      beforeEach(async () => {
        const inserted = await seedPostAsUser({
          userId: anotherUser.id,
          content: "keep",
        });
        publicId = inserted.public_id;
      });

      it("returns forbidden and keeps the post", async () => {
        const result = await subject();
        expect(result).toEqual({ ok: false, error: "forbidden" });

        const rows = await db.select().from(postsTable);
        expect(rows).toHaveLength(1);
      });
    });

    describe("when post belongs to current user", () => {
      let seededCreatedAt: Date;
      let seededPostId: number;

      beforeEach(async () => {
        const inserted = await seedPostAsUser({
          userId: user.id,
          content: "gone",
        });
        publicId = inserted.public_id;
        seededCreatedAt = inserted.first_created_at;
        seededPostId = inserted.id;
      });

      it("returns ok and removes the post and appends deleted post_log", async () => {
        const beforeMs = Date.now();
        expect(await subject()).toEqual({ ok: true });
        const afterMs = Date.now();

        const rows = await db.select().from(postsTable);
        expect(rows).toHaveLength(0);

        const logs = await db
          .select()
          .from(postLogsTable)
          .where(eq(postLogsTable.public_id, publicId));
        expect(logs).toHaveLength(2);
        const log = logs.find((l) => l.event_type === "deleted");
        if (!log) throw new Error("expected deleted log");
        expect(log).toMatchObject({
          id: seededPostId,
          event_type: "deleted",
          content: "gone",
          user_id: user.id,
          first_created_at: seededCreatedAt,
          created_at: seededCreatedAt,
        });
        expect(log.occurred_at.getTime()).toBeGreaterThanOrEqual(beforeMs);
        expect(log.occurred_at.getTime()).toBeLessThanOrEqual(afterMs);
      });
    });
  });
});
