import { getHelloRoute, postHelloRoute } from "@/routes/hellos";
import { OpenAPIHono } from "@hono/zod-openapi";

const helloApp = new OpenAPIHono()
  .openapi(getHelloRoute, (c) => {
    return c.json({ message: "Hello Hono!" });
  })
  .openapi(postHelloRoute, (c) => {
    const { name } = c.req.valid("json");
    return c.json({ message: `Hello ${name}!` });
  });

export { helloApp };
