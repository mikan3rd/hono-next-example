import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const primaryKeys = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
};

const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const usersTable = pgTable("users", {
  ...primaryKeys,
  supabase_uid: uuid().unique().notNull(),
  ...timestamps,
});

export const postsTable = pgTable("posts", {
  ...primaryKeys,
  content: text().notNull(),
  ...timestamps,
});
