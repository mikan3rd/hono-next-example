import { createRoute } from "@hono/zod-openapi";
import { ErrorSchema } from "../../dto/output/error";
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
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});
