import type { AppType } from "backend_app/src/apps";
import { hc } from "hono/client";
export const baseClient = hc<AppType>("http://localhost:4300/"); // TODO: 環境変数から取得
