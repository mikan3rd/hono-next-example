import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DATABASE_URL } from "../env";
import * as schema from "./schema";

const client = postgres(DATABASE_URL, {
  onnotice: (notice) => {
    // To prevent truncateAllTables logs
    if (notice.code === "00000") {
      return;
    }
    // biome-ignore lint/suspicious/noConsole: ok
    return console.log(notice);
  },
});

export const db = drizzle({
  client,
  schema,
});
