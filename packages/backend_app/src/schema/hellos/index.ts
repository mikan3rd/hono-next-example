import { z } from "@hono/zod-openapi";

export const messageSchema = z
  .object({
    message: z.string().openapi({
      example: "Hello Hono!",
    }),
  })
  .openapi("Message");

export const postHelloRequestSchema = z.object({
  name: z.string().min(1).openapi({
    example: "mikan3rd",
  }),
});
