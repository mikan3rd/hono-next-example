import type { postsTable, usersTable } from "./schema";

// TODO: displayName などを追加したい
export const userPublicFieldDefs = [
  "id",
] satisfies (keyof typeof usersTable.$inferSelect)[];

export const userPublicFields: Record<
  (typeof userPublicFieldDefs)[number],
  true
> = {
  id: true,
};

export const postPublicFieldDefs = [
  "id",
  "content",
  "created_at",
  "updated_at",
] satisfies (keyof typeof postsTable.$inferSelect)[];

export const postPublicFields: Record<
  (typeof postPublicFieldDefs)[number],
  true
> = {
  id: true,
  content: true,
  created_at: true,
  updated_at: true,
};
