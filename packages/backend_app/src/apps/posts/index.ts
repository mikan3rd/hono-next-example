import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { postsTable } from "../../db/schema";
import { createApp } from "../factory";
import {
  deletePostRoute,
  getPostsRoute,
  postPostRoute,
  updatePostRoute,
} from "./route";

export const postApp = createApp()
  .openapi(getPostsRoute, async (c) => {
    const posts = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.id));
    return c.json({ posts });
  })
  .openapi(postPostRoute, async (c) => {
    const { content } = c.req.valid("json");
    const result = await db.insert(postsTable).values({ content }).returning();
    const post = result[0];
    if (!post) throw new Error("Post is undefined");
    return c.json({ post }, 200);
  })
  .openapi(updatePostRoute, async (c) => {
    const { id } = c.req.valid("param");
    const { content } = c.req.valid("json");

    const post = await db.transaction(async (tx) => {
      const targets = await tx
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id));

      if (targets.length === 0) {
        throw new Error("Post is not found");
      }

      const result = await tx
        .update(postsTable)
        .set({ content })
        .where(eq(postsTable.id, id))
        .returning();

      const post = result[0];
      if (!post) throw new Error("Post is undefined");
      return post;
    });

    return c.json({ post }, 200);
  })
  .openapi(deletePostRoute, async (c) => {
    const { id } = c.req.valid("param");

    await db.transaction(async (tx) => {
      const targets = await tx
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id));

      if (targets.length === 0) {
        throw new Error("Post is not found");
      }

      await tx.delete(postsTable).where(eq(postsTable.id, id));
    });

    return c.json(null, 200);
  });
