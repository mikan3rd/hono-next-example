import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { postsTable } from "../../db/schema";

const postSelectSchema = createSelectSchema(postsTable);
const postInsertSchema = createInsertSchema(postsTable);

export const getPostsResponseSchema = z.object({
  posts: postSelectSchema.array(),
});

export const postPostRequestSchema = postInsertSchema.pick({
  content: true,
});

export const postPostResponseSchema = postSelectSchema;
