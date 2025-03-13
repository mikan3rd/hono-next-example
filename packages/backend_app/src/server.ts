import { app } from "@/backend/apps/index.js";
import { env } from "./env.js";

export default {
  port: env.BACKEND_APP_PORT,
  fetch: app.fetch,
};
