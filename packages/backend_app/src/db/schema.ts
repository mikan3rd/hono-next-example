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

const primaryKeyFactories = {
  entity: () => ({
    id: integer().primaryKey().generatedAlwaysAsIdentity(), // TODO: uuid v7 を検討
    public_id: uuid().unique().notNull(),
  }),
  log: () => ({
    id: integer().notNull(),
    public_id: uuid().notNull(),
  }),
} as const;

const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
};

const postTableColumns = {
  user_id: integer()
    .notNull()
    .references(() => usersTable.id),
  content: text().notNull(),
  first_created_at: timestamp().defaultNow().notNull(),
  ...timestamps,
};

export const usersTable = pgTable("users", {
  ...primaryKeyFactories.entity(),
  supabase_uid: uuid().unique().notNull(),
  display_name: text().notNull(),
  ...timestamps,
});

export const postsTable = pgTable("posts", {
  ...primaryKeyFactories.entity(),
  ...postTableColumns,
});

export const postsRelations = relations(postsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [postsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const postLogsTable = pgTable("post_logs", {
  log_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  ...primaryKeyFactories.log(),
  ...postTableColumns,
  event_type: postLogEventEnum("event_type").notNull(),
  occurred_at: timestamp().defaultNow().notNull(),
});
