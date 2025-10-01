import { createRoute } from "@hono/zod-openapi";
import { ErrorResponses } from "../../dto/output/error";
import {
  deletePostParamsSchema,
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
    ...ErrorResponses,
  },
});

export const postPostRoute = createRoute({
  tags: ["posts"],
  method: "post",
  path: "/",
  security: [{ bearerAuth: [] }],
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
  path: "/{public_id}",
  security: [{ bearerAuth: [] }],
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

export const deletePostRoute = createRoute({
  tags: ["posts"],
  method: "delete",
  path: "/{public_id}",
  security: [{ bearerAuth: [] }],
  request: {
    params: deletePostParamsSchema,
  },
  responses: {
    200: {
      description: "delete a post",
    },
    ...ErrorResponses,
  },
});
