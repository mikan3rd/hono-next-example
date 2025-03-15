import { app } from "@/apps";
import { env } from "./env";

export default {
  port: env.BACKEND_APP_PORT,
  fetch: app.fetch,
};
