import { desc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "../../db";
import { postsTable } from "../../db/schema";
import { createApp } from "../factory";
import {
  deletePostParamsSchema,
  postPostRequestSchema,
  updatePostParamsSchema,
  updatePostRequestSchema,
} from "./dto";

export const postApp = createApp()
  .get("/", async (c) => {
    const posts = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.id));
    return c.json({ posts });
  })
  .post("/", async (c) => {
    const body = await c.req.json();
    const result = postPostRequestSchema.safeParse(body);
    if (!result.success) {
      throw new HTTPException(400, {
        message: "Invalid request body",
      });
    }
    const { content } = result.data;
    const postResult = await db
      .insert(postsTable)
      .values({ content })
      .returning();
    const post = postResult[0];
    if (!post)
      throw new HTTPException(500, {
        message: "Failed to create post",
      });
    return c.json({ post }, 200);
  })
  .put("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();

    const paramResult = updatePostParamsSchema.safeParse({ id });
    if (!paramResult.success) {
      throw new HTTPException(400, {
        message: "Invalid id parameter",
      });
    }

    const bodyResult = updatePostRequestSchema.safeParse(body);
    if (!bodyResult.success) {
      throw new HTTPException(400, {
        message: "Invalid request body",
      });
    }

    const { id: postId } = paramResult.data;
    const { content } = bodyResult.data;

    const post = await db.transaction(async (tx) => {
      const targets = await tx
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, postId));

      if (targets.length === 0) {
        throw new HTTPException(404, {
          message: "Post is not found",
        });
      }

      const result = await tx
        .update(postsTable)
        .set({ content })
        .where(eq(postsTable.id, postId))
        .returning();

      const post = result[0];
      if (!post)
        throw new HTTPException(500, {
          message: "Failed to update post",
        });
      return post;
    });

    return c.json({ post }, 200);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const paramResult = deletePostParamsSchema.safeParse({ id });
    if (!paramResult.success) {
      throw new HTTPException(400, {
        message: "Invalid id parameter",
      });
    }
    const { id: postId } = paramResult.data;

    await db.transaction(async (tx) => {
      const targets = await tx
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, postId));

      if (targets.length === 0) {
        throw new HTTPException(404, {
          message: "Post is not found",
        });
      }

      await tx.delete(postsTable).where(eq(postsTable.id, postId));
    });

    return c.json(null, 200);
  });
