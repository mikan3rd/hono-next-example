import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
};

export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: text(),
  ...timestamps,
});
