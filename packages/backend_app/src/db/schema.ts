import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const postLogEventEnum = pgEnum("post_log_event", [
  "created",
  "updated",
  "deleted",
]);

const primaryKeys = () => ({
  id: integer().primaryKey().generatedAlwaysAsIdentity(), // TODO: uuid v7 を検討
  public_id: uuid().unique().notNull(), // uuid v4
});

const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
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
  first_created_at: timestamp().defaultNow().notNull(), // 作成時は DB デフォルト。更新時は直前行から引き継ぐ
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
  first_created_at: timestamp().notNull(),
  event_type: postLogEventEnum("event_type").notNull(),
  occurred_at: timestamp().defaultNow().notNull(),
  created_at: timestamp().notNull(),
});
