import { createHonoApp } from "../factory";

export const healthzApp = createHonoApp().get("/", (c) => {
  return c.json({ status: "ok" });
});
