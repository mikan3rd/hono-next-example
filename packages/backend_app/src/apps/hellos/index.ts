import { createApp } from "../factory";
import { getHelloRoute, postHelloRoute } from "./route";

export const helloApp = createApp()
  .openapi(getHelloRoute, (c) => {
    const { name } = c.req.valid("query");
    return c.json({ message: `Hello ${name}!` }, 200);
  })
  .openapi(postHelloRoute, (c) => {
    const { name } = c.req.valid("json");
    return c.json({ message: `Hello ${name}!` }, 200);
  });
