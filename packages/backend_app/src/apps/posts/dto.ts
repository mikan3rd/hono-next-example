import { z } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-zod";
import { postsTable } from "../../db/schema";

const postSelectSchema = createSelectSchema(postsTable);

export const getPostsResponseSchema = z.object({
  posts: postSelectSchema.array(),
});

export const postPostRequestSchema = z.object({
  name: z.string().min(1).openapi({
    example: "mikan3rd",
  }),
});
