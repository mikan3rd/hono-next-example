import { OpenAPIHono } from "@hono/zod-openapi";
import { getPostsRoute, postPostRoute } from "./route";

export const postApp = new OpenAPIHono()
  .openapi(getPostsRoute, (c) => {
    const { name } = c.req.valid("query");
    return c.json({ message: `Hello ${name}!` });
  })
  .openapi(postPostRoute, (c) => {
    const { name } = c.req.valid("json");
    return c.json({ message: `Hello ${name}!` });
  });
