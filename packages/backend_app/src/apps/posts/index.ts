import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "../../db";
import { postsTable } from "../../db/schema";
import { getPostsRoute, postPostRoute } from "./route";

export const postApp = new OpenAPIHono()
  .openapi(getPostsRoute, async (c) => {
    const posts = await db.select().from(postsTable);
    return c.json({ posts });
  })
  .openapi(postPostRoute, (c) => {
    const { name } = c.req.valid("json");
    return c.json({ message: `Hello ${name}!` });
  });
