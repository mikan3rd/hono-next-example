import type { JwtPayload } from "@supabase/supabase-js";
import { getContext } from "hono/context-storage";
import type { usersTable } from "../db/schema";

export type HonoEnv = {
  Variables: {
    requestId: string;
    jwtToken: string;
    jwtClaims: JwtPayload;
    user: typeof usersTable.$inferSelect;
  };
};

export const getHonoContext = () => {
  return getContext<HonoEnv>();
};
