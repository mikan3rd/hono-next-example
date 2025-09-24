import { createClient } from "@supabase/supabase-js";
import { createMiddleware } from "hono/factory";
import type { HonoEnv } from "../../apps/context";
import type { ErrorResponse } from "../../dto/output/error";
import { env } from "../../env";

export const jwtMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const credentials = c.req.header("Authorization");
  if (!credentials) {
    return c.json<ErrorResponse>(
      { code: "Unauthorized", message: "Missing authorization header" },
      401,
    );
  }

  const [_, token] = credentials.split(/\s+/);
  if (!token) {
    return c.json<ErrorResponse>(
      { code: "Unauthorized", message: "Missing token" },
      401,
    );
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
  const claims = await supabase.auth.getClaims(token);
  if (claims.error !== null) {
    return c.json<ErrorResponse>(
      { code: "Unauthorized", message: claims.error.message },
      401,
    );
  }

  if (claims.data === null) {
    return c.json<ErrorResponse>(
      { code: "Unauthorized", message: "No claims found" },
      401,
    );
  }

  c.set("jwtToken", token);
  c.set("jwtClaims", claims.data.claims);

  await next();
});
