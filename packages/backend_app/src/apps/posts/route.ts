import { createRoute } from "@hono/zod-openapi";
import { ErrorResponses } from "../../dto/output/error";
import {
  getPostsResponseSchema,
  postPostRequestSchema,
  postPostResponseSchema,
  updatePostParamsSchema,
  updatePostRequestSchema,
  updatePostResponseSchema,
} from "./dto";

export const getPostsRoute = createRoute({
  tags: ["posts"],
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "get posts",
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
      description: "create a post",
      content: {
        "application/json": {
          schema: postPostResponseSchema,
        },
      },
    },
    ...ErrorResponses,
  },
});

export const updatePostRoute = createRoute({
  tags: ["posts"],
  method: "put",
  path: "/{id}",
  request: {
    params: updatePostParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updatePostRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "update a post",
      content: {
        "application/json": {
          schema: updatePostResponseSchema,
        },
      },
    },
    ...ErrorResponses,
  },
});
