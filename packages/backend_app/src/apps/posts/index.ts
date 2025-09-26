import { desc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "../../db";
import { postsTable, usersTable } from "../../db/schema";
import { jwtMiddleware } from "../../middlewares/jwt";
import { createApp } from "../factory";
import {
  deletePostRoute,
  getPostsRoute,
  postPostRoute,
  updatePostRoute,
} from "./route";

const postApp = createApp();

postApp.post("/", jwtMiddleware);
postApp.use("/:id", jwtMiddleware);

const routes = postApp
  .openapi(getPostsRoute, async (c) => {
    const posts = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.id));
    return c.json({ posts }, 200);
  })
  .openapi(postPostRoute, async (c) => {
    const { sub: supabase_uid } = c.get("jwtClaims");
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.supabase_uid, supabase_uid));
    const user = users[0];
    if (!user) {
      throw new HTTPException(401, {
        message: "User is not found",
      });
    }

    const { content } = c.req.valid("json");
    const result = await db
      .insert(postsTable)
      .values({ user_id: user.id, content })
      .returning();
    const post = result[0];
    if (!post)
      throw new HTTPException(500, {
        message: "Failed to create post",
      });
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
        throw new HTTPException(404, {
          message: "Post is not found",
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
        throw new HTTPException(404, {
          message: "Post is not found",
        });
      }

      await tx.delete(postsTable).where(eq(postsTable.id, id));
    });

    return c.json(null, 200);
  });

export { routes as postApp };
