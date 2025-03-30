import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "../../db";
import { postsTable } from "../../db/schema";
import { getPostsRoute, postPostRoute } from "./route";

export const postApp = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      console.warn(result);
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400,
      );
    }
  },
})
  .openapi(getPostsRoute, async (c) => {
    const posts = await db.select().from(postsTable);
    return c.json({ posts });
  })
  .openapi(postPostRoute, async (c) => {
    const { content } = c.req.valid("json");
    const result = await db.insert(postsTable).values({ content }).returning();
    const post = result[0];
    if (!post) {
      return c.json(
        {
          code: 400,
          message: "Failed to create post",
        },
        400,
      );
    }
    return c.json({ post }, 200);
  });
