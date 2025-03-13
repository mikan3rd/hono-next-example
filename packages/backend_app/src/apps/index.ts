import { helloApp } from "@/apps/hellos/index.js";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";

const app = new OpenAPIHono();

app.use("*", cors());

const routes = app
  .route("/hellos", helloApp)
  .doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "backend_app OpenAPI",
    },
  })
  .get("/ui", swaggerUI({ url: "/doc" }));

export { app };
export type AppType = typeof routes;
