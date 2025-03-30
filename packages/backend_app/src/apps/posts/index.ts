import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "../../db";
import { postsTable } from "../../db/schema";
import { getPostsRoute, postPostRoute } from "./route";

export const postApp = new OpenAPIHono()
  .openapi(getPostsRoute, async (c) => {
    const posts = await db.select().from(postsTable);
    return c.json({ posts });
  })
  .openapi(postPostRoute, async (c) => {
    const { content } = c.req.valid("json");
    const result = await db.insert(postsTable).values({ content }).returning();
    const post = result[0];
    if (!post) throw new Error("Failed to create post");
    return c.json({ post });
  });
