import { jwtMiddleware } from "../../middlewares/jwt";
import { createApp } from "../factory";
import { signupRoute } from "./route";

const userApp = createApp();

userApp.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

userApp.use(jwtMiddleware);

const routes = userApp.openapi(signupRoute, async (c) => {
  // TODO: ユーザー登録
  return c.json({ status: "ok" }, 200);
});

export { routes as userApp };
