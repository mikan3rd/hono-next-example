import { createApp } from "../factory";
import { signupRoute } from "./route";

export const userApp = createApp().openapi(signupRoute, async (c) => {
  return c.json({ status: "ok" }, 200);
});
