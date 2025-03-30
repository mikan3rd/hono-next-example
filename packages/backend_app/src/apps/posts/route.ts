import { createRoute, z } from "@hono/zod-openapi";
import { messageSchema } from "../../dto/output/hello";
import { postPostRequestSchema } from "./dto";

export const getPostsRoute = createRoute({
  tags: ["posts"],
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
    },
  },
});

export const postPostRoute = createRoute({
  tags: ["posts"],
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: postPostRequestSchema,
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
