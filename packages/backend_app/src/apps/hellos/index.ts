import { OpenAPIHono } from "@hono/zod-openapi";
import { getHelloRoute, postHelloRoute } from "./route";

export const helloApp = new OpenAPIHono()
  .openapi(getHelloRoute, (c) => {
    const { name } = c.req.valid("query");
    return c.json({ message: `Hello ${name}!` });
  })
  .openapi(postHelloRoute, (c) => {
    const { name } = c.req.valid("json");
    return c.json({ message: `Hello ${name}!` });
  });
