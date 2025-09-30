import type { usersTable } from "./schema";

// TODO: displayName などを追加したい
type UserPublicField = Extract<keyof typeof usersTable.$inferSelect, "id">;

export const userPublicFields: Record<UserPublicField, true> = {
  id: true,
};
