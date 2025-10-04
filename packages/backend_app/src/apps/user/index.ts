import { pick } from "es-toolkit";
import { db } from "../../db";
import { userPublicFieldDefs } from "../../db/field";
import { usersTable } from "../../db/schema";
import { jwtMiddleware } from "../../middlewares/jwt";
import { userMiddleware } from "../../middlewares/user";
import { createApp } from "../factory";
import { userSelectSchema } from "./dto";
import { getCurrentUserRoute, signupRoute } from "./route";

const userApp = createApp();

userApp.use("/signup", jwtMiddleware);
userApp.use("/current", userMiddleware);

const routes = userApp
  .openapi(signupRoute, async (c) => {
    const { sub: supabase_uid } = c.get("jwtClaims");
    const { display_name } = await c.req.valid("json");
    await db
      .insert(usersTable)
      .values({ supabase_uid, display_name })
      .onConflictDoNothing({ target: usersTable.supabase_uid });
    return c.json(null, 200);
  })

  .openapi(getCurrentUserRoute, async (c) => {
    const user = c.get("user");
    const publicUser = pick(user, userPublicFieldDefs);
    return c.json(userSelectSchema.parse(publicUser), 200);
  });

export { routes as userApp };
