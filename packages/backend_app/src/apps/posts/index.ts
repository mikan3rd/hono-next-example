import { desc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "../../db";
import { postWithUserQuery } from "../../db/query";
import { postLogsTable, postsTable } from "../../db/schema";
import { userMiddleware } from "../../middlewares/user";
import { createApp } from "../factory";
import {
  getPostsResponseSchema,
  postPostResponseSchema,
  updatePostResponseSchema,
} from "./dto";
import {
  deletePostRoute,
  getPostsRoute,
  postPostRoute,
  updatePostRoute,
} from "./route";

const postApp = createApp();

postApp.post("/", userMiddleware);
postApp.use("/:id", userMiddleware);

const routes = postApp
  .openapi(getPostsRoute, async (c) => {
    const posts = await db.query.postsTable.findMany({
      ...postWithUserQuery,
      orderBy: desc(postsTable.id),
    });
    const response = { posts };
    return c.json(getPostsResponseSchema.parse(response), 200);
  })

  .openapi(postPostRoute, async (c) => {
    const { content } = c.req.valid("json");
    const user = c.get("user");
    const result = await db.transaction(async (tx) => {
      const now = new Date();
      const post = (
        await tx
          .insert(postsTable)
          .values({
            public_id: crypto.randomUUID(),
            user_id: user.id,
            content,
            first_created_at: now, // 最初の作成日時を設定
          })
          .returning()
      )[0];
      if (!post)
        throw new HTTPException(500, {
          message: "Failed to create post",
        });

      await tx.insert(postLogsTable).values({
        id: post.id,
        public_id: post.public_id,
        user_id: post.user_id,
        content: post.content,
        created_at: post.created_at,
      });

      return post;
    });

    const response = {
      post: await db.query.postsTable.findFirst({
        ...postWithUserQuery,
        where: eq(postsTable.id, result.id),
      }),
    };
    return c.json(postPostResponseSchema.parse(response), 200);
  })

  .openapi(updatePostRoute, async (c) => {
    const { public_id } = c.req.valid("param");
    const { content } = c.req.valid("json");
    const user = c.get("user");

    await db.transaction(async (tx) => {
      const target = (
        await tx
          .select()
          .from(postsTable)
          .where(eq(postsTable.public_id, public_id))
      )[0];

      if (target === undefined) {
        throw new HTTPException(404, {
          message: "Post is not found",
        });
      }

      if (target.user_id !== user.id) {
        throw new HTTPException(403, {
          message: "Forbidden",
        });
      }

      await tx.delete(postsTable).where(eq(postsTable.public_id, public_id));

      const results = await tx
        .insert(postsTable)
        .values({
          public_id: target.public_id,
          user_id: target.user_id,
          content,
          first_created_at: target.first_created_at, // 最初の作成日時を維持
        })
        .returning();

      const result = results[0];
      if (!result)
        throw new HTTPException(500, {
          message: "Failed to update post",
        });

      await tx.insert(postLogsTable).values({
        id: result.id,
        public_id: result.public_id,
        user_id: result.user_id,
        content: result.content,
        created_at: result.created_at,
      });
    });

    const response = {
      post: await db.query.postsTable.findFirst({
        ...postWithUserQuery,
        where: eq(postsTable.public_id, public_id),
      }),
    };

    return c.json(updatePostResponseSchema.parse(response), 200);
  })

  .openapi(deletePostRoute, async (c) => {
    const { public_id } = c.req.valid("param");
    const user = c.get("user");

    await db.transaction(async (tx) => {
      const target = (
        await tx
          .select()
          .from(postsTable)
          .where(eq(postsTable.public_id, public_id))
      )[0];

      if (target === undefined) {
        throw new HTTPException(404, {
          message: "Post is not found",
        });
      }

      if (target.user_id !== user.id) {
        throw new HTTPException(403, {
          message: "Forbidden",
        });
      }

      await tx.delete(postsTable).where(eq(postsTable.public_id, public_id));
    });

    return c.json(null, 200);
  });

export { routes as postApp };
