import { desc, eq } from "drizzle-orm";
import { TransactionRollbackError } from "drizzle-orm/errors";
import { db } from "../db";
import { postWithUserQuery } from "../db/query";
import { postLogsTable, postsTable } from "../db/schema";

export type PostApplicationError =
  | "not_found"
  | "forbidden"
  | "insert_failed"
  | "update_failed";

export type PostAccessError = Extract<
  PostApplicationError,
  "not_found" | "forbidden"
>;

export async function listPostsWithUser() {
  return db.query.postsTable.findMany({
    ...postWithUserQuery,
    orderBy: desc(postsTable.id),
  });
}

export type PostWithUserRow = Awaited<
  ReturnType<typeof listPostsWithUser>
>[number];

export async function findPostWithUserById(id: number) {
  return db.query.postsTable.findFirst({
    ...postWithUserQuery,
    where: eq(postsTable.id, id),
  });
}

export async function findPostWithUserByPublicId(publicId: string) {
  return db.query.postsTable.findFirst({
    ...postWithUserQuery,
    where: eq(postsTable.public_id, publicId),
  });
}

export async function createPost(input: {
  userId: number;
  content: string;
}): Promise<
  { ok: true; id: number } | { ok: false; error: PostApplicationError }
> {
  const now = new Date();
  const inserted = await db.transaction(async (tx) => {
    const post = (
      await tx
        .insert(postsTable)
        .values({
          public_id: crypto.randomUUID(),
          user_id: input.userId,
          content: input.content,
          first_created_at: now,
          created_at: now,
        })
        .returning()
    )[0];
    if (!post) return undefined;

    await tx.insert(postLogsTable).values({
      id: post.id,
      public_id: post.public_id,
      user_id: post.user_id,
      content: post.content,
      created_at: post.created_at,
    });

    return post;
  });

  if (!inserted) {
    return { ok: false, error: "insert_failed" };
  }

  return { ok: true, id: inserted.id };
}

export async function updatePostByPublicId(input: {
  publicId: string;
  actorUserId: number;
  content: string;
}): Promise<{ ok: true } | { ok: false; error: PostApplicationError }> {
  try {
    const txResult = await db.transaction(async (tx) => {
      const rows = await tx
        .select()
        .from(postsTable)
        .where(eq(postsTable.public_id, input.publicId));
      const target = rows[0];

      if (target === undefined) {
        return { kind: "abort" as const, error: "not_found" as const };
      }

      if (input.actorUserId !== target.user_id) {
        return { kind: "abort" as const, error: "forbidden" as const };
      }

      await tx
        .delete(postsTable)
        .where(eq(postsTable.public_id, input.publicId));

      const results = await tx
        .insert(postsTable)
        .values({
          public_id: target.public_id,
          user_id: target.user_id,
          content: input.content,
          first_created_at: target.first_created_at,
        })
        .returning();

      const row = results[0];
      if (!row) {
        return tx.rollback();
      }

      await tx.insert(postLogsTable).values({
        id: row.id,
        public_id: row.public_id,
        user_id: row.user_id,
        content: row.content,
        created_at: row.created_at,
      });

      return { kind: "success" as const };
    });

    if (txResult.kind === "abort") {
      return { ok: false, error: txResult.error };
    }

    return { ok: true };
  } catch (e) {
    if (e instanceof TransactionRollbackError) {
      return { ok: false, error: "update_failed" };
    }
    throw e;
  }
}

export async function deletePostByPublicId(input: {
  publicId: string;
  actorUserId: number;
}): Promise<{ ok: true } | { ok: false; error: PostAccessError }> {
  const txResult = await db.transaction(async (tx) => {
    const rows = await tx
      .select()
      .from(postsTable)
      .where(eq(postsTable.public_id, input.publicId));
    const target = rows[0];

    if (target === undefined) {
      return { kind: "abort" as const, error: "not_found" as const };
    }

    if (input.actorUserId !== target.user_id) {
      return { kind: "abort" as const, error: "forbidden" as const };
    }

    await tx.delete(postsTable).where(eq(postsTable.public_id, input.publicId));

    return { kind: "success" as const };
  });

  if (txResult.kind === "abort") {
    return { ok: false, error: txResult.error };
  }

  return { ok: true };
}
