import { desc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "../../db";
import { postPublicFields, userPublicFields } from "../../db/field";
import { postsTable } from "../../db/schema";
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
      columns: postPublicFields,
      with: {
        user: {
          columns: userPublicFields,
        },
      },
      orderBy: desc(postsTable.id),
    });
    const response = { posts };
    return c.json(getPostsResponseSchema.parse(response), 200);
  })

  .openapi(postPostRoute, async (c) => {
    const { content } = c.req.valid("json");
    const user = c.get("user");
    const result = await db
      .insert(postsTable)
      .values({ user_id: user.id, content })
      .returning();
    const post = result[0];
    if (!post)
      throw new HTTPException(500, {
        message: "Failed to create post",
      });
    const response = {
      post: await db.query.postsTable.findFirst({
        where: eq(postsTable.id, post.id),
        columns: postPublicFields,
        with: {
          user: {
            columns: userPublicFields,
          },
        },
      }),
    };
    return c.json(postPostResponseSchema.parse(response), 200);
  })

  .openapi(updatePostRoute, async (c) => {
    const { id } = c.req.valid("param");
    const { content } = c.req.valid("json");
    const user = c.get("user");

    const post = await db.transaction(async (tx) => {
      const target = (
        await tx.select().from(postsTable).where(eq(postsTable.id, id))
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

      const results = await tx
        .update(postsTable)
        .set({ content })
        .where(eq(postsTable.id, id))
        .returning();

      const result = results[0];
      if (!result)
        throw new HTTPException(500, {
          message: "Failed to update post",
        });
      return result;
    });

    const response = {
      post: await db.query.postsTable.findFirst({
        where: eq(postsTable.id, post.id),
        columns: postPublicFields,
        with: {
          user: {
            columns: userPublicFields,
          },
        },
      }),
    };

    return c.json(updatePostResponseSchema.parse(response), 200);
  })

  .openapi(deletePostRoute, async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");

    await db.transaction(async (tx) => {
      const target = (
        await tx.select().from(postsTable).where(eq(postsTable.id, id))
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

      await tx.delete(postsTable).where(eq(postsTable.id, id));
    });

    return c.json(null, 200);
  });

export { routes as postApp };
