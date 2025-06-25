import { z } from "zod";

const postSelectSchema = z.object({
  id: z.number(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.string(),
});

export const getPostsResponseSchema = z.object({
  posts: postSelectSchema.array(),
});

export const postPostRequestSchema = z.object({
  content: z.string().min(1),
});

export const postPostResponseSchema = z.object({
  post: postSelectSchema,
});

export const updatePostParamsSchema = z.object({
  id: z.string().pipe(z.coerce.number().int().positive()),
});

export const updatePostRequestSchema = z.object({
  content: z.string().min(1),
});

export const updatePostResponseSchema = postPostResponseSchema;

export const deletePostParamsSchema = updatePostParamsSchema;
