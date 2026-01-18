import { z } from "@hono/zod-openapi";
import { postsTable } from "../../db/schema";
import { createInsertSchema, createUpdateSchema } from "../factory";
import { userSelectSchema } from "../user/dto";

export const postSchema = z
  .object({
    public_id: z.uuid().openapi({
      description: "Public ID",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    content: z.string().openapi({
      description: "The content of the post",
      example: "test",
    }),
    created_at: z.iso.datetime().openapi({
      description: "The date and time the post was originally created",
      example: "2025-01-01T00:00:00Z",
      format: "date-time",
    }),
    updated_at: z.iso.datetime().openapi({
      description:
        "The date and time the post was created (or last updated in case of delete&insert)",
      example: "2025-01-01T00:00:00Z",
      format: "date-time",
    }),
  })
  .openapi("post");

// DB データから API レスポンス形式への変換関数
export const transformPost = (post: {
  public_id: string;
  content: string;
  first_created_at: Date;
  created_at: Date;
}): z.infer<typeof postSchema> => ({
  public_id: post.public_id,
  content: post.content,
  created_at: post.first_created_at.toISOString(), // first_created_at → created_at
  updated_at: post.created_at.toISOString(), // created_at → updated_at
});

// user 付きの変換関数
export const transformPostWithUser = <
  T extends {
    public_id: string;
    content: string;
    first_created_at: Date;
    created_at: Date;
    user: z.infer<typeof userSelectSchema>;
  },
>(
  post: T,
): z.infer<typeof postWithUserResponseSchema> => ({
  ...transformPost(post),
  user: post.user,
});

export const postWithUserResponseSchema = postSchema.and(
  z.object({
    user: userSelectSchema,
  }),
);

export const getPostsResponseSchema = z.object({
  posts: postWithUserResponseSchema.array(),
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
  post: postWithUserResponseSchema,
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
