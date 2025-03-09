import { app } from "@/index";

export default {
  port: Number(process.env.BACKEND_APP_PORT),
  fetch: app.fetch,
};
