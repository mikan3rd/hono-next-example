import { app } from "@/backend/apps";
import { env } from "@/backend/env";

export default {
  port: env.BACKEND_APP_PORT,
  fetch: app.fetch,
};
