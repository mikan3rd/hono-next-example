import { z } from "@hono/zod-openapi";
import { postPublicFields } from "../../db/field";
import { postsTable } from "../../db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "../factory";
import { userSelectSchema } from "../user/dto";

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
  created_at: (schema) =>
    schema.openapi({
      description: "The date and time the post was created",
      example: "2025-01-01T00:00:00Z",
      format: "date-time",
    }),
  updated_at: (schema) =>
    schema.openapi({
      description: "The date and time the post was updated",
      example: "2025-01-01T00:00:00Z",
      format: "date-time",
    }),
})
  .pick(postPublicFields)
  .openapi("post");

export const getPostsResponseSchema = z.object({
  posts: postSelectSchema
    .extend({
      user: userSelectSchema,
    })
    .array(),
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
  id: z.coerce.number().int().positive(),
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

export const updatePostResponseSchema = postPostResponseSchema;

export const deletePostParamsSchema = updatePostParamsSchema;
