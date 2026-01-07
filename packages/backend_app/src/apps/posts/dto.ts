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
  public_id: (schema) =>
    schema.openapi({
      description: "Public ID",
      example: "123e4567-e89b-12d3-a456-426614174000",
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
})
  .pick(postPublicFields)
  .strict()
  .openapi("post");

export const postWithUserSelectSchema = postSelectSchema.extend({
  user: userSelectSchema,
});

export const getPostsResponseSchema = z.object({
  posts: postWithUserSelectSchema.array(),
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
  post: postWithUserSelectSchema,
});

export const updatePostParamsSchema = z.object({
  public_id: z.uuid(),
});

export const updatePostRequestSchema = createUpdateSchema(postsTable, {
  content: (schema) =>
    schema.min(1).openapi({
      description: "The content of the post",
      example: "test",
    }),
})
  .pick({
    content: true,
  })
  .required();

export const updatePostResponseSchema = postPostResponseSchema;

export const deletePostParamsSchema = updatePostParamsSchema;
