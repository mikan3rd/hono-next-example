import { z } from "@hono/zod-openapi";
import { postsTable } from "../../db/schema";
import { createInsertSchema, createSelectSchema } from "../factory";

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
