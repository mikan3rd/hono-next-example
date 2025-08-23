import { env } from "../../env";
import { truncateAllTables } from "../../test/initialize";
import { createHonoApp } from "../factory";

export const initializeApp = createHonoApp().post("/", async (c) => {
  if (env.ENABLE_DB_INITIALIZE) {
    await truncateAllTables();
    return c.json({ status: "ok" }, 200);
  }
  return c.json({ status: "forbidden" }, 403);
});
