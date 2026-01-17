import { z } from "@hono/zod-openapi";
import { postPublicFields } from "../../db/field";
import { postsTable } from "../../db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "../factory";
import { userSelectSchema } from "../user/dto";

// 内部スキーマ（DBの構造を反映）
const postSelectSchemaInternal = createSelectSchema(postsTable, {
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
  first_created_at: (schema) =>
    schema.openapi({
      description: "The date and time the post was originally created",
      example: "2025-01-01T00:00:00Z",
      format: "date-time",
    }),
  created_at: (schema) =>
    schema.openapi({
      description:
        "The date and time the post was created (or last updated in case of delete&insert)",
      example: "2025-01-01T00:00:00Z",
      format: "date-time",
    }),
})
  .pick(postPublicFields)
  .strict();

// レスポンス用スキーマ（フィールド名を変換）
const postSelectSchemaBase = z.object({
  public_id: z.string().uuid().openapi({
    description: "Public ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
  content: z.string().openapi({
    description: "The content of the post",
    example: "test",
  }),
  created_at: z.string().datetime().openapi({
    description: "The date and time the post was originally created",
    example: "2025-01-01T00:00:00Z",
    format: "date-time",
  }),
  updated_at: z.string().datetime().openapi({
    description:
      "The date and time the post was created (or last updated in case of delete&insert)",
    example: "2025-01-01T00:00:00Z",
    format: "date-time",
  }),
});

// Post単体のスキーマ（変換を含む、OpenAPI定義用）
export const postSelectSchema = postSelectSchemaInternal
  .transform((data) => ({
    public_id: data.public_id,
    content: data.content,
    created_at: data.first_created_at.toISOString(), // first_created_at → created_at
    updated_at: data.created_at.toISOString(), // created_at → updated_at
  }))
  .pipe(postSelectSchemaBase)
  .openapi("post");

// Post with Userのスキーマ（変換を含む）
export const postWithUserSelectSchema = postSelectSchemaInternal
  .extend({
    user: userSelectSchema,
  })
  .transform((data) => ({
    public_id: data.public_id,
    content: data.content,
    created_at: data.first_created_at.toISOString(), // first_created_at → created_at
    updated_at: data.created_at.toISOString(), // created_at → updated_at
    user: data.user,
  }))
  .pipe(
    postSelectSchemaBase.extend({
      user: userSelectSchema,
    }),
  );

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
