import { helloApp } from "@/apps/hellos/index.js";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono()
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
export type AppType = typeof app;
