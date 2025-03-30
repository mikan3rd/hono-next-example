import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { helloApp } from "./hellos";
import { postApp } from "./posts";

const app = new OpenAPIHono();

app.use(logger());

app.use("*", cors());

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
