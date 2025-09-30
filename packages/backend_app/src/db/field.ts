import type { postsTable, usersTable } from "./schema";

// TODO: displayName などを追加したい
type UserPublicField = Extract<keyof typeof usersTable.$inferSelect, "id">;

export const userPublicFields: Record<UserPublicField, true> = {
  id: true,
};

type PostPublicField = Extract<
  keyof typeof postsTable.$inferSelect,
  "id" | "content" | "created_at" | "updated_at"
>;

export const postPublicFields: Record<PostPublicField, true> = {
  id: true,
  content: true,
  created_at: true,
  updated_at: true,
};
