import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { createApp } from "./factory";
import { healthzApp } from "./healthz";
import { helloApp } from "./hellos";
import { initializeApp } from "./initialize";
import { postApp } from "./posts";

const app = createApp();

app.use(logger());

app.use("*", requestId());

app.use("*", cors());

app.route("/healthz", healthzApp);
app.route("/initialize", initializeApp);

const routes = app
  .route("/posts", postApp)
  .route("/hellos", helloApp)
  .doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "backend_app OpenAPI",
    },
  })
  .get(
    "/ui",
    swaggerUI({
      url: "/doc",
      docExpansion: "full",
    }),
  );

export { routes as app };
export type AppType = typeof routes;
