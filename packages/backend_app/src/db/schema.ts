import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// TODO: uuid v7 を検討
const primaryKeys = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
};

const publicIdColumn = () => uuid().unique().notNull().defaultRandom();

const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const usersTable = pgTable("users", {
  ...primaryKeys,
  public_id: publicIdColumn(),
  supabase_uid: uuid().unique().notNull(),
  display_name: text().notNull(),
  ...timestamps,
});

export const postsTable = pgTable("posts", {
  ...primaryKeys,
  public_id: publicIdColumn(),
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
