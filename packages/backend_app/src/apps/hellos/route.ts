import { createRoute, z } from "@hono/zod-openapi";
import { messageSchema } from "../../schema/output/hello";
import { postHelloRequestSchema } from "./schema";

export const getHelloRoute = createRoute({
  tags: ["sample"],
  method: "get",
  path: "/",
  request: {
    query: z.object({
      name: z.string().openapi({
        param: {
          description: "Name",
        },
      }),
    }),
  },
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
  tags: ["sample"],
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
