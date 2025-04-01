import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "../env";
import * as schema from "./schema";

export const db = drizzle({
  connection: {
    connectionString: DATABASE_URL,
  },
  schema,
});
