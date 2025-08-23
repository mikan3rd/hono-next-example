import { beforeEach } from "bun:test";
import { sql } from "drizzle-orm";
import { db } from "../db";

export const truncateAllTables = async () => {
  const tables = await db.execute(
    sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `,
  );
  for (const table of tables.rows) {
    const query = sql.raw(
      `TRUNCATE TABLE ${table.table_name} RESTART IDENTITY CASCADE`,
    );
    await db.execute(query);
  }
};

beforeEach(async () => {
  await truncateAllTables();
});
