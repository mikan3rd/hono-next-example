import { z } from "@hono/zod-openapi";
import { postsTable } from "../../db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "../factory";

const postSelectSchema = createSelectSchema(postsTable, {
  id: (schema) =>
    schema.openapi({
      description: "Primary ID",
      example: 1,
    }),
  content: (schema) =>
    schema.openapi({
      description: "The content of the post",
      example: "test",
    }),
}).openapi("post");

export const getPostsResponseSchema = z.object({
  posts: postSelectSchema.array(),
});

export const postPostRequestSchema = createInsertSchema(postsTable, {
  content: (schema) =>
    schema.min(1).openapi({
      description: "The content of the post",
      example: "test",
    }),
}).pick({
  content: true,
});

export const postPostResponseSchema = z.object({
  post: postSelectSchema,
});

export const updatePostParamsSchema = z.object({
  // FIXME: coerce を使うと nullable になってしまう
  id: z.coerce.number().openapi({
    description: "Primary ID",
    example: 1,
  }),
});

export const updatePostRequestSchema = createUpdateSchema(postsTable, {
  content: (schema) =>
    schema.min(1).openapi({
      description: "The content of the post",
      example: "test",
    }),
}).pick({
  content: true,
});
