import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema } from "../../dto/output/error";
import { messageSchema } from "../../dto/output/hello";
import { postHelloRequestSchema } from "./dto";

export const getHelloRoute = createRoute({
  tags: ["sample"],
  method: "get",
  path: "/",
  request: {
    query: z.object({
      name: z
        .string()
        .min(1)
        .openapi({
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
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: ErrorSchema,
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
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});
