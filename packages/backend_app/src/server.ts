import { app } from "@/apps";

export default {
  port: Number(process.env.BACKEND_APP_PORT),
  fetch: app.fetch,
};
