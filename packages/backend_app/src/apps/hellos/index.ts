import { OpenAPIHono } from "@hono/zod-openapi";
import { getHelloRoute, postHelloRoute } from "../../routes/hellos";

const helloApp = new OpenAPIHono()
  .openapi(getHelloRoute, (c) => {
    return c.json({ message: "Hello Hono!" });
  })
  .openapi(postHelloRoute, (c) => {
    const { name } = c.req.valid("json");
    return c.json({ message: `Hello ${name}!` });
  });

export { helloApp };
