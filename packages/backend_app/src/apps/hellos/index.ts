import { HTTPException } from "hono/http-exception";
import { createApp } from "../factory";
import { postHelloRequestSchema } from "./dto";

export const helloApp = createApp()
  .get("/", (c) => {
    const name = c.req.query("name");
    if (!name || name.length === 0) {
      throw new HTTPException(400, {
        message: "Name parameter is required",
      });
    }
    return c.json({ message: `Hello ${name}!` }, 200);
  })
  .post("/", async (c) => {
    const body = await c.req.json();
    const result = postHelloRequestSchema.safeParse(body);
    if (!result.success) {
      throw new HTTPException(400, {
        message: "Invalid request body",
      });
    }
    const { name } = result.data;
    return c.json({ message: `Hello ${name}!` }, 200);
  });
