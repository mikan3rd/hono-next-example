import { z } from "@hono/zod-openapi";

export const messageSchema = z
  .object({
    message: z.string().openapi({
      example: "Hello Hono!",
    }),
  })
  .openapi("Message");
