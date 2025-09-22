import { createApp } from "../factory";
import { signupRoute } from "./route";

const userApp = createApp();

userApp.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const routes = createApp().openapi(signupRoute, async (c) => {
  return c.json({ status: "ok" }, 200);
});

export { routes as userApp };
