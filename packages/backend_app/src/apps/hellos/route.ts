import { createRoute } from "@hono/zod-openapi";
import { messageSchema } from "../../schema/output/hello";
import { postHelloRequestSchema } from "./schema";

export const getHelloRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "Hello message",
      content: {
        "application/json": {
          schema: messageSchema,
        },
      },
    },
  },
});

export const postHelloRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: postHelloRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Hello message with name",
      content: {
        "application/json": {
          schema: messageSchema,
        },
      },
    },
    400: {
      description: "Bad Request",
    },
  },
});
