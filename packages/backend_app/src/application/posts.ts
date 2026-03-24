import { desc, eq } from "drizzle-orm";
import type { DbTransaction } from "../db";
import { db } from "../db";
import { postWithUserQuery } from "../db/query";
import { postLogsTable, postsTable } from "../db/schema";

export type PostMutationRow = typeof postsTable.$inferSelect;

export type PostApplicationError =
  | "not_found"
  | "forbidden"
  | "insert_failed"
  | "update_failed";

export type PostAccessError = Extract<
  PostApplicationError,
  "not_found" | "forbidden"
>;

type ResolvePostForMutation =
  | { ok: true; row: PostMutationRow }
  | { ok: false; error: PostAccessError };

async function resolvePostForMutation(
  tx: DbTransaction,
  publicId: string,
  actorUserId: number,
): Promise<ResolvePostForMutation> {
  const rows = await tx
    .select()
    .from(postsTable)
    .where(eq(postsTable.public_id, publicId));
  const target = rows[0];

  if (target === undefined) {
    return { ok: false, error: "not_found" };
  }

  if (actorUserId !== target.user_id) {
    return { ok: false, error: "forbidden" };
  }

  return { ok: true, row: target };
}

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
  const txResult = await db.transaction(async (tx) => {
    const resolved = await resolvePostForMutation(
      tx,
      input.publicId,
      input.actorUserId,
    );
    if (!resolved.ok) {
      return { kind: "abort" as const, error: resolved.error };
    }
    const target = resolved.row;

    await tx.delete(postsTable).where(eq(postsTable.public_id, input.publicId));

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
      return { kind: "fail" as const, error: "update_failed" as const };
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
  if (txResult.kind === "fail") {
    return { ok: false, error: txResult.error };
  }

  return { ok: true };
}

export async function deletePostByPublicId(input: {
  publicId: string;
  actorUserId: number;
}): Promise<{ ok: true } | { ok: false; error: PostAccessError }> {
  const txResult = await db.transaction(async (tx) => {
    const resolved = await resolvePostForMutation(
      tx,
      input.publicId,
      input.actorUserId,
    );
    if (!resolved.ok) {
      return { kind: "abort" as const, error: resolved.error };
    }

    await tx.delete(postsTable).where(eq(postsTable.public_id, input.publicId));

    return { kind: "success" as const };
  });

  if (txResult.kind === "abort") {
    return { ok: false, error: txResult.error };
  }

  return { ok: true };
}
