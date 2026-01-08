import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const primaryKeys = () => ({
  id: integer().primaryKey().generatedAlwaysAsIdentity(), // TODO: uuid v7 を検討
  public_id: uuid().unique().notNull(), // uuid v4
});

const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
};

export const usersTable = pgTable("users", {
  ...primaryKeys(),
  supabase_uid: uuid().unique().notNull(),
  display_name: text().notNull(),
  ...timestamps,
});

export const postsTable = pgTable("posts", {
  ...primaryKeys(),
  user_id: integer()
    .notNull()
    .references(() => usersTable.id),
  content: text().notNull(),
  ...timestamps,
});

export const postsRelations = relations(postsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [postsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const postLogsTable = pgTable("post_logs", {
  id: integer().primaryKey(),
  public_id: uuid().notNull(),
  user_id: integer().notNull(),
  content: text().notNull(),
  ...timestamps,
});
