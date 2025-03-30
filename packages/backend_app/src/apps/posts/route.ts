import { createRoute } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-zod";
import { postsTable } from "../../db/schema";
import { messageSchema } from "../../dto/output/hello";
import { postPostRequestSchema } from "./dto";

const postSelectSchema = createSelectSchema(postsTable);

export const getPostsRoute = createRoute({
  tags: ["posts"],
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "Hello message",
      content: {
        "application/json": {
          schema: {
            posts: postSelectSchema.array(),
          },
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
