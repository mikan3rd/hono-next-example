import type { postsTable, usersTable } from "./schema";

export const userPublicFieldDefs = [
  "public_id",
  "display_name",
] satisfies (keyof typeof usersTable.$inferSelect)[];

export const postPublicFieldDefs = [
  "public_id",
  "content",
  "created_at",
] satisfies (keyof typeof postsTable.$inferSelect)[];

const createFieldsFromDefs = <T extends readonly string[]>(
  fieldDefs: T,
): { [K in T[number]]: true } => {
  return Object.fromEntries(fieldDefs.map((field) => [field, true])) as {
    [K in T[number]]: true;
  };
};

export const userPublicFields = createFieldsFromDefs(userPublicFieldDefs);

export const postPublicFields = createFieldsFromDefs(postPublicFieldDefs);
