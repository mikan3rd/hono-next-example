import { z } from "@hono/zod-openapi";

export const postHelloRequestSchema = z.object({
  name: z.string().min(1).openapi({
    example: "mikan3rd",
  }),
});
