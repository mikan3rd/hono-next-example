import { eq } from "drizzle-orm";
import { every } from "hono/combine";
import { createMiddleware } from "hono/factory";
import type { HonoEnv } from "../../apps/context";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import type { ErrorResponse } from "../../dto/output/error";
import { jwtMiddleware } from "../jwt";

const baseUserMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const { sub: supabaseUid } = c.get("jwtClaims");
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.supabase_uid, supabaseUid),
  });

  if (!user) {
    return c.json<ErrorResponse>(
      { code: "Unauthorized", message: "User not found" },
      401,
    );
  }

  c.set("user", user);
  await next();
});

export const userMiddleware = every(jwtMiddleware, baseUserMiddleware);
