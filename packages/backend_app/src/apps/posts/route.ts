import { createRoute } from "@hono/zod-openapi";
import {
  getPostsResponseSchema,
  postPostRequestSchema,
  postPostResponseSchema,
} from "./dto";

export const getPostsRoute = createRoute({
  tags: ["posts"],
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "Hello message",
      content: {
        "application/json": {
          schema: getPostsResponseSchema,
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
          schema: postPostResponseSchema,
        },
      },
    },
    400: {
      description: "Bad Request",
    },
  },
});
