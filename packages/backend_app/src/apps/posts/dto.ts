import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { postsTable } from "../../db/schema";

const postSelectSchema = createSelectSchema(postsTable).openapi("post");

export const getPostsResponseSchema = z.object({
  posts: postSelectSchema.array(),
});

export const postPostRequestSchema = createInsertSchema(postsTable, {
  content: (schema) => schema.min(1),
}).pick({
  content: true,
});

export const postPostResponseSchema = z.object({
  post: postSelectSchema,
});
