import type { JwtPayload } from "@supabase/supabase-js";
import { getContext } from "hono/context-storage";

export type HonoEnv = {
  Variables: {
    requestId: string;
    jwtToken: string;
    jwtClaims: JwtPayload;
  };
};

export const getHonoContext = () => {
  return getContext<HonoEnv>();
};
