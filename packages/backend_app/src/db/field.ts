import type { postsTable, usersTable } from "./schema";

// TODO: displayName などを追加したい
export const userPublicFieldDefs = [
  "id",
] satisfies (keyof typeof usersTable.$inferSelect)[];

export const postPublicFieldDefs = [
  "id",
  "content",
  "created_at",
  "updated_at",
] satisfies (keyof typeof postsTable.$inferSelect)[];

const createFieldsFromDefs = <T extends readonly string[]>(
  fieldDefs: T,
): Record<T[number], true> => {
  return fieldDefs.reduce(
    (acc, field) => {
      acc[field as T[number]] = true;
      return acc;
    },
    {} as Record<T[number], true>,
  );
};

export const userPublicFields = createFieldsFromDefs(userPublicFieldDefs);

export const postPublicFields = createFieldsFromDefs(postPublicFieldDefs);
