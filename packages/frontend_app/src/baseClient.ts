import type { AppType } from "backend_app/src/apps";
import { hc } from "hono/client";
import { env } from "./env";
export const baseClient = hc<AppType>(env.NEXT_PUBLIC_BACKEND_APP_URL);
