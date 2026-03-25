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
        const now = new Date();
        await db.insert(postsTable).values({
          public_id: faker.string.uuid(),
          user_id: user.id,
          content: "older",
          first_created_at: now,
          created_at: now,
        });
        await db.insert(postsTable).values({
          public_id: faker.string.uuid(),
          user_id: user.id,
          content: "newer",
          first_created_at: now,
          created_at: now,
        });
      });

      it("returns posts ordered by id descending with user relation", async () => {
        const posts = await subject();
        expect(posts).toHaveLength(2);
        expect(posts[0]?.content).toBe("newer");
        expect(posts[1]?.content).toBe("older");
        expect(posts[0]?.user.public_id).toBe(user.public_id);
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
        const now = new Date();
        const inserted = (
          await db
            .insert(postsTable)
            .values({
              public_id: faker.string.uuid(),
              user_id: user.id,
              content: "hello",
              first_created_at: now,
              created_at: now,
            })
            .returning()
        )[0];
        if (!inserted) throw new Error("post is not found");
        lookupId = inserted.id;
      });

      it("returns post with user", async () => {
        const row = await subject();
        expect(row).toBeDefined();
        expect(row?.content).toBe("hello");
        expect(row?.user.public_id).toBe(user.public_id);
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
        lookupPublicId = faker.string.uuid();
        const now = new Date();
        await db.insert(postsTable).values({
          public_id: lookupPublicId,
          user_id: user.id,
          content: "by-public",
          first_created_at: now,
          created_at: now,
        });
      });

      it("returns post with user", async () => {
        const row = await subject();
        expect(row).toBeDefined();
        expect(row?.content).toBe("by-public");
        expect(row?.user.display_name).toBe(user.display_name);
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
        expect(row?.content).toBe(content);
        expect(row?.user.public_id).toBe(user.public_id);

        const logs = await db.select().from(postLogsTable);
        expect(logs).toHaveLength(1);
        expect(logs[0]?.content).toBe(content);
        expect(logs[0]?.user_id).toBe(user.id);
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
        publicId = faker.string.uuid();
        updateContent = "hijack";
        const now = new Date();
        await db.insert(postsTable).values({
          public_id: publicId,
          user_id: anotherUser.id,
          content: "theirs",
          first_created_at: now,
          created_at: now,
        });
      });

      it("returns forbidden and does not change content", async () => {
        const result = await subject();
        expect(result).toEqual({ ok: false, error: "forbidden" });

        const rows = await db
          .select()
          .from(postsTable)
          .where(eq(postsTable.public_id, publicId));
        expect(rows[0]?.content).toBe("theirs");
      });
    });

    describe("when post belongs to current user", () => {
      let firstAt: Date;

      beforeEach(async () => {
        publicId = faker.string.uuid();
        firstAt = new Date("2020-01-01T00:00:00.000Z");
        updateContent = "after";
        const inserted = (
          await db
            .insert(postsTable)
            .values({
              public_id: publicId,
              user_id: user.id,
              content: "before",
              first_created_at: firstAt,
              created_at: firstAt,
            })
            .returning()
        )[0];
        if (!inserted) throw new Error("post is not found");
      });

      it("returns ok and replaces content while keeping first_created_at and public_id", async () => {
        const result = await subject();
        expect(result).toEqual({ ok: true });

        const rows = await db.select().from(postsTable);
        expect(rows).toHaveLength(1);
        const post = rows[0];
        if (!post) throw new Error("post is not found");
        expect(post.public_id).toBe(publicId);
        expect(post.content).toBe(updateContent);
        expect(post.first_created_at).toEqual(firstAt);

        const logs = await db.select().from(postLogsTable);
        expect(logs).toHaveLength(1);
        expect(logs[0]?.content).toBe(updateContent);
        expect(logs[0]?.id).toBe(post.id);

        const withUser = await findPostWithUserByPublicId(publicId);
        expect(withUser?.content).toBe(updateContent);
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
        publicId = faker.string.uuid();
        const now = new Date();
        await db.insert(postsTable).values({
          public_id: publicId,
          user_id: anotherUser.id,
          content: "keep",
          first_created_at: now,
          created_at: now,
        });
      });

      it("returns forbidden and keeps the post", async () => {
        const result = await subject();
        expect(result).toEqual({ ok: false, error: "forbidden" });

        const rows = await db.select().from(postsTable);
        expect(rows).toHaveLength(1);
      });
    });

    describe("when post belongs to current user", () => {
      beforeEach(async () => {
        publicId = faker.string.uuid();
        const now = new Date();
        await db.insert(postsTable).values({
          public_id: publicId,
          user_id: user.id,
          content: "gone",
          first_created_at: now,
          created_at: now,
        });
      });

      it("returns ok and removes the post", async () => {
        expect(await subject()).toEqual({ ok: true });

        const rows = await db.select().from(postsTable);
        expect(rows).toHaveLength(0);
      });
    });
  });
});
