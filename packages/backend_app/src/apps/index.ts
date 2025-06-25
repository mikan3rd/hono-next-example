import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { createApp } from "./factory";
import { healthzApp } from "./healthz";
import { helloApp } from "./hellos";
import { postApp } from "./posts";

const app = createApp();

app.use(logger());

app.use("*", requestId());

app.use("*", cors());

app.route("/healthz", healthzApp);
app.route("/posts", postApp);
app.route("/hellos", helloApp);

export { app };
export type AppType = typeof app;
