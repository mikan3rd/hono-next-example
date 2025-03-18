import type { AppType } from "backend_app/src/apps";
import { hc } from "hono/client";
export const client = hc<AppType>("http://localhost:4300/");
