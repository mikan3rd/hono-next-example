import { db } from "../../db";
import { usersTable } from "../../db/schema";
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
  const { sub: supabase_uid } = c.get("jwtClaims");
  await db.insert(usersTable).values({ supabase_uid });
  return c.json(null, 200);
});

export { routes as userApp };
